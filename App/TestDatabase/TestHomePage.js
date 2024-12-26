import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  Dimensions,
  Text,
  Image,
  Pressable,
  Animated,
  Easing,
  TouchableOpacity,
  FlatList,
  StatusBar
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Circle, Polygon } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseAuth, firestoreDB } from "../../FirebaseConfig";

import { signOut } from "firebase/auth";

import { getDocs, collection } from "firebase/firestore";

import { useLoader } from "../LoaderContextPage";

import debounce from "lodash.debounce";

import * as ParkAndRideSqliteService from "../SqliteService/park_and_ride_sqliteService";
import * as PublicParkingSqliteService from "../SqliteService/public_parking_sqliteService";
import * as ParkingSpacesProprietySqliteService from "../SqliteService/on_street_acar_sqliteService";
import * as ParkingSpacesSqliteService from "../SqliteService/on_street_supply_pt_sqliteService";
import * as FireBaseUploader from "../Database/firebaseUploader";
import * as OpenRouteServise from "../ApiService/openRouteService";

export default function App({ navigation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [spotsDatabase, setSpotsDatabase] = useState([]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const [park_and_ride, setPark_and_ride] = useState([]);
  const [public_parking, setPublic_parking] = useState([]);
  const [on_street_parking, setOn_street_parking] = useState([]);
  const [showZoomMessage, setShowZoomMessage] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedSuggestions, setSearchedSuggestions] = useState([]);
  const [searchedLocations, setSearchedLocations] = useState([]);

  const [region, setRegion] = useState({
    latitude: 50.8503,
    longitude: 4.3517,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const slideAnim = useRef(
    new Animated.Value(-Dimensions.get("window").width * 0.6)
  ).current;

  const mapRef = useRef(null);

  const handleSearch = async (text) => {
    if (!searchText) {
      return;
    }

    try {
      setSearchedLocations([]);
      setSearchedSuggestions([]);

      const data = await OpenRouteServise.geocodeAutocompleteService(text);

      const suggestions = data.features.map((feature) => ({
        id: feature.properties.id || Math.random().toString(),
        name: feature.properties.label || "No label available",
        coordinates: feature.geometry.coordinates,
        country: feature.properties.country || "Unknown",
        region: feature.properties.region || "Unknown",
      }));

      setSearchedSuggestions(suggestions);

      if (suggestions.length === 1) {
        const [longitude, latitude] = suggestions[0].coordinates;
        const newRegion = {
          longitude,
          latitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        };

        setSearchedLocations(suggestions);
        setRegion(newRegion);
        mapRef.current.animateToRegion(newRegion, 1000);
      } else {
        const coordinates = suggestions.map((item) => item.coordinates);
        const minLongitude = Math.min(...coordinates.map(([lng, lat]) => lng));
        const maxLongitude = Math.max(...coordinates.map(([lng, lat]) => lng));
        const minLatitude = Math.min(...coordinates.map(([lng, lat]) => lat));
        const maxLatitude = Math.max(...coordinates.map(([lng, lat]) => lat));

        const latitudeDelta = maxLatitude - minLatitude;
        const longitudeDelta = maxLongitude - minLongitude;

        const newRegion = {
          latitude: (maxLatitude + minLatitude) / 2,
          longitude: (maxLongitude + minLongitude) / 2,
          latitudeDelta: latitudeDelta * 1.2,
          longitudeDelta: longitudeDelta * 1.2,
        };

        setSearchedLocations(suggestions);
        setRegion(newRegion);
      }

      console.log(suggestions);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    const [longitude, latitude] = suggestion.coordinates;
    const newRegion = {
      longitude,
      latitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    };

    setSearchText(suggestion.name);
    setSearchedLocations([suggestion]);
    setSearchedSuggestions([]);
    setRegion(newRegion);
    mapRef.current.animateToRegion(newRegion, 1000);
    setSearchText("");
  };

  const debouncedHandleSearch = debounce((text) => {
    handleSearch(text);
  }, 300);

  const fetchUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const userRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setUserLocation(userRegion);

      if (mapRef.current) {
        mapRef.current.animateToRegion(userRegion, 1000);
      }
    } catch (error) {
      Alert.alert("Error", `Failed to fetch location: ${error.message}`);
    }
  };

  const fetchSpots = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestoreDB, "spots"));
      const spots = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        latitude: doc.data().coords.latitude,
        longitude: doc.data().coords.longitude,
        title: doc.data().title || `Spot ${doc.id}`,
        status: doc.data().status,
        timestamp: doc.data().timestamp,
      }));
      setSpotsDatabase(spots);
    } catch (error) {
      Alert.alert("Error", `Failed to load spots: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUserLocation();
    fetchSpots();
  }, []);

  useEffect(() => {
    const initializeParkAndRide = async () => {
      try {
        showLoader();
        //await ParkAndRideSqliteService.deleteDatabase();
        await ParkAndRideSqliteService.initializeDatabase(
          showLoader,
          hideLoader
        );
        const parkAndRideData =
          await ParkAndRideSqliteService.fetchSelectedData();
        setPark_and_ride(parkAndRideData);
        //console.log("park_and_ride", parkAndRideData);
        console.log("park_and_ride initialized successfully.");
      } catch (error) {
        console.error("ParkAndRide initialization failed:", error);
      } finally {
        hideLoader();
      }
    };

    initializeParkAndRide();
  }, []);

  useEffect(() => {
    const initializePublicParking = async () => {
      try {
        showLoader();
        //await PublicParkingSqliteService.deleteDatabase();
        await PublicParkingSqliteService.initializeDatabase(
          showLoader,
          hideLoader
        );
        const publicParkingData =
          await PublicParkingSqliteService.fetchSelectedData();
        setPublic_parking(publicParkingData);
        //console.log("public_parking", publicParkingData);
        console.log("public_parking initialized successfully.");
      } catch (error) {
        console.error("PublicParking initialization failed:", error);
      } finally {
        hideLoader();
      }
    };

    initializePublicParking();
  }, []);

  const [
    isParkingSpacesDatabaseInitialized,
    setIsParkingSpacesDatabaseInitialized,
  ] = useState(false);

  useEffect(() => {
    const initializeParkingSpaces = async () => {
      try {
        showLoader();
        await ParkingSpacesSqliteService.initializeDatabase(
          showLoader,
          hideLoader
        );
        setIsParkingSpacesDatabaseInitialized(true);

        console.log("ParkingSpaces database initialized successfully.");
      } catch (error) {
        console.error("ParkingSpaces database initialization failed:", error);
      } finally {
        hideLoader();
      }
    };

    initializeParkingSpaces();
  }, []);

  useEffect(() => {
    const initializeParkingSpaces = async () => {
      try {
        showLoader();
        //await ParkingSpacesSqliteService.deleteDatabase();
        // await ParkingSpacesSqliteService.initializeDatabase(
        //   showLoader,
        //   hideLoader
        // );

        // const allParkingSpaces = await ParkingSpacesSqliteService.fetchAllData();
        // setOn_street_parking(allParkingSpaces);

        if (region.latitudeDelta <= 0.015 && region.longitudeDelta <= 0.015) {
          const visibleParkingSpaces =
            await ParkingSpacesSqliteService.fetchVisibleData(region, 1.5);
          console.log("gorunur data aliniyor");

          setOn_street_parking(visibleParkingSpaces);
          console.log("gorunur data eklendi");
        } else {
          console.log("lokasyonlari gormek için haritayi yakinlastir");
        }

        console.log("ParkingSpaces initialized successfully.");
      } catch (error) {
        console.error("ParkingSpaces initialization failed:", error);
      } finally {
        hideLoader();
      }
    };

    initializeParkingSpaces();
  }, [isParkingSpacesDatabaseInitialized, region]);

  useEffect(() => {
    if (region.latitudeDelta <= 0.006 && region.longitudeDelta <= 0.006) {
      if (showZoomMessage) {
        setShowZoomMessage(false);
      }
    } else {
      if (!showZoomMessage) {
        setShowZoomMessage(true);
      }
    }
  }, [region, showZoomMessage]);

  // const [dataDeneme, setDataDeneme] = useState([]);

  // useEffect(() => {
  //   const fetchVisibleData = async (expansionFactor = 1) => {
  //     const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  //     const expandedLatitudeDelta = latitudeDelta * expansionFactor;
  //     const expandedLongitudeDelta = longitudeDelta * expansionFactor;

  //     const northEastLat = latitude + expandedLatitudeDelta / 2;
  //     const northEastLng = longitude + expandedLongitudeDelta / 2;
  //     const southWestLat = latitude - expandedLatitudeDelta / 2;
  //     const southWestLng = longitude - expandedLongitudeDelta / 2;

  //     const result = on_street_parking.filter((item) => {
  //       return (
  //         item.latitude >= southWestLat &&
  //         item.latitude <= northEastLat &&
  //         item.longitude >= southWestLng &&
  //         item.longitude <= northEastLng
  //       );
  //     });

  //     if (region.latitudeDelta < 0.01 && region.longitudeDelta < 0.01) {
  //       setDataDeneme(result);
  //     }
  //   };

  //   fetchVisibleData();
  // }, [region]);

  // useEffect(() => {
  //   const initializeParkingSpacesPropriety = async () => {
  //     try {
  //       showLoader();
  //       //await ParkingSpacesProprietySqliteService.deleteDatabase();
  //       await ParkingSpacesProprietySqliteService.initializeDatabase(showLoader, hideLoader);
  //       //const parkingPropriety = await ParkingSpacesProprietySqliteService.fetchAllData();

  //       const parkingPropriety = await ParkingSpacesProprietySqliteService.fetchVisibleData(region, 5);

  //       if(region.latitudeDelta <= 0.005 && region.longitudeDelta <= 0.005){

  //         setOn_street_acar(parkingPropriety);
  //         console.log("lokasyonlari gormek için haritayi yakinlastir");
  //       }
  //       //console.log("on_street_acar", on_street_acar);
  //       console.log("on_street_acar initialized successfully.");
  //     } catch (error) {
  //       console.error("ParkingSpacesPropriety initialization failed:", error);
  //     } finally {
  //       hideLoader();
  //     }
  //   };

  //   initializeParkingSpacesPropriety();
  // }, [region]);

  //clear all databases

  // useEffect(() => {
  //   const setupDatabases = async () => {
  //     try {
  //       await ParkAndRideSqliteService.deleteDatabase();
  //       await PublicParkingSqliteService.deleteDatabase();
  //       await ParkingSpacesProprietySqliteService.deleteDatabase();
  //       await ParkingSpacesSqliteService.deleteDatabase();
  //       console.log("Databases deleted successfully.");
  //     } catch (error) {
  //       Alert.alert(
  //         "Error",
  //         `Database initialization failed: ${error.message}`
  //       );
  //     }
  //   };
  //   setupDatabases();
  // }, []);

  //Update document

  // example code
  const handleUpdateSpot = () => {
    const spotId = "spot123";

    // updated spot informations
    const updatedData = {
      title: "Updated Spot Title",
      status: "unavailable",
      timestamp: new Date().toISOString(),
      //timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    updateSpot(spotId, updatedData);
  };

  const updateSpot = async (spotId, updatedData) => {
    try {
      const spotRef = doc(firestoreDB, "spots", spotId);

      await updateDoc(spotRef, updatedData);
      Alert.alert("Success", "Spot has been updated successfully.");
    } catch (error) {
      Alert.alert("Error", `Failed to update spot: ${error.message}`);
    }
  };

  // Menü açma/kapama
  const toggleAccountMenu = () => {
    Animated.timing(slideAnim, {
      toValue: showAccountMenu ? -Dimensions.get("window").width * 0.6 : 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setShowAccountMenu(!showAccountMenu));
  };

  // Çıkış yapma
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await signOut(firebaseAuth);
      Alert.alert("Logged Out", "You have successfully logged out.");
      navigation.replace("FrontPage");
    } catch (error) {
      Alert.alert("Logout Failed", `Error: ${error.message}`);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <View style={styles.container}>
          {/* Menü ve arama */}
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={toggleAccountMenu}>
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color="black"
                />
              </TouchableOpacity>

              <TextInput
                style={styles.searchInput}
                placeholder="Search for a location"
                onChangeText={(text) => {
                  setSearchText(text);
                  debouncedHandleSearch(text);
                }}
                value={searchText}
              />
            </View>
            {searchedSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={searchedSuggestions}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => handleSuggestionSelect(item)}
                    >
                      <Text style={styles.suggestionText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
          {/* Sol taraftan açılan menü */}
          <Animated.View
            style={[
              styles.accountMenu,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            {/* Çarpı butonu */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleAccountMenu}
            >
              <View style={styles.closeButtonContainer}>
                <Ionicons name="close" size={24} color="white" />
              </View>
            </TouchableOpacity>

            <View style={styles.topSection}>
              <Text style={styles.accountText}>User Menu</Text>
            </View>

            <View style={styles.avatarContainer}>
              <Image
                source={require("../../assets/Profile.png")}
                style={styles.avatar}
              />
            </View>

            <View style={styles.middleSection}>
              <TouchableOpacity style={styles.menuButton}>
                <Text style={styles.menuButtonText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate("TestProfilePage")}
              >
                <Text style={styles.menuButtonText}>Update Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuButton}>
                <Text style={styles.menuButtonText}>My Points</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuButton}>
                <Text style={styles.menuButtonText}>Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Log out</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Harita */}
          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
          >
            {/* Kullanıcı konumu */}
            {userLocation && (
              <Marker coordinate={userLocation} title="Your Location">
                <Image
                  source={require("../../assets/car.png")}
                  style={styles.markerImage}
                />
              </Marker>
            )}

            {/* Firestore marker'ları */}
            {/* {spotsDatabase.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{
              latitude: spot.latitude,
              longitude: spot.longitude,
            }}
            title={spot.title}
            pinColor={spot.status === "available" ? "green" : "red"}
          />
          
        ))} */}

            {/* {spotsDatabase.map((item, index) => (
          <React.Fragment key={index}>
            <Circle
              //key={index}
              center={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              radius={5}
              fillColor="blue"
              strokeColor="rgba(0,0,0,0)"
            />

            <Marker
              
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={item.title}
              opacity={0}
              onPress={() => {
                console.log("pressed");
              }}
            />
          </React.Fragment>
        ))} */}

            {public_parking.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={item.name_du}
                description={`Capacity (Car): ${item.capacity_car}, Status: ${item.status}, Timestamp: ${item.timestamp}`}
                image={require("../../assets/parking40.png")}
                onPress={() => {
                  console.log(
                    `public parking selected latitude: ${item.latitude}, longitude: ${item.longitude}`
                  );
                }}
              ></Marker>
            ))}

            {park_and_ride.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={item.name_du}
                description={` Capacity (Car): ${item.capacity_car}, Status: ${item.status}, Timestamp: ${item.timestamp}`}
                image={require("../../assets/parking40.png")}
                onPress={() => {
                  console.log(
                    `park and ride selected latitude: ${item.latitude}, longitude: ${item.longitude}`
                  );
                }}
              ></Marker>
            ))}

            {/* {on_street_acar.map((item, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            description={`Status: ${item.status}, Timestamp: ${item.timestamp}`}
            pinColor="brown"
          />
        ))} */}

            {/* {on_street_acar.map((item, index) => (
          <Circle
            key={index}
            center={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            radius={5}
            fillColor="blue"
            strokeColor="blue"
          />
        ))} */}

            {on_street_parking.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                description={`Status: ${item.status}, Timestamp: ${new Date(
                  item.timestamp
                )}`}
                pinColor="blue"
                onPress={() => {
                  console.log(
                    `on street parking pressed Status: ${item.status}, latitude: ${item.latitude}, longitude: ${item.longitude}`
                  );
                }}
              />
            ))}

            {searchedLocations.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  longitude: item.coordinates[0],
                  latitude: item.coordinates[1],
                }}
                title={item.name}
                description={item.label}
                pinColor="red"
              />
            ))}

            {/* {on_street_parking.map((item, index) => (
          <Circle
            key={index}
            center={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            radius={1}
            fillColor="blue"
            strokeColor="black"
          />
        ))} */}

            {/* {dataDeneme.map((item, index) => (
          <Circle
            key={index}
            center={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            radius={1}
            fillColor="blue"
            strokeColor="black"
          />
        ))} */}

            {/* {visibleFirst.map((item, index) => (
          <Circle
            key={index}
            center={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            radius={1}
            fillColor="blue"
            strokeColor="black"
          />
        ))} */}
          </MapView>
          {showZoomMessage && (
            <View style={styles.showZoomMessageContainer}>
              <Text style={styles.showZoomMessageText}>
                Zoom in to see all the locations on the map!
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",

    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  accountMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "60%",
    backgroundColor: "#fff",
    zIndex: 2,
    padding: 20,
    elevation: 5,
  },
  closeButtonContainer: {
    borderColor: "red",
    padding: 2,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: "red",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  topSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  avatar: {
    width: "80%",
    height: 150,
    borderRadius: 20,
  },
  middleSection: {
    flex: 1,
  },
  bottomSection: {
    alignItems: "center",
  },
  menuButton: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  markerImage: {
    width: 40,
    height: 40,
  },
  showZoomMessageContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -50 }],
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 15,
    borderRadius: 10,
    zIndex: 1000,
    width: 300,
  },
  showZoomMessageText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  suggestionsContainer: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "column",
  },
});

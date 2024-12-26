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
  StatusBar,
  ScrollView,
  SafeAreaView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MapView, { Marker, Circle, Polygon, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseAuth, firestoreDB } from "../../FirebaseConfig";
import { signOut } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { useLoader } from "../LoaderContextPage";
import polyline from "@mapbox/polyline";
import debounce from "lodash.debounce";
import * as ParkAndRideSqliteService from "../SqliteService/park_and_ride_sqliteService";
import * as PublicParkingSqliteService from "../SqliteService/public_parking_sqliteService";
// import * as ParkingSpacesProprietySqliteService from "../SqliteService/on_street_acar_sqliteService";
import * as ParkingSpacesSqliteService from "../SqliteService/on_street_supply_pt_sqliteService";
// import * as FireBaseUploader from "../Database/firebaseUploader";
import * as OpenRouteServise from "../ApiService/openRouteService";

export default function App({ navigation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [spotsDatabase, setSpotsDatabase] = useState([]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const [park_and_ride, setPark_and_ride] = useState([]);
  const [public_parking, setPublic_parking] = useState([]);
  const [on_street_parking, setOn_street_parking] = useState([]);

  const [
    isParkingSpacesDatabaseInitialized,
    setIsParkingSpacesDatabaseInitialized,
  ] = useState(false);
  const [
    isParkAndRideDatabaseInitialized,
    setIsParkAndRideDatabaseInitialized,
  ] = useState(false);
  const [
    isPublicParkingDatabaseInitialized,
    setIsPublicParkingDatabaseInitialized,
  ] = useState(false);

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);

  const [showZoomMessage, setShowZoomMessage] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedSuggestions, setSearchedSuggestions] = useState([]);
  const [searchedLocations, setSearchedLocations] = useState([]);
  const [isSearchedSuggestions, setIsSearchedSuggestions] = useState(true);
  const [isSearched, setIsSearched] = useState(false);

  const [initialRegion, setInitialRegion] = useState({
    latitude: 50.8503,
    longitude: 4.3517,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [region, setRegion] = useState({});

  //clear all databases

  // useEffect(() => {
  //   const setupDatabases = async () => {
  //     try {
  //       await ParkAndRideSqliteService.deleteDatabase();
  //       await PublicParkingSqliteService.deleteDatabase();
  //       await ParkingSpacesSqliteService.deleteDatabase();
  //       console.log("Databases deleted successfully.");
  //     } catch (error) {
  //       Alert.alert(
  //         "Error",
  //         `Database deleting failed: ${error.message}`
  //       );
  //     }
  //   };
  //   setupDatabases();
  // }, []);

  const handleMapRefresher = () => {
    setIsParkAndRideDatabaseInitialized(false);
    setIsParkingSpacesDatabaseInitialized(false);
    setIsPublicParkingDatabaseInitialized(false);
    setRouteCoordinates([]);
    setRouteInfo(null);
  };

  useEffect(() => {
    const initializeParkingSpaces = async () => {
      try {
        showLoader();
        // await PublicParkingSqliteService.deleteDatabase();
        await PublicParkingSqliteService.initializeDatabase(
          showLoader,
          hideLoader
        );
        setIsPublicParkingDatabaseInitialized(true);

        console.log("PublicParking database initialized successfully.");
      } catch (error) {
        setIsPublicParkingDatabaseInitialized(false);
        console.error("PublicParking database initialization failed:", error);
      } finally {
        hideLoader();
      }
    };
    if (!isPublicParkingDatabaseInitialized) {
      initializeParkingSpaces();
    }
  }, [isPublicParkingDatabaseInitialized]);

  useEffect(() => {
    const initializeParkingSpaces = async () => {
      try {
        showLoader();
        // await ParkAndRideSqliteService.deleteDatabase();
        await ParkAndRideSqliteService.initializeDatabase(
          showLoader,
          hideLoader
        );
        setIsParkAndRideDatabaseInitialized(true);

        console.log("ParkAndRide database initialized successfully.");
      } catch (error) {
        setIsParkAndRideDatabaseInitialized(false);
        console.error("ParkAndRide database initialization failed:", error);
      } finally {
        hideLoader();
      }
    };

    if (!isParkAndRideDatabaseInitialized) {
      initializeParkingSpaces();
    }
  }, [isParkAndRideDatabaseInitialized]);

  useEffect(() => {
    const initializeParkingSpaces = async () => {
      try {
        showLoader();
        // await ParkingSpacesSqliteService.deleteDatabase();
        await ParkingSpacesSqliteService.initializeDatabase(
          showLoader,
          hideLoader
        );
        setIsParkingSpacesDatabaseInitialized(true);

        console.log("ParkingSpaces database initialized successfully.");
      } catch (error) {
        setIsParkingSpacesDatabaseInitialized(false);
        console.error("ParkingSpaces database initialization failed:", error);
      } finally {
        hideLoader();
      }
    };

    if (!isParkingSpacesDatabaseInitialized) {
      initializeParkingSpaces();
    }
  }, [isParkingSpacesDatabaseInitialized]);

  const slideAnim = useRef(
    new Animated.Value(-Dimensions.get("window").width * 0.6)
  ).current;

  const mapRef = useRef(null);

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

  const goToUserLocation = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } else {
      console.log("User location not available");
    }
  };

  const handleSearch = async () => {
    if (!searchText) {
      return;
    }

    try {
      setSearchedLocations([]);
      setSearchedSuggestions([]);

      const data = await OpenRouteServise.geocodeAutocompleteService(
        searchText
      );

      const suggestions = data.features.map((feature) => ({
        id: feature.properties.id || Math.random().toString(),
        name: feature.properties.label || "No label available",
        coordinates: feature.geometry.coordinates,
        country: feature.properties.country || "Unknown",
        region: feature.properties.region || "Unknown",
      }));

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
        setSearchText("");
      }

      if (suggestions.length > 1) {
        setSearchedSuggestions(suggestions);
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
        mapRef.current.animateToRegion(newRegion, 1000);
        setIsSearchedSuggestions(true);
      }
      if (suggestions.length === 0) {
        setIsSearchedSuggestions(false);
      }
      setIsSearched(true);
      console.log(suggestions);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    if (searchedSuggestions.length < 1) {
      return;
    }

    const [longitude, latitude] = Array.isArray(suggestion.coordinates)
      ? suggestion.coordinates
      : [suggestion.coordinates[0], suggestion.coordinates[1]];

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

  const handleDirection = async (destinationLongitude, destinationLatitude) => {
    if (!userLocation || !userLocation.longitude || !userLocation.latitude) {
      console.error("User location is incomplete or not available.");
      return;
    }
    setRouteCoordinates([]);
    setRouteInfo(null);

    try {
      const data = await OpenRouteServise.directionsServiseJson(
        userLocation.longitude,
        userLocation.latitude,
        destinationLongitude,
        destinationLatitude
      );

      if (
        data &&
        data.routes &&
        data.routes.length > 0 &&
        data.routes[0].segments &&
        data.routes[0].geometry
      ) {
        const route = data.routes[0];
        const summary = route.summary;
        const bbox = route.bbox;
        const geometry = route.geometry;

        const decodedCoordinates = polyline
          .decode(geometry)
          .map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng,
          }));
        setRouteCoordinates(decodedCoordinates);

        if (bbox.length === 4) {
          const [minLng, minLat, maxLng, maxLat] = bbox;
          const newRegion = {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: Math.abs(maxLat - minLat) * 2,
            longitudeDelta: Math.abs(maxLng - minLng) * 2,
          };

          setRegion(newRegion);
          mapRef.current.animateToRegion(newRegion, 1000);
        }

        setRouteInfo({
          distance: `${summary.distance.toFixed(2)} km`,
          duration: `${(summary.duration / 60).toFixed(1)} mins`,
        });
      } else {
        console.error("No valid routes or geometry found.");
      }
    } catch (error) {
      console.error("Error fetching directions:", error.message);
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

        const parkAndRideData =
          await ParkAndRideSqliteService.fetchSelectedData();
        setPark_and_ride(parkAndRideData);
        // console.log("park_and_ride", park_and_ride);
        // console.log("park_and_ride initialized successfully.");
      } catch (error) {
        console.error("ParkAndRide initialization failed:", error);
      } finally {
        hideLoader();
      }
    };
    if (isParkAndRideDatabaseInitialized) {
      initializeParkAndRide();
    }
  }, [isParkAndRideDatabaseInitialized]);

  useEffect(() => {
    const initializePublicParking = async () => {
      try {
        showLoader();

        const publicParkingData =
          await PublicParkingSqliteService.fetchSelectedData();
        setPublic_parking(publicParkingData);
        // console.log("public_parking", public_parking);
        // console.log("public_parking initialized successfully.");
      } catch (error) {
        console.error("PublicParking initialization failed:", error);
      } finally {
        hideLoader();
      }
    };

    if (isPublicParkingDatabaseInitialized) {
      initializePublicParking();
    }
  }, [isPublicParkingDatabaseInitialized]);

  useEffect(() => {
    const initializeParkingSpaces = async () => {
      try {
        showLoader();

        if (region.latitudeDelta <= 0.015 && region.longitudeDelta <= 0.015) {
          const visibleParkingSpaces =
            await ParkingSpacesSqliteService.fetchVisibleData(region, 2);
          setOn_street_parking(visibleParkingSpaces);
          // console.log("visible data", on_street_parking);
          // console.log("park_and_ride", park_and_ride);
          // console.log("public_parking", public_parking);
          // console.log("gorunur data eklendi");
        } else {
          // console.log("lokasyonlari gormek için haritayi yakinlastir");
        }

        // console.log("ParkingSpaces initialized successfully.");
      } catch (error) {
        console.error("ParkingSpaces initialization failed:", error);
      } finally {
        hideLoader();
      }
    };
    if (isParkingSpacesDatabaseInitialized) {
      initializeParkingSpaces();
    }
  }, [region, isParkingSpacesDatabaseInitialized, routeCoordinates]);

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

        {/* <View style={styles.container}> */}
        {/* Menü ve arama */}

        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleAccountMenu}>
              <Ionicons name="person-circle-outline" size={30} color="black" />
            </TouchableOpacity>

            <View style={styles.searchBox}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a location"
                onChangeText={setSearchText}
                onSubmitEditing={() => {
                  handleSearch();
                  setRouteCoordinates([]);
                  setRouteInfo(null);
                }}
                value={searchText}
                onFocus={() => setIsSearched(false)}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Ionicons name="search" size={20} color="black" />
              </TouchableOpacity>
            </View>
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

              {searchedSuggestions.length > 0 && (
                <View style={styles.scrollHint}>
                  <Ionicons
                    name="chevron-down-outline"
                    size={24}
                    color="gray"
                  />
                </View>
              )}
            </View>
          )}
          {searchText &&
            !isSearchedSuggestions &&
            searchedSuggestions.length === 0 &&
            isSearched && (
              <View style={styles.suggestionsContainer}>
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No result, please search again
                  </Text>
                </View>
              </View>
            )}
        </View>
        {/* Sol taraftan açılan menü */}

        {/* <Animated.View
          style={[
            styles.accountMenu,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          
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
        </Animated.View> */}

        {/* Harita */}
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {/* Kullanıcı konumu */}
          {userLocation && (
            <Marker coordinate={userLocation} title="Your Location" opacity={1}>
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
                handleDirection(item.longitude, item.latitude);
                console.log(
                  `public parking selected latitude: ${item.latitude}, longitude: ${item.longitude}`
                );
              }}
              opacity={1}
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
                handleDirection(item.longitude, item.latitude);
                console.log(
                  `park and ride selected latitude: ${item.latitude}, longitude: ${item.longitude}`
                );
              }}
              opacity={1}
            ></Marker>
          ))}

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
              pinColor={
                item.status === "unknown"
                  ? "gray"
                  : item.status === "available"
                  ? "green"
                  : "red"
              }
              opacity={1}
              onPress={() => {
                handleDirection(item.longitude, item.latitude);
                console.log(
                  `on street parking pressed Status: ${item.status}, latitude: ${item.latitude}, longitude: ${item.longitude}`
                );
              }}
            />
          ))}

          {searchedLocations.length > 0 &&
            searchedLocations.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  longitude: item.coordinates[0],
                  latitude: item.coordinates[1],
                }}
                title={item.name}
                description={item.label}
                onPress={() => {
                  handleSuggestionSelect(item);
                  handleDirection(item.coordinates[0], item.coordinates[1]);
                }}
                opacity={1}
              >
                <MaterialIcons name="location-pin" size={50} color="purple" />
              </Marker>
            ))}

          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="blue"
              strokeWidth={4}
            />
          )}

          {/* {routeInfo && (
            <Marker
              coordinate={
                routeCoordinates[routeCoordinates.length - 1]
              }
            >
              <View style={styles.routeInfoContainer}>
                <Text style={styles.routeInfoText}>
                  {`Distance: ${routeInfo.distance}`}
                </Text>
                <Text style={styles.routeInfoText}>
                  {`Duration: ${routeInfo.duration}`}
                </Text>
              </View>
            </Marker>
          )} */}

          {routeInfo && (
            <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]}>
              <View style={styles.routeInfoContainer}>
                <TouchableOpacity
                  style={styles.closeRouteInfoButton}
                  onPress={() => {
                    setRouteCoordinates([]);
                    setRouteInfo(null);
                    goToUserLocation();
                  }}
                >
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>

                {/* Rota Bilgileri */}
                <Text style={styles.routeInfoText}>
                  {`Distance: ${routeInfo.distance}`}
                </Text>
                <Text style={styles.routeInfoText}>
                  {`Duration: ${routeInfo.duration}`}
                </Text>
              </View>
            </Marker>
          )}
        </MapView>

        {/* {showZoomMessage && (
            <View style={styles.showZoomMessageContainer}>
              <Text style={styles.showZoomMessageText}>
                Zoom in to see all the locations on the map!
              </Text>
            </View>
          )} */}

        <View style={styles.rightcornerButtonsContainer}>
          <TouchableOpacity
            style={styles.mapRefreshButton}
            onPress={handleMapRefresher}
          >
            <Ionicons name="refresh" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={goToUserLocation}
          >
            <MaterialIcons name="my-location" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* </View> */}
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
  closeRouteInfoButton: {
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
  rightcornerButtonsContainer: {
    position: "absolute",
    bottom: 50,
    right: 30,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  mapRefreshButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  locationButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginLeft: 10,
    overflow: "hidden",
  },
  searchButton: {
    height: 40,
    width: 40,
    // backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollHint: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    alignItems: "center",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  emptyText: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    color: "gray",
  },
  routeInfoContainer: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    borderColor: "gray",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 50,
  },
  routeInfoText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
  },
  routeInfoContainer: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
    zIndex: 10,
  },
  routeInfoText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  closeRouteInfoButton: {
    position: "absolute",
    top: -10,
    right: -10,
    zIndex: 10,
  },
});

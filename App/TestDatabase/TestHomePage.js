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
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseAuth } from "../../FirebaseConfig";
import { signOut } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { firestoreDB } from "../../FirebaseConfig";
import { useLoader } from "../LoaderContextPage";
import * as ParkAndRideSqliteService from "../SqliteService/park_and_ride_sqliteService";
import * as PublicParkingSqliteService from "../SqliteService/public_parking_sqliteService";
import * as ParkingSpacesProprietySqliteService from "../SqliteService/on_street_acar_sqliteService";
import * as ParkingSpacesSqliteService from "../SqliteService/on_street_supply_pt_sqliteService";

export default function App({ navigation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [spotsDatabase, setSpotsDatabase] = useState([]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const [region, setRegion] = useState({
    latitude: 50.8503,
    longitude: 4.3517,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  });

  const slideAnim = useRef(
    new Animated.Value(-Dimensions.get("window").width * 0.6)
  ).current; // Menü animasyonu için

  const mapRef = useRef(null);

  // Kullanıcı konumunu alma
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
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

      setUserLocation(userRegion);

      // Haritayı kullanıcı konumuna odakla
      if (mapRef.current) {
        mapRef.current.animateToRegion(userRegion, 1000);
      }
    } catch (error) {
      Alert.alert("Error", `Failed to fetch location: ${error.message}`);
    }
  };

  // Firestore'dan marker verilerini çekme
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

  const { showLoader, hideLoader } = useLoader();

  //clear databases

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

  const [park_and_ride, setPark_and_ride] = useState([]);
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
        console.log("park_and_ride", parkAndRideData);
        console.log("park_and_ride initialized successfully.");
      } catch (error) {
        console.error("ParkAndRide initialization failed:", error);
      } finally {
        hideLoader();
      }
    };

    initializeParkAndRide();
  }, []);

  const [public_parking, setPublic_parking] = useState([]);
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
        console.log("public_parking", publicParkingData);
        console.log("public_parking initialized successfully.");
      } catch (error) {
        console.error("PublicParking initialization failed:", error);
      } finally {
        hideLoader();
      }
    };

    initializePublicParking();
  }, []);

  // const [on_street_acar, setOn_street_acar] = useState([]);
  // useEffect(() => {
  //   const initializeParkingSpacesPropriety = async () => {
  //     try {
  //       showLoader();
  //       //await ParkingSpacesProprietySqliteService.deleteDatabase();
  //       await ParkingSpacesProprietySqliteService.initializeDatabase(showLoader, hideLoader);
  //       const parkingPropriety = await ParkingSpacesProprietySqliteService.fetchVisibleData(region, 1.5);
  //       //const parkingPropriety = await ParkingSpacesProprietySqliteService.fetchAllData();
  //       setOn_street_acar(parkingPropriety);
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

  // const [on_street_parking, setOn_street_parking] = useState([]);
  // useEffect(() => {
  //   const initializeParkingSpaces = async () => {
  //     try {
  //       showLoader();
  //       //await ParkingSpacesSqliteService.deleteDatabase();
  //       await ParkingSpacesSqliteService.initializeDatabase(
  //         showLoader,
  //         hideLoader
  //       );
  //       const parkingSpaces = await ParkingSpacesSqliteService.fetchVisibleData(
  //         region,
  //         1.5
  //       );
  //       setOn_street_parking(parkingSpaces);
  //       //console.log("on_street_parking", on_street_parking);
  //       console.log("on_street_supply_pt initialized successfully.");
  //     } catch (error) {
  //       console.error("ParkingSpaces initialization failed:", error);
  //     } finally {
  //       hideLoader();
  //     }
  //   };

  //   initializeParkingSpaces();
  // }, [region]);

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
    <View style={styles.container}>
      {/* Menü ve arama */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleAccountMenu}>
          <Ionicons name="person-circle-outline" size={30} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location"
        />
      </View>

      {/* Sol taraftan açılan menü */}
      <Animated.View
        style={[styles.accountMenu, { transform: [{ translateX: slideAnim }] }]}
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
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Harita */}
      <MapView
        style={styles.map}
        initialRegion={region}
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
        {spotsDatabase.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{
              latitude: spot.latitude,
              longitude: spot.longitude,
            }}
            title={spot.title}
            pinColor={spot.status === "available" ? "green" : "red"}
          />
        ))}

        {/* {spotsDatabase.map((item, index) => (
          <Circle
            key={index}
            center={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            radius={5}
            fillColor="blue"
            strokeColor="rgba(0,0,0,0)"
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

        {/* {on_street_parking.map((item, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            description={`Status: ${item.status}, Timestamp: ${item.timestamp}`}
            pinColor="red"
          />
        ))} */}

        {/* {on_street_parking.map((item, index) => (
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
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 20,
    left: 10,
    right: 10,
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
});

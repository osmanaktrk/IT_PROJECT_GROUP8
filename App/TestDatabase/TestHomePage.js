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
  TouchableOpacity
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseAuth } from "../../FirebaseConfig";
import { signOut } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { firestoreDB } from "../../FirebaseConfig";

export default function App({ navigation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [spotsDatabase, setSpotsDatabase] = useState([]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
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

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      });

      // Haritayı kullanıcı konumuna odakla
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        });
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
        <TouchableOpacity style={styles.closeButton} onPress={toggleAccountMenu}>
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
          <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.navigate("TestProfilePage")}>
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
        ref={mapRef}
        style={styles.map}
        region={
          userLocation || {
            latitude: 50.8503,
            longitude: 4.3517,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }
        }
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




// import React, { useEffect, useState } from "react";
// import { View, Alert, StyleSheet } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// //import { initializeDatabase, fetchAllData, fetchVisibleData } from "../SqliteService/park_and_ride_sqliteService";
// import { initializeDatabase, fetchAllData, fetchVisibleData } from "../SqliteService/public_parking_sqliteService";
// export default function App() {
//   const [markers, setMarkers] = useState([]);
//   const [region, setRegion] = useState({
//     latitude: 50.8503,
//     longitude: 4.3517,
//     latitudeDelta: 0.1,
//     longitudeDelta: 0.1,
//   });

//   useEffect(() => {
//     const setupDatabase = async () => {
//       try {
//         initializeDatabase(); // Initialize the SQLite database
//         const data = await fetchAllData(); // Fetch all data initially
//         setMarkers(data);
        
//       } catch (error) {
//         Alert.alert("Error", `Initialization failed: ${error.message}`);
//       }
//     };

//     setupDatabase();
//   }, []);

//   const handleRegionChangeComplete = async (newRegion) => {
//     try {
//       setRegion(newRegion); // Update region state
//       const visibleData = await fetchVisibleData(newRegion); // Fetch visible markers based on region
//       setMarkers(visibleData);
      
//     } catch (error) {
//       Alert.alert("Error", `Failed to fetch visible markers: ${error.message}`);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={region}
//         onRegionChangeComplete={handleRegionChangeComplete}
//       >
//         {markers.map((item, index) => (
//           <Marker
//             key={index}
//             coordinate={{
//               latitude: item.latitude,
//               longitude: item.longitude,
//             }}
//             title={item.name_fr || "Unnamed Location"}
//             description={`City: ${item.city_fr}, Capacity (Car): ${item.capacity_car}`}
//             pinColor="gray"
//           />
//         ))}
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });
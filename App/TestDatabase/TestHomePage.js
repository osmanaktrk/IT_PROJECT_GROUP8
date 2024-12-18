// import React, { useState, useEffect, useRef } from "react";
// import {
//   StyleSheet,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Dimensions,
//   Text,
//   Alert,
//   ActivityIndicator,
//   Image,
//   FlatList,
// } from "react-native";
// import MapView, { Marker, Callout } from "react-native-maps";
// import * as Location from "expo-location";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { firebaseAuth } from "../../FirebaseConfig";
// import { signOut } from "firebase/auth";

// export default function App({ navigation }) {

  

//   useEffect(() => {
//     Alert.alert('TestHomePage', 'TestHomePage');
//   }, [])
    
//   const [userLocation, setUserLocation] = useState(null);
//   const [isFetchingLocation, setIsFetchingLocation] = useState(false);
//   const [spotsDatabase, setSpotsDatabase] = useState([]);

//     // Default Location

  

//   // Function to fetch user's current location
//   const fetchUserLocation = async () => {
//     setIsFetchingLocation(true); // Start fetching location
//     try {
//       // Request location permission from the user
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Permission Denied",
//           "Location permission is required to show your location on the map."
//         );
//         setIsFetchingLocation(false);
//         return;
//       }

//       // Get the user's current location
//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });

//       // Set the user's location state
//       setUserLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.03,
//         longitudeDelta: 0.03,
//       });

//       // Move the map view to the user's location
//       if (mapRef.current) {
//         mapRef.current.animateToRegion({
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//           latitudeDelta: 0.03,
//           longitudeDelta: 0.03,
//         });
//       }
//     } catch (error) {
//       Alert.alert("Error", `Failed to fetch location: ${error.message}`);
//     } finally {
//       setIsFetchingLocation(false); // Stop loading
//     }
//   };

//   // Function to fetch spots data from Firestore
//   const fetchSpots = async () => {
//     try {
//       // Fetch data from the "spots" collection
//       const querySnapshot = await getDocs(collection(firestoreDB, "spots"));
//       const spots = [];
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         spots.push({
//           id: doc.id,
//           latitude: data.geo.latitude,
//           longitude: data.geo.longitude,
//           title: data.title || `Spot ${doc.id}`,
//           status: data.status,
//           price: data.price,
//         });
//       });
//       setSpotsDatabase(spots); // Update the spots state
//     } catch (error) {
//       Alert.alert("Error", `Failed to load spots: ${error.message}`);
//     }
//   };

//   // Fetch user's location and Firestore spots data when the component mounts
//   useEffect(() => {
//     fetchUserLocation();
//     fetchSpots();
//   }, []);



//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedQuery, setDebouncedQuery] = useState("");
//   const [liveLocation, setLiveLocation] = useState(null);
//   const [location, setLocation] = useState({
//     latitude: 50.8503,
//     longitude: 4.3517,
//     latitudeDelta: 0.03,
//     longitudeDelta: 0.03,
//   });
//   const [showAccountMenu, setShowAccountMenu] = useState(false);
  
//   const mapRef = useRef(null);

//   // Debounced query için zamanlayıcı
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedQuery(searchQuery), 1000);
//     return () => clearTimeout(handler);
//   }, [searchQuery]);

//   // Debounced query tetikleyici
//   useEffect(() => {
//     if (debouncedQuery.trim() !== "") searchLocation(debouncedQuery);
//   }, [debouncedQuery]);

//   // Kullanıcı konum izleme
//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Location Access Denied",
//           "Enable location access to use your current location."
//         );
//         return;
//       }
//       Location.watchPositionAsync(
//         { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
//         (loc) => {
//           const { latitude, longitude } = loc.coords;
//           setLiveLocation({ latitude, longitude });
//           setLocation((prev) => ({ ...prev, latitude, longitude }));
//         }
//       );
//     })();
//   }, []);

//   // Lokasyon arama
//   const searchLocation = async (query) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
//           query
//         )}&format=json&addressdetails=1&limit=1`,
//         {
//           headers: { "User-Agent": "ReactNativeApp/1.0 (https://example.com)" },
//         }
//       );
//       if (!response.ok) throw new Error(`HTTP status ${response.status}`);
//       const data = await response.json();
//       if (data.length === 0) {
//         Alert.alert("No Results", "Try a different location.");
//         return;
//       }
//       const coords = {
//         latitude: parseFloat(data[0].lat),
//         longitude: parseFloat(data[0].lon),
//         latitudeDelta: 0.03,
//         longitudeDelta: 0.03,
//       };
//       setLocation(coords);
//     } catch (error) {
//       Alert.alert("Error", `Failed to fetch location: ${error.message}`);
//     }
//   };

//   // Hesap menüsü geçişi
//   const toggleAccountMenu = () => setShowAccountMenu(!showAccountMenu);

//   // Log out işlemi
//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.clear();
//       await signOut(firebaseAuth);
//       Alert.alert("Success", "You have been logged out.");
//       navigation.replace("FrontPage");
//     } catch (error) {
//       Alert.alert("Logout Failed", `Error: ${error.message}`);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Arama ve hesap menüsü */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={toggleAccountMenu}>
//           <Ionicons name="person-circle-outline" size={40} color="black" />
//         </TouchableOpacity>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search for a location"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       {showAccountMenu && (
//         <View style={styles.accountMenu}>
//           <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
//             <Ionicons name="log-out-outline" size={24} color="red" />
//             <Text style={styles.menuButtonText}>Log out</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Harita görünümü */}
//       <MapView ref={mapRef} style={styles.map} region={location}>
//         {/* Kullanıcı konumu */}
//         {liveLocation && (
//           <Marker
//             coordinate={liveLocation}
//             title="Your Location"
//           >
//             <Image
//               source={require("../../assets/car.png")}
//               style={styles.markerImage}
//               resizeMode="contain"
//             />
//           </Marker>
//         )}
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     position: "absolute",
//     top: 20,
//     left: 10,
//     right: 10,
//     zIndex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     marginLeft: 10,
//     paddingHorizontal: 10,
//     backgroundColor: "#fff",
//   },
//   map: {
//     flex: 1,
//   },
//   accountMenu: {
//     position: "absolute",
//     top: 70,
//     left: 10,
//     right: 10,
//     zIndex: 2,
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 10,
//   },
//   menuButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//     backgroundColor: "#f5f5f5",
//   },
//   menuButtonText: {
//     marginLeft: 10,
//     color: "red",
//     fontWeight: "bold",
//   },
//   markerImage: {
//     width: 40,
//     height: 40,
//   },
// });

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Text,
  Image,
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
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);

  // Kullanıcı konumunu alma
  const fetchUserLocation = async () => {
    setIsFetchingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to show your location on the map."
        );
        setIsFetchingLocation(false);
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
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // Firestore'dan marker verilerini çekme
  const fetchSpots = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestoreDB, "spots"));
      const spots = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        spots.push({
          id: doc.id,
          latitude: data.geo.latitude,
          longitude: data.geo.longitude,
          title: data.title || `Spot ${doc.id}`,
          status: data.status,
          price: data.price,
        });
      });
      setSpotsDatabase(spots);
    } catch (error) {
      Alert.alert("Error", `Failed to load spots: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUserLocation();
    fetchSpots();
  }, []);

  // Hesap menüsü kontrolü
  const toggleAccountMenu = () => setShowAccountMenu(!showAccountMenu);

  // Çıkış yapma işlemi
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await signOut(firebaseAuth);
      Alert.alert("Success", "You have been logged out.");
      navigation.replace("FrontPage");
    } catch (error) {
      Alert.alert("Logout Failed", `Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Arama ve Hesap Menüsü */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleAccountMenu}>
          <Ionicons name="person-circle-outline" size={40} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Hesap Menüsü */}
      {showAccountMenu && (
        <View style={styles.accountMenu}>
          <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="red" />
            <Text style={styles.menuButtonText}>Log out</Text>
          </TouchableOpacity>
        </View>
      )}

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
        {/* Kullanıcı Konumu */}
        {userLocation && (
          <Marker coordinate={userLocation} title="Your Location">
            <Image
              source={require("../../assets/car.png")}
              style={styles.markerImage}
              resizeMode="contain"
            />
          </Marker>
        )}

        {/* Firestore Marker'ları */}
        {spotsDatabase.map((spot) => (
          <Marker
            key={`spot-${spot.id}`}
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
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  accountMenu: {
    position: "absolute",
    top: 70,
    left: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  menuButtonText: {
    marginLeft: 10,
    color: "red",
    fontWeight: "bold",
  },
  markerImage: {
    width: 40,
    height: 40,
  },
});
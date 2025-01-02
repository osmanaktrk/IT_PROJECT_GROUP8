// import React, { useState, useEffect, useRef } from "react";
// import { StyleSheet, View, TextInput, Button, Dimensions, Alert, Text, Image, TouchableOpacity,TouchableWithoutFeedback, FlatList } from "react-native";
// import MapView, { Marker, Callout } from "react-native-maps";
// import * as Location from "expo-location";
// import { Ionicons } from "@expo/vector-icons";

// import { getDocs, collection, Timestamp } from "firebase/firestore";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { firebaseAuth, firestoreDB } from "../FirebaseConfig"; //user authentication
// import { signOut, reauthenticateWithCredential, EmailAuthProvider,} from "firebase/auth";

// export default function App({ navigation }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedQuery, setDebouncedQuery] = useState("");
//   const [spotsDatabase, setSpotsDatabase] = useState([]);
//   const [mapLocation, setMapLocation] = useState({
//     latitude: 50.8503,
//     longitude: 4.3517,
//     latitudeDelta: 0.03,
//     longitudeDelta: 0.03,
//   });
//   const [liveLocation, setLiveLocation] = useState(null);
//   const [permissionGranted, setPermissionGranted] = useState(false);
//   const [showAccountMenu, setShowAccountMenu] = useState(false);
//   const [showUpdateProfile, setShowUpdateProfile] = useState(false);
//   const [selectedSpot, setSelectedSpot] = useState(null); // Opslaan van geselecteerde spot
//   const [showMyPoints, setShowMyPoints] = useState(false);

//   const mapRef = useRef(null);

//   // afstand berekening lat - long naar meters
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3; // Radius van de aarde in meters
//     const toRadians = (degrees) => (degrees * Math.PI) / 180;
  
//     const φ1 = toRadians(lat1);
//     const φ2 = toRadians(lat2);
//     const Δφ = toRadians(lat2 - lat1);
//     const Δλ = toRadians(lon2 - lon1);
  
//     const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
//     return R * c; // Afstand in meters
//   };
  
//   const fetchSpots = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(firestoreDB, "spots"));
//       const spots = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         latitude: doc.data().coords.latitude,
//         longitude: doc.data().coords.longitude,
//         title: doc.data().title || `Spot ${doc.id}`,
//         price: doc.data().price || "Onbekend",
//         status: doc.data().status,
//         Timestamp: doc.data().Timestamp,
//       }));
//       setSpotsDatabase(spots);
//     } catch (error) {
//       Alert.alert("Error", `Failed to load spots: ${error.message}`);
//     }
//   };

//   useEffect(() => {
//     fetchSpots();
//   }, []);

//   // Automatically update the debounced search query after 1 second
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedQuery(searchQuery), 1000);
//     return () => clearTimeout(handler);
//   }, [searchQuery]);

//   useEffect(() => {
//     if (debouncedQuery.trim() !== "") searchLocation(debouncedQuery);
//   }, [debouncedQuery]);

//   // Request location permissions and track live location
//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Locatietoegang geweigerd",
//           "Schakel locatietoegang in om je huidige locatie te gebruiken."
//         );
//         return;
//       }
//       setPermissionGranted(true);

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Balanced,
//       });
//       const { latitude, longitude } = location.coords;

//       const initialLocation = {
//         latitude,
//         longitude,
//         latitudeDelta: 0.03,
//         longitudeDelta: 0.03,
//       };

//       setLiveLocation({ latitude, longitude });
//       setMapLocation(initialLocation); // Stel live locatie als startpunt van de kaart in.

//       Location.watchPositionAsync(
//         {
//           accuracy: Location.Accuracy.High,
//           timeInterval: 5000,
//           distanceInterval: 10,
//         },
//         (loc) => {
//           const { latitude, longitude } = loc.coords;
//           setLiveLocation({ latitude, longitude });
//         }
//       );
//     })();
//   }, []);

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
//         Alert.alert("Geen resultaten", "Probeer een andere locatie.");
//         return;
//       }

//       const coords = {
//         latitude: parseFloat(data[0].lat),
//         longitude: parseFloat(data[0].lon),
//         latitudeDelta: 0.065,
//         longitudeDelta: 0.065,
//       };

//       setMapLocation(coords);
//     } catch (error) {
//       Alert.alert(
//         "Fout",
//         `Er ging iets mis bij het ophalen van de locatie: ${error.message}`
//       );
//     }
//   };
//   const toggleAccountMenu = () => setShowAccountMenu(!showAccountMenu);

//   const goToLiveLocation = () => {
//     if (liveLocation) {
//       const newRegion = {
//         latitude: liveLocation.latitude,
//         longitude: liveLocation.longitude,
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       };
//       // Gebruik animateToRegion om de kaart te animeren naar de live locatie
//       mapRef.current?.animateToRegion(newRegion, 1000); // De tweede parameter is de duur van de animatie in milliseconden
//     } else {
//       Alert.alert(
//         "Geen live locatie beschikbaar",
//         "Controleer of locatie is ingeschakeld."
//       );
//     }
//   };

//   const fitAllMarkers = () => {
//     mapRef.current?.fitToCoordinates(
//       markers.map((m) => ({ latitude: m.latitude, longitude: m.longitude })),
//       {
//         edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
//         animated: true,
//       }
//     );
//   };

//   const handleMapPress = () => {
//     setShowAccountMenu(false);
//     setShowUpdateProfile(false);
//     setShowMyPoints(false);
//   };

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.clear();
//       await signOut(firebaseAuth);
//       Alert.alert("Success", "You have been logged out.");
//       navigation.replace("FrontPage");
//     } catch (error) {
//       Alert.alert("Logout Failed", `An error occurred: ${error.message}`);
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const handleSpotPress = (spot) => {
//     if (selectedSpot && selectedSpot.id === spot.id) {
//       // Als dezelfde spot al is geselecteerd, doe niets
//       return;
//     }
  
//     if (!liveLocation) {
//       Alert.alert("Locatie onbekend", "Je huidige locatie is niet beschikbaar.");
//       return;
//     }
  
//     const distance = calculateDistance(
//       liveLocation.latitude,
//       liveLocation.longitude,
//       spot.latitude,
//       spot.longitude
//     );
  
//     if (distance < 100) {
//       // extra optie als je minder dan 100meter bent
//       setSelectedSpot({ ...spot, extraOption: true });
//     } else {
//       setSelectedSpot(spot);
//     }
//   };

//   const closeBottomSheet = () => {
//     setSelectedSpot(null); // Sluit de bottom sheet
//   };

//   return (
//     <TouchableWithoutFeedback onPress={handleMapPress}>
//     <View style={styles.container}>
//       {!showAccountMenu && !showMyPoints && !showUpdateProfile &&(
//         <View style={styles.searchContainer}>
//           <TouchableOpacity onPress={() => setShowAccountMenu(true)}>
//             <Ionicons name="person-circle-outline" size={40} color="black" />
//           </TouchableOpacity>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Zoek een locatie"
//             value={searchQuery}
//             onChangeText={(text) => setSearchQuery(text)}
//           />

//           <Button title="Zoom op alle markers" onPress={fitAllMarkers} />
//         </View>
//       )}

//       {/* Zorg ervoor dat de live locatieknop altijd onderaan wordt weergegeven */}
//       {!showAccountMenu && !selectedSpot && (
//         <TouchableOpacity
//           onPress={goToLiveLocation}
//           style={styles.locationButton}
//         >
//           <Image
//             source={require("../assets/MyLocationMarker.png")}
//             style={styles.locationButtonImage}
//           />
//         </TouchableOpacity>
//       )}

//       {showAccountMenu && !showUpdateProfile && (
//         <View style={styles.accountMenu}>
//           <View style={styles.topSection}>
//             <Text style={styles.accountText}>Name</Text>
//           </View>
//           <View style={styles.middleSection}>
//             <TouchableOpacity
//               style={styles.menuButton}
//               onPress={() => navigation.navigate("UpdateProfile")} // Navigate to the new UpdateProfile screen
//             >
//               <Text style={styles.menuButtonText}>Update Profile</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.menuButton}
//               onPress={() => {
//                 setShowAccountMenu(false); // Sluit de standaard zijbalk
//                 setShowMyPoints(true);
//               }}
//             >
//               <Text style={styles.menuButtonText}>My Points</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.menuButton}
//               onPress={() => navigation.navigate("HistoryScreen")} // Navigate to the history page
//             >
//               <Text style={styles.menuButtonText}>History</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.menuButton}
//               onPress={() => navigation.navigate("TermsAndConditions")}
//             >
//               <Text style={styles.menuButtonText}>Terms & Conditions</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.bottomSection}>
//             <TouchableOpacity
//               style={styles.logoutButton}
//               onPress={handleLogout}
//             >
//               <Text style={styles.logoutButtonText}>Log out</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={toggleAccountMenu}>
//               <Text style={styles.closeButton}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

//       {showUpdateProfile && (
//         <View style={styles.accountMenu}>
//           <View style={styles.topSection}>
//             <Text style={styles.accountText}>Update Profile</Text>
//           </View>
//           <View style={styles.middleSection}>
//             <TextInput style={styles.inputField} placeholder="Name" />
//             <TextInput style={styles.inputField} placeholder="E-mail" />
//             <TextInput style={styles.inputField} placeholder="Phone number" />
//           </View>
//           <View style={styles.bottomSection}>
//             <TouchableOpacity style={styles.menuButton} onPress={toggleAccountMenu}>
//               <Text style={styles.menuButtonText}>Done</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.menuButton}
//               onPress={() => setShowUpdateProfile(false)}
//             >
//               <Text style={styles.menuButtonText}>Back to menu</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

    
//       {/* My Points Sectie */}
//       {showMyPoints && (
//         <View style={styles.accountMenu}>
//           <View style={styles.topSection}>
//             <Text style={styles.accountText}>My Points</Text>
//           </View>
//           <View style={styles.middleSection}>
//             <Text style={styles.pointsText}>⭐ 0</Text>
//             <Text style={styles.pointsInfo}>
//               More info about the points system{" "}
//               <Text
//                 style={styles.linkText}
//                 onPress={() => navigation.navigate("PointsInfo")} // Navigates to PointsInfo.js
//               >
//                 click here
//               </Text>
//             </Text>
//           </View>
//           <View style={styles.bottomSection}>
//             <TouchableOpacity
//               onPress={() => {
//                 setShowMyPoints(false); // Sluit de My Points-sectie
//                 setShowAccountMenu(true); // Heropen de standaard zijbalk
//               }}
//             >
//               <Text style={styles.closeButton}>Back to Menu</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

      



//       <MapView ref={mapRef} style={styles.map} region={mapLocation}>
//         {liveLocation && (
//           <Marker coordinate={liveLocation}>
//             <View style={styles.markerContainer}>
//               <Image
//                 source={require("../assets/car.png")}
//                 style={styles.markerImage}
//               />
//             </View>
//             <Callout>
//               <Text>Dit ben jij!</Text>
//             </Callout>
//           </Marker>
//         )}

//         {/* Firestore marker */}
//         {spotsDatabase.map((spot) => (
//           <Marker
//             key={spot.id}
//             coordinate={{
//               latitude: spot.latitude,
//               longitude: spot.longitude,
//             }}
//             onPress={() => handleSpotPress(spot)}
//           >
//             {/* Gebruik aangepaste afbeelding afhankelijk van de status */}
//             <View style={styles.markerContainer}>
//               <Image
//                 source={
//                   spot.status === "available"
//                     ? require("../assets/available.png")
//                     : require("../assets/notAvailable.png")
//                 }
//                 style={styles.markerImage}
//               />
//             </View>
//           </Marker>
//         ))}
//       </MapView>

//       {selectedSpot && (
//         <View style={styles.bottomSheet}>
//           <Text style={styles.description}>{selectedSpot.description}</Text>
//           <Text style={styles.price}>
//             {"price: " + selectedSpot.price + " euro"}
//           </Text>
//           <Text style={styles.Timestamp}>
//             {"timestamp: " + selectedSpot.Timestamp}
//           </Text>
//           {selectedSpot.extraOption && (
//           <Button title="Is the spot available?" onPress={() => Alert.alert("test aanpassing")}/>
//     )}
//           <Button title="Close" onPress={closeBottomSheet} />
//         </View>
//       )}

//       {/*{!showAccountMenu && (
//        <FlatList
//           data={markers}
//           keyExtractor={(item) => item.id.toString()}
//           style={styles.list}
//           renderItem={({ item }) => (
//             <View style={styles.listItem}>
//               <Text style={styles.listText}>{item.title}</Text>
//               <Button
//                 title="Zoom"
//                 onPress={() => navigateToMarker(item.latitude, item.longitude)}
//               />
//             </View>
//           )}
//         /> 
//       )}*/}
//     </View>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   searchContainer: {
//     position: "absolute",
//     top: 70,
//     left: 10,
//     right: 10,
//     backgroundColor: "white",
//     borderRadius: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingRight: 10,
//     zIndex: 1,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     marginRight: 10,
//     paddingHorizontal: 10,
//   },
//   map: {
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height,
//   },
//   accountMenu: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "60%",
//     height: "100%",
//     backgroundColor: "rgba(255, 255, 255, 0.8)",
//     zIndex: 2,
//     padding: 20,
//   },
//   topSection: {
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   middleSection: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   bottomSection: {
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   menuButton: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginVertical: 5,
//     alignItems: "center",
//   },
//   menuButtonText: {
//     color: "black",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   logoutButton: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginVertical: 5,
//     alignItems: "center",
//   },
//   logoutButtonText: {
//     color: "red",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   closeButton: {
//     fontSize: 18,
//     color: "black",
//     marginTop: 10,
//     textAlign: "center",
//   },
//   accountText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   inputField: {
//     backgroundColor: "white",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 5,
//   },
//   list: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "white",
//     maxHeight: 200,
//   },
//   listItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
//   listText: {
//     flex: 1,
//   },

//   markerContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   markerImage: {
//     width: 50,
//     height: 50,
//     resizeMode: "contain", // keep the ratio the same
//   },

//   locationButton: {
//     position: "absolute",
//     bottom: 40, // Zet de knop 20 eenheden van de onderkant
//     left: 30, // Zet de knop 10 eenheden van de linkerkant
//     zIndex: 1, // Zorg ervoor dat de knop boven andere componenten komt
//   },
//   locationButtonImage: {
//     width: 60, // Pas de grootte van de afbeelding aan
//     height: 60,
//     resizeMode: "contain", // Behoud de beeldverhouding
//   },

//   bottomSheet: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "rgba(255, 255, 255, 0.8)",
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   description: {
//     fontSize: 14,
//     marginVertical: 5,
//   },
//   status: {
//     fontSize: 14,
//     color: "green",
//     marginBottom: 10,
//   },
//   pointsText: { fontSize: 48, textAlign: "center" },
//   pointsInfo: { textAlign: "center", marginTop: 10 },
//   linkText: { color: "blue", textDecorationLine: "underline" },

//   updateProfile: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "white",
//     zIndex: 3,
//     padding: 20,
//   },
  
//   backButton: {
//     position: "absolute",
//     top: 20,
//     left: 20,
//     zIndex: 3,
//     backgroundColor: "rgba(255, 255, 255, 0.8)",
//     padding: 8,
//     borderRadius: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
  
// });




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
  Modal,
  PanResponder,
  TouchableWithoutFeedback,
} from "react-native";
import * as Speech from "expo-speech";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Portal, Snackbar } from "react-native-paper";
import MapView, { Marker, Circle, Polygon, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  firebaseAuth,
  firestoreDB,
  firebaseRealDB,
} from "../FirebaseConfig";
import { signOut } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { getDatabase, ref, set, update, remove, get } from "firebase/database";
import NetInfo from "@react-native-community/netinfo";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useLoader } from "./LoaderContextPage";
import polyline from "@mapbox/polyline";
import debounce from "lodash.debounce";
import * as ParkAndRideSqliteService from "./SqliteService/park_and_ride_sqliteService";
import * as PublicParkingSqliteService from "./SqliteService/public_parking_sqliteService";
import * as ParkingSpacesSqliteService from "./SqliteService/on_street_supply_pt_sqliteService";
import * as OpenRouteServise from "./ApiService/openRouteService";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const liveLocationsDistance = 300; //meters

export default function HomePage({ navigation }) {
  const [isSynchronizationActive, setIsSynchronizationActive] = useState(false);
  const [userCurrentLocation, setUserCurrentLocation] = useState(null);
  const [userLocationHeading, setUserLocationHeading] = useState(0);
  // const [spotsDatabase, setSpotsDatabase] = useState([]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const [park_and_ride, setPark_and_ride] = useState(null);
  const [public_parking, setPublic_parking] = useState(null);
  const [on_street_parking, setOn_street_parking] = useState(null);
  const [showUsersPoints, setShowUsersPoints] = useState(false);
  const [usersPoints, setUsersPoints] = useState(0);
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
  const [routeSteps, setRouteSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [routeInfo, setRouteInfo] = useState({});

  // const [navigationStarted, setNavigationStarted] = useState(false);
  const [navigationStepsInstnstruction, setNavigationStepsInstruction] =
    useState("");
  const [navigationIntervalId, setNavigationIntervalId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedSuggestions, setSearchedSuggestions] = useState([]);
  const [searchedLocations, setSearchedLocations] = useState([]);
  const [isSearchedSuggestions, setIsSearchedSuggestions] = useState(true);
  const [isSearched, setIsSearched] = useState(false);
  const [selectedParkingLocation, setSelectedParkingLocation] = useState({});
  const [directionRegio, setDirectionRegio] = useState({});

  const [selectedLocationCircle, setSelectedLocationCircle] = useState(null);

  const [getLiveLocationsSelectedArea, setGetLiveLocationsSelectedArea] =
    useState(false);

  // const [firebaseFetchedLocations, setFirebaseFetchedLocations] = useState([]);
  let firebaseFetchedLocations = [];
  // const [searchedLocationSuggections, setSearchedLocationSuggections] = useState([]);
  let searchedLocationSuggections = [];

  const [region, setRegion] = useState({
    latitude: 50.8503,
    longitude: 4.3517,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const mapRef = useRef(null);
  const slideAnim = useRef(
    new Animated.Value(-Dimensions.get("window").width * 0.6)
  ).current;

  const translateY = useRef(new Animated.Value(screenHeight)).current;

  const translateX = useRef(new Animated.Value(screenWidth)).current;

  const [activeModule, setActiveModule] = useState(null);
  const [isNavigationSoundOn, setIsNavigationSoundOn] = useState(true);
  const [isAligningHeading, setIsAligningHeading] = useState(false);
  const [userLocationWatcher, setUserLocationWatcher] = useState(null);
  const [userLocationHeaderWatcher, setUserLocationHeaderWatcher] =
    useState(null);
  const [userHeading, setUserHeading] = useState(0);

  const moduleHeights = {
    navigationModule: screenHeight * 0.2,
    updateLocationModule: screenHeight * 0.45,
    thanksModule: screenHeight * 0.41,
    locationSelectedModule: screenHeight * 0.4,
  };

  const checkInternetConnection = async () => {
    const state = await NetInfo.fetch();
    return state.isConnected;
  };

  // realtime database kullanici ekleme deneme fonksiyonu, çalisiyor
  // useEffect(() => {
  //   // const saveUserDataToRealtimeDatabase = async () => {
  //   //   try {
  //   //     const user = firebaseAuth.currentUser; // Aktif kullanıcıyı al
  //   //     const userRef = ref(firebaseRealDB, `users/${user.uid}`); // Kullanıcı için bir yol belirle
  //   //     // Kullanıcı verilerini kaydet
  //   //     await set(userRef, {
  //   //       username: user.displayName, // Kullanıcının kullanıcı adı
  //   //       email: user.email, // Kullanıcının e-posta adresi
  //   //       createdAt: new Date().toISOString(), // Kullanıcı oluşturulma zamanı
  //   //       score: 0, // Başlangıç skoru
  //   //     });
  //   //     console.log("User data saved successfully in Realtime Database");
  //   //   } catch (error) {
  //   //     console.error("Error saving user data to Realtime Database:", error);
  //   //   }
  //   // };
  //   // saveUserDataToRealtimeDatabase();
  //   // addHistoryRecord(50.8503, 4.3517);
  //   // deleteHistoryRecord("b474f8ed-ec48-4096-9766-e827dfc4dc93");
  //   // fetchHistoryRecords();
  // }, []);

  // const addHistoryRecord = async (latitude, longitude) => {
  //   try {
  //     const user = firebaseAuth.currentUser;
  //     const uniqueKey = uuidv4();

  //     const historyRef = ref(
  //       firebaseRealDB,
  //       `users/${user.uid}/history/${uniqueKey}`
  //     );

  //     await set(historyRef, {
  //       latitude: latitude,
  //       longitude: longitude,
  //       timestamp: new Date().toISOString(),
  //     });

  //     console.log("History record added successfully.");
  //   } catch (error) {
  //     console.error("Error adding history record:", error);
  //   }
  // };

  const addHistoryRecord = async (latitude, longitude) => {
    try {
      const user = firebaseAuth.currentUser;

      const historyRef = ref(firebaseRealDB, `users/${user.uid}/history`);

      const netInfo = await NetInfo.fetch();

      if (!netInfo.isConnected) {
        Alert.alert(
          "Offline Mode",
          "No internet connection. Your changes will sync when you are back online."
        );
        const uniqueKey = uuidv4();
        const newRecordRef = ref(
          firebaseRealDB,
          `users/${user.uid}/history/${uniqueKey}`
        );

        await set(newRecordRef, {
          latitude: latitude,
          longitude: longitude,
          timestamp: new Date().toISOString(),
        });

        return;
      }

      const snapshot = await get(historyRef);

      if (snapshot.exists()) {
        const allRecords = snapshot.val();

        const recordExists = Object.values(allRecords).some(
          (record) =>
            record.latitude === latitude && record.longitude === longitude
        );

        if (recordExists) {
          Alert.alert(
            "Duplicate Entry",
            "This location already exists in your history."
          );
          return;
        }
      }

      const uniqueKey = uuidv4();
      const newRecordRef = ref(
        firebaseRealDB,
        `users/${user.uid}/history/${uniqueKey}`
      );

      await set(newRecordRef, {
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date().toISOString(),
      });

      console.log("History record added successfully.");
      Alert.alert("Success", "New location added to your history!");
    } catch (error) {
      console.error("Error adding history record:", error);
      Alert.alert("Error", "Failed to add location to history.");
    }
  };

  const updateHistoryRecord = async (recordId, latitude, longitude) => {
    try {
      const user = firebaseAuth.currentUser;
      const historyRef = ref(
        firebaseRealDB,
        `users/${user.uid}/history/${recordId}`
      );
      const updatedData = {
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date().toISOString(),
      };

      await update(historyRef, updatedData);

      console.log("History record updated successfully.");
    } catch (error) {
      console.error("Error updating history record:", error);
    }
  };

  const fetchHistoryRecords = async () => {
    try {
      const user = firebaseAuth.currentUser;
      const historyRef = ref(firebaseRealDB, `users/${user.uid}/history`);
      const snapshot = await get(historyRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const recordsWithIds = Object.entries(data).map(([id, record]) => ({
          id,
          ...record,
        }));
        console.log("Fetched history records:", recordsWithIds);
        return recordsWithIds;
      } else {
        console.log("No history records found.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching history records:", error);
      return [];
    }
  };

  const deleteHistoryRecord = async (recordId) => {
    try {
      const user = firebaseAuth.currentUser;
      const historyRef = ref(
        firebaseRealDB,
        `users/${user.uid}/history/${recordId}`
      );
      await remove(historyRef);

      Alert.alert("Success", "History record deleted successfully.");
      console.log("History record deleted successfully.");
    } catch (error) {
      console.error("Error deleting history record:", error);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const user = firebaseAuth.currentUser;

      const scoreRef = ref(firebaseRealDB, `users/${user.uid}/score`);
      const snapshot = await get(scoreRef);

      if (!snapshot.exists()) {
        console.warn("No score data found for the current user.");
        setUsersPoints(0);
      }

      setUsersPoints(snapshot.val());
    } catch (error) {
      console.error("Error fetching user points:", error.message);
      setUsersPoints(0);
    }
  };

  const openModule = (moduleName) => {
    setActiveModule(moduleName);

    Animated.timing(translateY, {
      // toValue: screenHeight - moduleHeights[moduleName],
      toValue: Math.max(screenHeight - moduleHeights[moduleName], 0),
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const closeModule = (moduleName) => {
    switch (moduleName) {
      case "navigationModule":
        clearInterval(navigationIntervalId);
        // setNavigationIntervalId("");
        setNavigationStepsInstruction("");
        setRouteCoordinates([]);
        setRouteInfo({});
        setIsAligningHeading(false);
        break;
      case "updateLocationModule":
        setSelectedParkingLocation({});
        break;
      case "locationSelectedModule":
        setSelectedLocationCircle(null);
        break;
      case "allModules":
        clearInterval(navigationIntervalId);
        setNavigationStepsInstruction("");
        setRouteCoordinates([]);
        setRouteInfo({});
        setIsAligningHeading(false);
        setSelectedParkingLocation({});
        setSelectedLocationCircle(null);
        break;
    }

    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setActiveModule(""));
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        const currentTranslateY =
          screenHeight - moduleHeights[activeModule] + gestureState.dy;

        if (currentTranslateY <= screenHeight) {
          translateY.setValue(currentTranslateY);
        }
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      const threshold = screenHeight / 6;

      if (gestureState.dy > threshold) {
        closeModule();
      } else {
        openModule(activeModule);
      }
    },
  });

  //update SQLite database
  const updateDatabaseFromFirestore = async () => {
    if (isSynchronizationActive) {
      Alert.alert(
        "Update in Progress",
        "Please wait while the update completes."
      );
      return;
    }

    setIsSynchronizationActive(true);
    Alert.alert(
      "Update Started",
      "The database update has started. Please wait... You will be notified once the update is complete."
    );

    try {
      await ParkingSpacesSqliteService.updateSQLiteWithAvailableRecords();
      await ParkingSpacesSqliteService.updateSQLiteWithUnavailableRecords();
      Alert.alert(
        "Update Complete",
        "The database has been successfully updated."
      );
    } catch (error) {
      console.log(`Database update failed: ${error.message}`);
      Alert.alert("Error", "Database update failed please try again later.");
    } finally {
      setIsSynchronizationActive(false);
    }
  };

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
    if (!isParkAndRideDatabaseInitialized) {
      initializeParkAndRideDatabase();
      // setIsParkAndRideDatabaseInitialized(true);
    }
  }, [isParkAndRideDatabaseInitialized]);

  // useEffect(() => {
  //   const initializeParkAndRideDatabaseAndFetchData = async () => {
  //     try {
  //       showLoader();

  //       // Eğer veritabanı henüz başlatılmamışsa başlat
  //       if (!isParkAndRideDatabaseInitialized) {
  //         await initializeParkAndRideDatabase();
  //         setIsParkAndRideDatabaseInitialized(true);
  //       }

  //       // Veriler çekiliyor
  //       const parkAndRideData =
  //         await ParkAndRideSqliteService.fetchSelectedData();
  //       setPark_and_ride(parkAndRideData);

  //       console.log(
  //         "ParkAndRide database initialized and data fetched successfully."
  //       );
  //     } catch (error) {
  //       console.error(
  //         "Error initializing or fetching ParkAndRide data:",
  //         error
  //       );
  //     } finally {
  //       hideLoader();
  //     }
  //   };

  //   initializeParkAndRideDatabaseAndFetchData();
  // }, [isParkAndRideDatabaseInitialized]);

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
    if (!isPublicParkingDatabaseInitialized) {
      initializePublicParkingDatabase();
      // setIsPublicParkingDatabaseInitialized(true);
    }
  }, [isPublicParkingDatabaseInitialized]);

  // useEffect(() => {
  //   const initializePublicParkingDatabaseAndFetchData = async () => {
  //     try {
  //       showLoader();

  //       // Eğer veritabanı henüz başlatılmamışsa başlat
  //       if (!isPublicParkingDatabaseInitialized) {
  //         await initializePublicParkingDatabase();
  //         setIsPublicParkingDatabaseInitialized(true);
  //       }

  //       // Veriler zaten başlatılmışsa al
  //       const publicParkingData =
  //         await PublicParkingSqliteService.fetchSelectedData();
  //       setPublic_parking(publicParkingData);

  //       console.log(
  //         "Public parking database initialized and data fetched successfully."
  //       );
  //     } catch (error) {
  //       console.error(
  //         "Error initializing or fetching public parking data:",
  //         error
  //       );
  //     } finally {
  //       hideLoader();
  //     }
  //   };

  //   initializePublicParkingDatabaseAndFetchData();
  // }, [isPublicParkingDatabaseInitialized]);

  useEffect(() => {
    const fetchVisibleParkingSpaces = async () => {
      try {
        showLoader();

        if (region.latitudeDelta <= 0.015 && region.longitudeDelta <= 0.015) {
          const visibleParkingSpaces =
            await ParkingSpacesSqliteService.fetchVisibleData(region, 2);
          setOn_street_parking(visibleParkingSpaces);
          // console.log("visible data", visibleParkingSpaces);
          // console.log("park_and_ride", park_and_ride);
          // console.log("public_parking", public_parking);
          // console.log("gorunur data eklendi");
        }

        // console.log("ParkingSpaces initialized successfully.");
      } catch (error) {
        console.error(
          "fetchVisibleParkingSpaces initialization failed:",
          error
        );
      } finally {
        hideLoader();
      }
    };

    if (isParkingSpacesDatabaseInitialized) {
      fetchVisibleParkingSpaces();
    }
  }, [region, isParkingSpacesDatabaseInitialized, routeCoordinates]);

  useEffect(() => {
    if (!isParkingSpacesDatabaseInitialized) {
      initializeParkingSpacesDatabase();
      // setIsParkingSpacesDatabaseInitialized(true);
    }
  }, [isParkingSpacesDatabaseInitialized]);




  // useEffect(() => {
  //   const initializeAndFetchParkingSpaces = async () => {
  //     try {
  //       showLoader();

  //       // Eğer veritabanı başlatılmamışsa başlat
  //       if (!isParkingSpacesDatabaseInitialized) {
  //         await initializeParkingSpacesDatabase();
  //         setIsParkingSpacesDatabaseInitialized(true);
          
  //       }

  //       // Eğer veritabanı başlatıldıysa ve uygun bölge koşulları sağlanıyorsa veri çek
  //       if (isParkingSpacesDatabaseInitialized) {
  //         if (region.latitudeDelta <= 0.015 && region.longitudeDelta <= 0.015) {
  //           const visibleParkingSpaces =
  //             await ParkingSpacesSqliteService.fetchVisibleData(region, 2);
  //           setOn_street_parking(visibleParkingSpaces);
  //           console.log("Visible parking spaces fetched successfully.");
  //           // console.log(visibleParkingSpaces);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error initializing or fetching parking spaces:", error);
  //     } finally {
  //       hideLoader();
  //     }
  //   };

  //   initializeAndFetchParkingSpaces();
  // }, [region, isParkingSpacesDatabaseInitialized, routeCoordinates]);

  const handleMapRefresher = () => {
    setIsParkAndRideDatabaseInitialized(false);
    setIsParkingSpacesDatabaseInitialized(false);
    setIsPublicParkingDatabaseInitialized(false);
    setRouteCoordinates([]);
    setRouteInfo({});
    closeModule("allModules");
    setNavigationIntervalId(null);
  };

  const initializePublicParkingDatabase = async () => {
    try {
      showLoader();
      // await PublicParkingSqliteService.deleteDatabase();
      const result = await PublicParkingSqliteService.initializeDatabase(
        showLoader,
        hideLoader
      );
      setIsPublicParkingDatabaseInitialized(result);

      if (result) {
        console.log("PublicParking database initialized successfully.");
      } else {
        console.log("PublicParking database not initialized.");
      }
    } catch (error) {
      setIsPublicParkingDatabaseInitialized(false);
      console.error("PublicParking database initialization failed:", error);
    } finally {
      hideLoader();
    }
  };

  const initializeParkAndRideDatabase = async () => {
    try {
      showLoader();
      // await ParkAndRideSqliteService.deleteDatabase();
      const result = await ParkAndRideSqliteService.initializeDatabase(
        showLoader,
        hideLoader
      );
      setIsParkAndRideDatabaseInitialized(result);

      if (result) {
        console.log("ParkAndRide database initialized successfully.");
      } else {
        console.log("ParkAndRide database not initialized.");
      }
    } catch (error) {
      setIsParkAndRideDatabaseInitialized(false);
      console.error("ParkAndRide database initialization failed:", error);
    } finally {
      hideLoader();
    }
  };

  const initializeParkingSpacesDatabase = async () => {
    try {
      showLoader();
      // await ParkingSpacesSqliteService.deleteDatabase();
      const result = await ParkingSpacesSqliteService.initializeDatabase(
        showLoader,
        hideLoader
      );
      setIsParkingSpacesDatabaseInitialized(result);
      if (result) {
        console.log("ParkingSpaces database initialized successfully.");
      } else {
        console.log("ParkingSpaces database not initialized.");
      }
    } catch (error) {
      setIsParkingSpacesDatabaseInitialized(false);
      console.error("ParkingSpaces database initialization failed:", error);
    } finally {
      hideLoader();
    }
  };

  const fetchUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }

      const positionSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (location) => {
          const latitude = location.coords.latitude;
          const longitude = location.coords.longitude;

          // Kullanıcı konumunu güncelle
          setUserCurrentLocation({
            latitude,
            longitude,
          });

          // Haritayı güncel konuma taşı
          if (mapRef.current) {
            mapRef.current.animateToRegion({ latitude, longitude }, 1000);
          }
        }
      );

      setUserLocationWatcher(positionSubscription);
    } catch (error) {
      Alert.alert("Error", `Failed to fetch location: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUserLocation();

    return () => {
      if (userLocationWatcher) {
        userLocationWatcher.remove();
      }
    };
  }, []);

  const startAligningMapToUserHeading = async () => {
    try {
      if (userLocationHeaderWatcher?.remove) {
        userLocationHeaderWatcher.remove();
      }

      const headingSubscription = await Location.watchHeadingAsync(
        (headingData) => {
          const trueHeading = headingData.trueHeading || 0;
          setUserHeading(trueHeading);

          if (mapRef.current && userCurrentLocation) {
            mapRef.current.animateCamera(
              {
                center: {
                  latitude: userCurrentLocation.latitude,
                  longitude: userCurrentLocation.longitude,
                },
                heading: trueHeading,
                zoom: 17,
              },
              { duration: 500 }
            );
          }

          // console.log(`Heading updated: ${trueHeading}`);
        }
      );

      setUserLocationHeaderWatcher(headingSubscription);
    } catch (error) {
      console.error("Error aligning map to heading:", error.message);
    }
  };

  const stopAligningMapToUserHeading = () => {
    if (userLocationHeaderWatcher) {
      userLocationHeaderWatcher.remove();

      setUserLocationHeaderWatcher(null);

      console.log("Stopped aligning map to heading.");
    }
  };

  useEffect(() => {
    if (isAligningHeading) {
      startAligningMapToUserHeading();
    } else {
      stopAligningMapToUserHeading();
    }
  }, [isAligningHeading]);

  const goToUserLocation = () => {
    if (userCurrentLocation) {
      mapRef.current?.animateToRegion({
        ...userCurrentLocation,
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
    closeLocationSearchModule();
    setSelectedLocationCircle(null);
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
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        // console.log("suggestions[0] tekli arama", suggestions[0]);
        setSearchedLocations(suggestions);
        setSelectedLocationCircle(suggestions[0]);
        setGetLiveLocationsSelectedArea(true);
        // openLocationSelectedModule();

        setRegion(newRegion);
        mapRef.current.animateToRegion(newRegion, 1000);
        // eger arama tek sonuç verirse buraya direkt yonlendirme
        setSearchText("");

        // console.log("tekli sonuclari lat lon", selectedLocationCircle);
      }

      if (suggestions.length > 1) {
        setSelectedLocationCircle(null);
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
        //eger arama çok sonuç tum sonuçlari kapsayan alan
        mapRef.current.animateToRegion(newRegion, 1000);
        setIsSearchedSuggestions(true);
      }
      if (suggestions.length === 0) {
        setIsSearchedSuggestions(false);
      }
      setIsSearched(true);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };
  const closeSearch = () => {
    setIsSearchedSuggestions(false);
    setSearchText("");
    setSearchedSuggestions([]);
    setIsSearched(true);
  };

  const handleSuggestionSelect = (item) => {
    if (searchedSuggestions.length < 1) {
      return;
    }
    setGetLiveLocationsSelectedArea(true);
    setSelectedLocationCircle(item);
    //arama yaoildiktan sonra harita uzerinde bir çok noktadan birinin seçilmesi ile sonuçleniyor

    const [longitude, latitude] = item.coordinates;

    const newRegion = {
      longitude,
      latitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    // openLocationSelectedModule();

    setSearchText(item.name);
    setSearchedLocations([item]);
    setSearchedSuggestions([]);
    setRegion(newRegion);
    mapRef.current.animateToRegion(newRegion, 1000);
    setSearchText("");
  };

  const handleDirection = async (destinationLongitude, destinationLatitude) => {
    if (
      !userCurrentLocation ||
      !userCurrentLocation.longitude ||
      !userCurrentLocation.latitude
    ) {
      console.error("User location is incomplete or not available.");
      return;
    }
    setRouteCoordinates([]);
    setRouteInfo({});

    try {
      showLoader();
      const data = await OpenRouteServise.directionsServiseJson(
        userCurrentLocation.longitude,
        userCurrentLocation.latitude,
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
        const distance = summary.distance.toFixed(2);
        const duration = (summary.duration / 60).toFixed(1);

        setRouteInfo({ distance: distance, duration: duration });

        const decodedCoordinates = polyline
          .decode(geometry)
          .map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng,
          }));

        setRouteCoordinates(decodedCoordinates);

        setRouteSteps(route.segments[0].steps);
        setCurrentStep(0);

        if (bbox.length === 4) {
          const [minLng, minLat, maxLng, maxLat] = bbox;
          const newRegion = {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: Math.abs(maxLat - minLat) * 2,
            longitudeDelta: Math.abs(maxLng - minLng) * 2,
          };

          setDirectionRegio(newRegion);
          mapRef.current.animateToRegion(newRegion, 1000);
        }

        // console.log(routeInfo);
        // console.log(data);
      } else {
        console.error("No valid routes or geometry found.");
      }
    } catch (error) {
      console.error("Error fetching directions:", error.message);
    } finally {
      hideLoader();
    }
  };

  const startNavigation = async () => {
    console.log("Navigation started!");

    if (userCurrentLocation && routeSteps.length > 0) {
      const firstStep = routeSteps[0];
      if (isNavigationSoundOn) {
        Speech.speak(firstStep.instruction);
      }
      setNavigationStepsInstruction(firstStep.instruction);

      mapRef.current?.animateToRegion({
        latitude: userCurrentLocation.latitude,
        longitude: userCurrentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      let currentStepIndex = 0;

      try {
        const navigationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,
            distanceInterval: 5,
          },
          (location) => {
            const userLat = location.coords.latitude;
            const userLng = location.coords.longitude;

            let nearestStepIndex = -1;
            let minDistance = Infinity;

            routeSteps.forEach((step, index) => {
              const stepLat = step.latitude;
              const stepLng = step.longitude;

              const distance = Math.sqrt(
                Math.pow(stepLat - userLat, 2) + Math.pow(stepLng - userLng, 2)
              );

              if (distance < minDistance) {
                minDistance = distance;
                nearestStepIndex = index;
              }
            });

            if (
              nearestStepIndex !== -1 &&
              nearestStepIndex !== currentStepIndex
            ) {
              currentStepIndex = nearestStepIndex;
              const nextStep = routeSteps[currentStepIndex];
              console.log(`Next step: ${nextStep.instruction}`);
              setNavigationStepsInstruction(nextStep.instruction);

              if (isNavigationSoundOn) {
                Speech.speak(nextStep.instruction);
              }

              mapRef.current?.animateCamera(
                {
                  center: {
                    latitude: nextStep.latitude,
                    longitude: nextStep.longitude,
                  },
                  heading: userLocationHeading || 0,
                  // pitch: 60,
                  zoom: 17,
                },
                { duration: 500 }
              );
            }
          }
        );

        setIsAligningHeading(true);
        setNavigationIntervalId(navigationSubscription);
      } catch (error) {
        console.error("Error starting navigation:", error.message);
      }
    } else {
      console.log("User location or route steps not available");
    }
  };

  const closeNavigationModule = () => {
    // clearInterval(navigationIntervalId);
    // setNavigationIntervalId("");
    // setNavigationStepsInstruction("");
    // setRouteCoordinates([]);
    // setRouteInfo({});
    closeModule("navigationModule");
    // setIsAligningHeading(false);

    // if (userCurrentLocation) {
    //   mapRef.current?.animateToRegion({
    //     ...userCurrentLocation,
    //     latitudeDelta: 0.005,
    //     longitudeDelta: 0.005,
    //   });
    // } else {
    //   console.log("User location not available");
    // }
    // console.log("Route reset!");
  };

  const openNavigationModule = (item) => {
    // console.log(item);
    if (item.latitude && item.longitude) {
      handleDirection(item.longitude, item.latitude);
    } else {
      handleDirection(item.coordinates[0], item.coordinates[1]);
    }

    openModule("navigationModule");
    mapRef.current.animateToRegion(directionRegio, 1000);
  };

  const openUpdateLocationModule = (item) => {
    setSelectedParkingLocation(item);
    openModule("updateLocationModule");
  };
  const closeUpdateLocationModule = () => {
    // setSelectedParkingLocation({});
    closeModule("updateLocationModule");
  };

  //Haversine Formula
  const calculateDistance = (latitude, longitude) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;

    const R = 6371 * 1000;
    const dLat = toRadians(userCurrentLocation.latitude - latitude);
    const dLon = toRadians(userCurrentLocation.longitude - longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(latitude)) *
        Math.cos(toRadians(userCurrentLocation.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  //kullanicinin konumu ve seçtigi lokasyonun arasindaki mesafeye gore sesim yapma
  const handleParkingMarker = (item) => {
    setSelectedParkingLocation(item);

    const distance = calculateDistance(item.latitude, item.longitude);
    // console.log("distance", Math.floor(distance));
    // closeLocationSearchModule();
    setSelectedLocationCircle(null);

    if (distance <= 200) {
      openUpdateLocationModule(item);
    } else {
      // openUpdateLocationModule(item);

      openNavigationModule(item);
      // console.log(item);
    }
  };

  const handleFirebaseFetchedLocations = async (fetchedItems) => {
    try {
      const fetchedLocations = fetchedItems.map((data) => [
        data.longitude,
        data.latitude,
      ]);
      const allLocations = [
        [userCurrentLocation.longitude, userCurrentLocation.latitude],
        ...fetchedLocations,
      ];

      const result = await OpenRouteServise.matrixService(allLocations);

      // console.log(result);
      const sortedSuggestions = result.distances
        .map((distance, index) => {
          if (index === 0) return null;

          return {
            latitude: allLocations[index][1],
            longitude: allLocations[index][0],
            distance: distance[0],
            duration: result.durations[index][0],
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance);

      const results = [];

      for (const item of sortedSuggestions) {
        // console.log("item: ", item);
        try {
          const data = await OpenRouteServise.reverseGeocodeService(
            item.longitude,
            item.latitude
          );
          const address =
            data.features[0]?.properties?.name || "Unknown Address";

          results.push({
            latitude: item.latitude,
            longitude: item.longitude,
            distance: item.distance,
            duration: item.duration,
            address: address,
          });
        } catch (error) {
          console.error(
            "Error fetching address for item:",
            item,
            error.response?.data || error.message
          );
          results.push({
            ...item,
            address: "Error Fetching Address",
          });
        }
      }

      // setSearchedLocationSuggections(results);
      searchedLocationSuggections = results;

      // console.log("Updated Location Suggestions:", results);
    } catch (error) {
      console.error("Error in handleFirebaseFetchedLocations:", error.message);
    }
  };

  //--------------------------------------------------------
  //firesrore fetch

  useEffect(() => {
    const fetchLiveLocations = async () => {
      console.log("selectedLocationCircle", selectedLocationCircle);
      console.log("liveLocationsDistance", liveLocationsDistance);

      // setFirebaseFetchedLocations([]);
      firebaseFetchedLocations = [];

      showLoader();
      try {
        const result =
          await ParkingSpacesSqliteService.fetchLocationsFromFirestoreWithCenter(
            selectedLocationCircle.coordinates[1],
            selectedLocationCircle.coordinates[0],
            liveLocationsDistance
          );

        // console.log("result firestore", result);
        // console.log(
        //   "ilk timestamp",
        //   new Date(result[0].timestamp).toLocaleString()
        // );
        // setFirebaseFetchedLocations(result);
        firebaseFetchedLocations = result;
        if (result.length > 0) {
          await handleFirebaseFetchedLocations(result);
          openLocationSelectedModule();
          Alert.alert(
            "Data Update",
            "The latest data has been retrieved successfully. Please tap on the map to view it."
          );
        } else {
          Alert.alert(
            "No Nearby Available Parking Spots",
            "Unfortunately, we couldn't find a available parking spot near your searched location. Please try searching in a different area."
          );
          // setSearchedLocationSuggections("");
          searchedLocationSuggections = [];
        }
        // console.log("result lenght", result.length);
      } catch (error) {
        console.log("error firestore fetch", error);
      }
      hideLoader();
    };

    if (getLiveLocationsSelectedArea && selectedLocationCircle) {
      fetchLiveLocations();
      setGetLiveLocationsSelectedArea(false);
    }
  }, [getLiveLocationsSelectedArea]);

  const openLocationSelectedModule = () => {
    openModule("locationSelectedModule");

    // calculateRegionForDistance(item);
  };

  const closeLocationSearchModule = () => {
    // setSelectedLocationCircle(null);
    closeModule("locationSelectedModule");
  };

  // const calculateRegionForDistance = (item) => {
  //   const latitude = item.coordinates[1];
  //   const longitude = item.coordinates[0];
  //   const R = 6371 * 1000;

  //   const delta = (liveLocationsDistance / R) * (180 / Math.PI);

  //   const newRegion = {
  //     latitude: latitude,
  //     longitude: longitude,
  //     latitudeDelta: 0.001,
  //     longitudeDelta: 0.001,
  //   };
  // };

  const handleBackgroundPress = () => {
    // closeNavigationModule();
    // closeUpdateLocationModule();
    closeSearch();
  };

  const handleThanksModule = () => {
    setTimeout(() => {
      openModule("thanksModule");
      setTimeout(() => {
        closeModule();
      }, 2000);
    }, 500);
  };

  const handleUpdateLocation = async (status) => {
    const isOnline = await checkInternetConnection();

    if (!isOnline) {
      Alert.alert(
        "No Internet Connection",
        "Changes will sync once the internet connection is restored."
      );

      closeUpdateLocationModule();
      handleThanksModule();
    }

    const result = {
      sqlite: false,
      firestore: false,
      networt: false,
    };

    const userID = firebaseAuth.currentUser.uid;
    const latitude = selectedParkingLocation.latitude;
    const longitude = selectedParkingLocation.longitude;

    try {
      await ParkingSpacesSqliteService.updateLocationStatus(
        latitude,
        longitude,
        status,
        userID,
        result
      );

      if (result.sqlite && result.firestore) {
        Alert.alert(
          "Success",
          "Location status has been updated successfully."
        );
      } else {
        Alert.alert(
          "Error",
          "Failed to update location status in one or more systems. Please try again later."
        );
      }

      setIsParkingSpacesDatabaseInitialized(false);
      closeUpdateLocationModule();
      handleThanksModule();
    } catch (error) {
      console.error("Error updating location status:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while updating the location status."
      );
    }
  };

  // const fetchSpots = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(firestoreDB, "spots"));
  //     const spots = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       latitude: doc.data().coords.latitude,
  //       longitude: doc.data().coords.longitude,
  //       title: doc.data().title || `Spot ${doc.id}`,
  //       status: doc.data().status,
  //       timestamp: doc.data().timestamp,
  //     }));
  //     setSpotsDatabase(spots);
  //   } catch (error) {
  //     Alert.alert("Error", `Failed to load spots: ${error.message}`);
  //   }
  // };
  // useEffect(() => {
  //   fetchSpots();
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
      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />

          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={toggleAccountMenu}>
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color="black"
                />
              </TouchableOpacity>

              <View style={styles.searchBox}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for a location"
                  onChangeText={setSearchText}
                  onSubmitEditing={() => {
                    handleSearch();
                    setRouteCoordinates([]);
                    setRouteInfo({});
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
                  keyExtractor={(item, index) => index}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => handleSuggestionSelect(item)}
                    >
                      <Text style={styles.suggestionText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />

                {searchedSuggestions.length > 2 && (
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

            {navigationStepsInstnstruction && (
              <View style={styles.suggestionsContainer}>
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {navigationStepsInstnstruction}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <Animated.View
            style={[
              styles.accountMenu,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <View style={styles.accountMenuTopSection}>
              <Text style={styles.accountMenuTopSectionText}>User Menu</Text>
            </View>

            {/* <View style={styles.avatarContainer}>
              <Image
                source={require("../../assets/Profile.png")}
                style={styles.avatar}
              />
            </View> */}
            <View style={styles.accountMenuUsernameSection}>
              <Text style={styles.accountMenuUsernameSectionText}>Welcome</Text>
              <Text style={styles.accountMenuUsernameSectionText}>
                {firebaseAuth.currentUser.displayName}
              </Text>
            </View>

            {!showUsersPoints && (
              <View style={styles.accountMenuMiddleSection}>
                <TouchableOpacity
                  style={styles.accountMenuMiddleSectionMenuButton}
                  onPress={() => navigation.navigate("UpdateProfile")}
                >
                  <Text style={styles.accountMenuMiddleSectionMenuButtonText}>
                    Update Profile
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.accountMenuMiddleSectionMenuButton}
                  onPress={() => {
                    setShowUsersPoints(true);
                    fetchUserPoints();
                  }}
                >
                  <Text style={styles.accountMenuMiddleSectionMenuButtonText}>
                    My Points
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.accountMenuMiddleSectionMenuButton}
                  onPress={() => navigation.navigate("HistoryScreen")}
                >
                  <Text style={styles.accountMenuMiddleSectionMenuButtonText}>
                    History
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.accountMenuMiddleSectionMenuButton}
                >
                  <Text
                    style={styles.accountMenuMiddleSectionMenuButtonText}
                    onPress={() => navigation.navigate("TermsAndConditions")}
                  >
                    Terms & Conditions
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {showUsersPoints && (
              <View style={styles.accountMenuMiddleSection}>
                <View style={styles.accountMenuShowUserPoints}>
                  <View style={styles.accountMenuShowUserPointsIconContainer}>
                    <FontAwesome name="star" size={50} color="#e4e71e" />
                  </View>

                  <View style={styles.accountMenuShowUserPointsTextContainer}>
                    <Text style={styles.accountMenuShowUserPointsText}>
                      {usersPoints}
                    </Text>
                  </View>
                </View>

                <View style={styles.accountMenuPointsInfoContainer}>
                  <Text style={styles.accountMenuPointsInfoText}>
                    More info about the points system{" "}
                    <Text
                      style={styles.accountMenuPointsInfoTextLink}
                      onPress={() => navigation.navigate("PointsInfo")}
                    >
                      click here
                    </Text>
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.accountMenuMiddleSectionMenuButton}
                  onPress={() => setShowUsersPoints(false)}
                >
                  <Text style={styles.accountMenuMiddleSectionMenuButtonText}>
                    Back to Menu
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.accountMenuBottomSection}>
              <TouchableOpacity
                style={styles.accountMenuLogoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.accountMenuLogoutButtonText}>Log out</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.accountMenuCloseButton}
                onPress={toggleAccountMenu}
              >
                {/* <View style={styles.closeButtonContainer}>
                <Ionicons name="close" size={24} color="white" />
              </View> */}

                <Text style={styles.accountMenuCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            // region={region}
            onRegionChangeComplete={setRegion}
          >
            {userCurrentLocation && (
              <Marker
                coordinate={userCurrentLocation}
                title="Your Location"
                opacity={1}
              >
                <Image
                  source={require("../assets/car4.png")}
                  style={styles.markerImage}
                />
              </Marker>
            )}

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

            {public_parking && public_parking.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={item.name_du}
                description={`Capacity (Car): ${item.capacity_car}`}
                image={require("../assets/parking40.png")}
                onPress={() => openNavigationModule(item)}
                opacity={1}
              ></Marker>
            ))}

            {park_and_ride && park_and_ride.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={item.name_du}
                description={` Capacity (Car): ${item.capacity_car}`}
                image={require("../assets/parking40.png")}
                onPress={() => openNavigationModule(item)}
                opacity={1}
              ></Marker>
            ))}

            {firebaseFetchedLocations &&
              firebaseFetchedLocations.map((item, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }}
                  opacity={1}
                  onPress={() => handleParkingMarker(item)}
                  pinColor="green"
                />
              ))}

            {on_street_parking && !navigationIntervalId &&
              on_street_parking
                .filter(
                  (item) =>
                    !firebaseFetchedLocations.some(
                      (firebaseItem) =>
                        firebaseItem.latitude === item.latitude &&
                        firebaseItem.longitude === item.longitude
                    )
                )
                .map((item, index) => (
                  <Marker
                    key={`sqlite-${index}`}
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }}
                    pinColor={
                      item.status === "unknown"
                        ? "gray"
                        : item.status === "available"
                        ? "green"
                        : "red"
                    }
                    opacity={1}
                    onPress={() => handleParkingMarker(item)}
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
                  onPress={() => handleSuggestionSelect(item)}
                  opacity={1}
                >
                  <MaterialIcons name="location-pin" size={50} color="purple" />
                </Marker>
              ))}

            {selectedLocationCircle && (
              <Circle
                center={{
                  latitude: selectedLocationCircle.coordinates[1],
                  longitude: selectedLocationCircle.coordinates[0],
                }}
                radius={liveLocationsDistance}
                fillColor="rgba(0, 150, 255, 0.2)"
                strokeColor="rgba(0, 150, 255, 0.5)"
              />
            )}

            {activeModule === "navigationModule" &&
              routeCoordinates.length > 0 && (
                <Polyline
                  coordinates={routeCoordinates}
                  strokeColor="blue"
                  strokeWidth={4}
                />
              )}

            {/* {routeSteps[currentStep] && (
            <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]}>
              <View style={styles.navigationBox}>
                <TouchableOpacity
                  style={styles.navigationCloseButton}
                  onPress={() => {
                    setRouteCoordinates([]);
                    setRouteSteps([]);
                   
                  }}
                >
                  <MaterialIcons name="close" size={20} color="red" />
                </TouchableOpacity>
                <Text style={styles.navigationText}>
                  {routeSteps[currentStep].instruction}
                </Text>
              </View>
            </Marker>
          )} */}

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

            {/* routeCoordinates.length - 1 */}

            {/* {routeInfo && (
            <Marker coordinate={routeCoordinates[0]}> 
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

              
                <Text style={styles.routeInfoText}>
                  {`Distance: ${routeInfo.distance}`}
                </Text>
                <Text style={styles.routeInfoText}>
                  {`Duration: ${routeInfo.duration}`}
                </Text>
              </View>
            </Marker>
          )} */}
          </MapView>

          {/* <Animated.View
          style={[{ transform: [{ translateY: rightCornerTranslateY }] }]}
        >
          <View style={styles.rightcornerButtonsContainer}>
            <TouchableOpacity
              style={styles.alignHeadingButton}
              onPress={() => setIsAligningHeading(!isAligningHeading)}
            >
              <MaterialIcons
                name={isAligningHeading ? "navigation" : "explore"}
                size={24}
                color="black"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mapRefreshButton}
              onPress={deleteDatabases}
            >
              <MaterialIcons name="delete" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mapRefreshButton}
              onPress={handleMapRefresher}
            >
              <Ionicons name="refresh" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navigationSoundButton}
              onPress={() => setIsNavigationSoundOn(!isNavigationSoundOn)}
            >
              <Ionicons
                name={
                  isNavigationSoundOn
                    ? "volume-high-outline"
                    : "volume-mute-outline"
                }
                size={24}
                color={"black"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.locationButton}
              onPress={goToUserLocation}
            >
              <MaterialIcons name="my-location" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </Animated.View> */}

          {/* {activeModule === "updateLocationModul" && (
            <Animated.View
              style={[
                styles.updateLocationModuleContainer,
                { transform: [{ translateY }] },
              ]}
              {...panResponder.panHandlers}
            >
              <View style={styles.updateLocationModuleHandle} />

              <View style={styles.updateLocationModuleStatusQuestionContainer}>
                <View
                  style={
                    styles.updateLocationModuleStatusQuestionImageContainer
                  }
                >
                  <FontAwesome
                    name="question-circle"
                    size={100}
                    color="#43a0de"
                  />
                  <FontAwesome5 name="praying-hands" size={24} color="black" />
                </View>

                <View
                  style={styles.updateLocationModuleStatusQuestionTextContainer}
                >
                  <Text style={styles.updateLocationModuleStatusQuestionText}>
                    Please report the parking availability.
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.updateLocationModuleStatusContainer,
                  {
                    backgroundColor:
                      selectedParkingLocation.status === "available"
                        ? "green"
                        : selectedParkingLocation.status === "unavailable"
                        ? "red"
                        : "gray",
                  },
                ]}
              >
                <View style={styles.updateLocationModuleStatusTextContainer}>
                  <Text style={styles.updateLocationModuleStatusText}>
                    Status: {selectedParkingLocation.status}
                  </Text>
                  <Text style={styles.updateLocationModuleStatusTimestamp}>
                    Last Change:
                    {` ${new Date(
                      selectedParkingLocation.timestamp
                    ).toLocaleString()}`}
                  </Text>
                </View>

                <View style={styles.updateLocationModuleUpdateButtonsContainer}>
                  <TouchableOpacity
                    style={styles.updateLocationModuleUpdateAvailableButton}
                  >
                    <Text
                      style={
                        styles.updateLocationModuleUpdateAvailableButtonText
                      }
                    >
                      Free
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.updateLocationModuleUpdateUnavailableButton}
                  >
                    <Text
                      style={
                        styles.updateLocationModuleUpdateUnavailableButtonText
                      }
                    >
                      Occupaid
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.getDitectionContainer}>
              <View style={styles.getDitectionTextContainer}>
                <View style={styles.updateLocationTextContainer}>
                  <Text style={styles.updateLocationModalText}>
                    Distance: {routeInfo.distance} km
                  </Text>
                  <Text style={styles.updateLocationModalText}>
                    Duration: {routeInfo.duration} mins
                  </Text>
                </View>
              </View>
            </View>

              <View style={styles.updateLocationModalButtons}>
              <TouchableOpacity
                style={styles.navigationStartButton}
                onPress={openNavigationModule}
              >
                <Text style={styles.navigationStartButtonText}>
                  Get Directions
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navigationCancelButton}
                onPress={setActiveModule("")}
              >
                <Text style={styles.navigationCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

            </View>
            </Animated.View>
          )} */}

          <Animated.View
            pointerEvents="box-none"
            style={[styles.moduleStyle, { transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >
            <View
              style={styles.rightcornerButtonsContainer}
              pointerEvents="box-none"
            >
              <View
                style={[styles.rightcornerButtonsContainerLeft]}
                pointerEvents="none"
              ></View>

              <View
                style={styles.rightcornerButtonsContainerRight}
                pointerEvents="box-none"
              >
                <TouchableOpacity
                  style={styles.alignHeadingButton}
                  onPress={() => setIsAligningHeading(!isAligningHeading)}
                >
                  <MaterialIcons
                    name={isAligningHeading ? "navigation" : "explore"}
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.mapRefreshButton}
                  onPress={updateDatabaseFromFirestore}
                >
                  <MaterialCommunityIcons
                    name="database-arrow-down"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.mapRefreshButton}
                  onPress={handleMapRefresher}
                >
                  <Ionicons name="refresh" size={24} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.navigationSoundButton}
                  onPress={() => setIsNavigationSoundOn(!isNavigationSoundOn)}
                >
                  <Ionicons
                    name={
                      isNavigationSoundOn
                        ? "volume-high-outline"
                        : "volume-mute-outline"
                    }
                    size={24}
                    color={"black"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={goToUserLocation}
                >
                  <MaterialIcons name="my-location" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            {activeModule === "updateLocationModule" && (
              <View style={styles.updateLocationModuleContainer}>
                <View style={styles.updateLocationModuleHandle} />

                <View
                  style={styles.updateLocationModuleStatusQuestionContainer}
                >
                  <View
                    style={
                      styles.updateLocationModuleStatusQuestionImageContainer
                    }
                  >
                    <FontAwesome
                      name="question-circle"
                      size={100}
                      color="#43a0de"
                    />
                  </View>

                  <View
                    style={
                      styles.updateLocationModuleStatusQuestionTextContainer
                    }
                  >
                    <Text style={styles.updateLocationModuleStatusQuestionText}>
                      Please report the parking availability.
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.updateLocationModuleStatusContainer,
                    {
                      backgroundColor:
                        selectedParkingLocation.status === "available"
                          ? "green"
                          : selectedParkingLocation.status === "unavailable"
                          ? "red"
                          : "gray",
                    },
                  ]}
                >
                  <View style={styles.updateLocationModuleStatusTextContainer}>
                    <Text style={styles.updateLocationModuleStatusText}>
                      Status: {selectedParkingLocation.status}
                    </Text>
                    <Text style={styles.updateLocationModuleStatusTimestamp}>
                      Last Change:
                      {` ${new Date(
                        selectedParkingLocation.timestamp
                      ).toLocaleString()}`}
                    </Text>
                  </View>

                  <View
                    style={styles.updateLocationModuleUpdateButtonsContainer}
                  >
                    {selectedParkingLocation.status !== "available" && (
                      <TouchableOpacity
                        style={styles.updateLocationModuleUpdateAvailableButton}
                        onPress={async () =>
                          await handleUpdateLocation("available")
                        }
                      >
                        <Text
                          style={
                            styles.updateLocationModuleUpdateAvailableButtonText
                          }
                        >
                          Free
                        </Text>
                      </TouchableOpacity>
                    )}

                    {selectedParkingLocation.status !== "unavailable" && (
                      <TouchableOpacity
                        style={
                          styles.updateLocationModuleUpdateUnavailableButton
                        }
                        onPress={async () =>
                          await handleUpdateLocation("unavailable")
                        }
                      >
                        <Text
                          style={
                            styles.updateLocationModuleUpdateUnavailableButtonText
                          }
                        >
                          Occupaid
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.updateLocationModuleHistoryButton}
                  onPress={() =>
                    addHistoryRecord(
                      selectedParkingLocation.latitude,
                      selectedParkingLocation.longitude
                    )
                  }
                >
                  <Text style={styles.updateLocationModuleHistoryButtonText}>
                    Save This Location
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.updateLocationModuleCloseButton}
                  onPress={closeUpdateLocationModule}
                >
                  <Text style={styles.updateLocationModuleCloseButtonText}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                {/* <View style={styles.getDitectionContainer}>
              <View style={styles.getDitectionTextContainer}>
                <View style={styles.updateLocationTextContainer}>
                  <Text style={styles.updateLocationModalText}>
                    Distance: {routeInfo.distance} km
                  </Text>
                  <Text style={styles.updateLocationModalText}>
                    Duration: {routeInfo.duration} mins
                  </Text>
                </View>
              </View>
            </View> */}

                {/* <View style={styles.updateLocationModalButtons}>
              <TouchableOpacity
                style={styles.navigationStartButton}
                onPress={openNavigationModule}
              >
                <Text style={styles.navigationStartButtonText}>
                  Get Directions
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navigationCancelButton}
                onPress={setActiveModule("")}
              >
                <Text style={styles.navigationCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

            </View> */}
              </View>
            )}

            {activeModule === "thanksModule" && (
              <View style={styles.thanksModuleContainer}>
                <View style={styles.thanksModuleHandle} />
                <View style={styles.thanksModuleIcon}>
                  <FontAwesome5 name="praying-hands" size={50} color="black" />
                </View>
                <View style={styles.thanksModuleTextContainer}>
                  <Text style={styles.thanksModuleText}>
                    Thank you for your contribution!
                  </Text>
                </View>
              </View>
            )}

            {activeModule === "navigationModule" && (
              <View style={styles.navigationModuleContainer}>
                <View style={styles.navigationModuleHandle} />

                <View style={styles.navigationModuleTextContainer}>
                  <Text style={styles.navigationModuleText}>
                    Distance: {routeInfo.distance} km
                  </Text>
                  <Text style={styles.navigationModuleText}>
                    Duration: {routeInfo.duration} mins
                  </Text>
                </View>

                <View style={styles.navigationModuleButtons}>
                  <TouchableOpacity
                    style={styles.navigationStartButton}
                    onPress={startNavigation}
                  >
                    <Text style={styles.navigationStartButtonText}>Start</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.navigationCancelButton}
                    onPress={closeNavigationModule}
                  >
                    <Text style={styles.navigationCancelButtonText}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {activeModule === "locationSelectedModule" && (
              <View style={styles.locationSearchModuleContainer}>
                <View style={styles.locationSearchModuleHandle} />
                <View style={styles.locationSearchModuleSuggestionsContainer}>
                  {searchedLocationSuggections.length > 0 && (
                    <View>
                      <View style={{ height: 290 }}>
                        <FlatList
                          data={searchedLocationSuggections}
                          keyExtractor={(item, index) => index}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              style={
                                styles.locationSearchModuleSuggestionContainer
                              }
                              onPress={() => handleParkingMarker(item)}
                              // onPress={()=>{console.log("item flat list", item);}}
                            >
                              <View
                                style={styles.locationSearchModuleSuggestion}
                              >
                                <View
                                  style={
                                    styles.locationSearchModuleSuggestionTextContainer
                                  }
                                >
                                  <Text
                                    style={
                                      styles.locationSearchModuleSuggestionText
                                    }
                                  >
                                    Adress: {item.address}
                                  </Text>
                                  <Text
                                    style={
                                      styles.locationSearchModuleSuggestionText
                                    }
                                  >
                                    Distance: {item.distance} Duration:
                                    {item.duration}
                                  </Text>
                                </View>
                                <FontAwesome5
                                  name="parking"
                                  size={30}
                                  color="#11ae13ff"
                                />
                              </View>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                      {searchedLocationSuggections.length > 3 && (
                        <View style={styles.locationSearchModuleScrollHint}>
                          <Ionicons
                            name="chevron-down-outline"
                            size={24}
                            color="white"
                          />
                        </View>
                      )}
                    </View>
                  )}

                  {/* <View style={styles.locationSearchModuleSuggestionContainer}>
                    <View style={styles.locationSearchModuleSuggestion}>
                      <Text style={styles.locationSearchModuleSuggestionText}>
                        Distance: km locationSelectedModule
                      </Text>

                      <FontAwesome5
                        name="parking"
                        size={30}
                        color="#11ae13ff"
                      />
                    </View>
                  </View> */}
                </View>
              </View>
            )}
          </Animated.View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
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
    top: 120,
    bottom: 0,
    left: 0,
    backgroundColor: "#fff",
    zIndex: 1,
    padding: 20,
    elevation: 5,
    width: screenWidth * 0.6,
  },

  // closeRouteInfoButton: {
  //   alignSelf: "flex-end",
  //   marginBottom: 20,
  // },
  accountMenuTopSection: {
    marginBottom: 20,
    alignItems: "center",
    borderBottomWidth: 2,
  },
  accountMenuTopSectionText: {
    fontSize: 20,
    margin: 5,
  },
  accountMenuUsernameSection: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderBottomWidth: 2,
  },
  accountMenuUsernameSectionText: {
    margin: 3,
    fontSize: 16,
  },
  // avatarContainer: {
  //   marginBottom: 20,
  //   alignItems: "center",
  //   width: "100%",
  //   justifyContent: "center",
  // },
  // avatar: {
  //   width: "80%",
  //   height: 150,
  //   borderRadius: 20,
  // },
  accountMenuMiddleSection: {
    flex: 1,
    marginTop: 60,
  },
  accountMenuBottomSection: {
    alignItems: "center",
  },
  accountMenuMiddleSectionMenuButton: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  accountMenuMiddleSectionMenuButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  accountMenuShowUserPoints: {
    flexDirection: "row",
    alignContent: "space-between",
    justifyContent: "center",
  },
  accountMenuShowUserPointsIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  accountMenuShowUserPointsTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  accountMenuShowUserPointsText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "black",
  },
  accountMenuPointsInfoContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  accountMenuPointsInfoText: {
    textAlign: "center",
  },
  accountMenuPointsInfoTextLink: {
    color: "blue",
    textDecorationLine: "underline",
  },
  accountMenuLogoutButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  accountMenuLogoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  accountMenuCloseButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },

  accountMenuCloseButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  markerImage: {
    width: 40,
    height: 40,
  },
  // showZoomMessageContainer: {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: [{ translateX: -150 }, { translateY: -50 }],
  //   backgroundColor: "rgba(0,0,0,0.7)",
  //   padding: 15,
  //   borderRadius: 10,
  //   zIndex: 1,
  //   width: 300,
  // },
  // showZoomMessageText: {
  //   color: "white",
  //   textAlign: "center",
  //   fontSize: 16,
  // },
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
    marginBottom: 100,
    zIndex: 1,
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
    zIndex: 1,
  },

  //module styla buradan basliyor---------------------

  moduleStyle: {
    position: "absolute",
    bottom: 330,
    left: 0,
    right: 0,
    width: "100%",
    height: screenHeight,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  rightcornerButtonsContainer: {
    flexDirection: "row",

    marginBottom: 50,
  },
  rightcornerButtonsContainerLeft: {
    flex: 5,
  },
  rightcornerButtonsContainerRight: {
    flex: 1,
    alignItems: "center",
  },
  mapRefreshButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
  },
  navigationSoundButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "white",
    elevation: 3,
    marginBottom: 10,
    borderWidth: 1,
  },
  locationButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  alignHeadingButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
  },

  navigationModuleContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  navigationModuleHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 10,
  },

  navigationModuleTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  navigationModuleText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#B2DDF9",
  },
  navigationModuleButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  navigationStartButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  navigationStartButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  navigationCancelButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  navigationCancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  updateLocationModuleContainer: {
    backgroundColor: "#2a2a2abf",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  updateLocationModuleHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 10,
  },
  updateLocationModuleStatusQuestionContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    margin: 5,
  },
  updateLocationModuleStatusQuestionImageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  updateLocationModuleStatusQuestionTextContainer: {
    marginVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  updateLocationModuleStatusQuestionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  updateLocationModuleStatusContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "column",
  },
  updateLocationModuleStatusTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  updateLocationModuleStatusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  updateLocationModuleStatusTimestamp: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  updateLocationModuleUpdateButtonsContainer: {
    flexDirection: "row",
  },
  updateLocationModuleUpdateAvailableButton: {
    flex: 1,
    margin: 2,
    backgroundColor: "#B2DDF9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 10,
  },
  updateLocationModuleUpdateUnavailableButton: {
    flex: 1,
    margin: 2,
    backgroundColor: "#B2DDF9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 10,
  },

  updateLocationModuleUpdateAvailableButtonText: {
    color: "green",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  updateLocationModuleUpdateUnavailableButtonText: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  updateLocationModuleCloseButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#B2DDF9",
    margin: 5,
  },
  updateLocationModuleCloseButtonText: {
    color: "red",
    fontSize: 17,
  },
  updateLocationModuleHistoryButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#B2DDF9",
    margin: 5,
  },
  updateLocationModuleHistoryButtonText: {
    color: "black",
    fontSize: 17,
  },
  updateLocationTextContainer: {
    marginVertical: 10,
  },
  updateLocationModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navigationStartButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  navigationStartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  navigationCancelButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  navigationCancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  thanksModuleContainer: {
    backgroundColor: "#2a2a2a95",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  thanksModuleHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 10,
  },
  thanksModuleIcon: {
    backgroundColor: "#B2DDF9",
    borderRadius: 100,
    padding: 30,
    marginVertical: 30,
  },
  thanksModuleTextContainer: {
    marginTop: 30,
    marginBottom: 50,
  },
  thanksModuleText: {
    color: "#B2DDF9",
    fontSize: 30,
    textAlign: "center",
  },
  locationSearchModuleContainer: {
    backgroundColor: "#2a2a2ab3",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  locationSearchModuleHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 10,
  },
  locationSearchModuleSuggestionsContainer: {
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  locationSearchModuleSuggestionContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1,
    margin: 3,
    borderRadius: 10,
    flexShrink: 0,
    width: screenWidth * 0.8,
  },
  locationSearchModuleSuggestionTextContainer: {
    width: "90%",
  },
  locationSearchModuleSuggestion: {
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  locationSearchModuleSuggestionIcon: {
    alignSelf: "flex-end",
  },
  locationSearchModuleSuggestionText: {
    marginVertical: 2,
    color: "white",
    fontSize: 15,
    width: "85%",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    fontWeight: "bold",
  },
  locationSearchModuleScrollHint: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    alignItems: "center",
  },
});

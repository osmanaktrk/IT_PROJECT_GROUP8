import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, TextInput, Button, Dimensions, Alert, Text, Image, TouchableOpacity, FlatList } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

import { getDocs, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseAuth, firestoreDB } from '../FirebaseConfig'; //user authentication
import { signOut, reauthenticateWithCredential, EmailAuthProvider, } from "firebase/auth";

export default function App({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [spotsDatabase, setSpotsDatabase] = useState([]);
  const [mapLocation, setMapLocation] = useState({
    latitude: 50.8503,
    longitude: 4.3517,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });
  const [liveLocation, setLiveLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  const mapRef = useRef(null);

  const markers = [
    { id: 1, latitude: 50.8466, longitude: 4.3528, title: "Grote Markt", price: 10, status: "available" },
    { id: 2, latitude: 50.8503, longitude: 4.3497, title: "Manneken Pis", price: "free", status: "unavailable" },
    { id: 3, latitude: 50.8456, longitude: 4.3572, title: "Koninklijke Sint-Hubertusgalerijen", price: 7.5, status: "available" },
    { id: 4, latitude: 50.8505, longitude: 4.3488, title: "Stadhuis van Brussel", price: 3.5, status: "available" },
  ];

  const fetchSpots = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestoreDB, "spots"));
      const spots = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        latitude: doc.data().coords.latitude,
        longitude: doc.data().coords.longitude,
        title: doc.data().title || `Spot ${doc.id}`,
        price: doc.data().price || "Onbekend",
        status: doc.data().status,
      }));
      setSpotsDatabase(spots);
    } catch (error) {
      Alert.alert("Error", `Failed to load spots: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  // Automatically update the debounced search query after 1 second
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 1000);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim() !== "") searchLocation(debouncedQuery);
  }, [debouncedQuery]);

  // Request location permissions and track live location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Locatietoegang geweigerd", "Schakel locatietoegang in om je huidige locatie te gebruiken.");
        return;
      }
      setPermissionGranted(true);
  
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = location.coords;
  
      const initialLocation = {
        latitude,
        longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      };
  
      setLiveLocation({ latitude, longitude });
      setMapLocation(initialLocation); // Stel live locatie als startpunt van de kaart in.
  
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          setLiveLocation({ latitude, longitude });
        }
      );
    })();
  }, []);
  

  const searchLocation = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`,
        { headers: { "User-Agent": "ReactNativeApp/1.0 (https://example.com)" } }
      );

      if (!response.ok) throw new Error(`HTTP status ${response.status}`);

      const data = await response.json();
      if (data.length === 0) {
        Alert.alert("Geen resultaten", "Probeer een andere locatie.");
        return;
      }

      const coords = {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        latitudeDelta: 0.065,
        longitudeDelta: 0.065,
      };

      setMapLocation(coords);
    } catch (error) {
      Alert.alert("Fout", `Er ging iets mis bij het ophalen van de locatie: ${error.message}`);
    }
  };
  const toggleAccountMenu = () => setShowAccountMenu(!showAccountMenu);

  const goToLiveLocation = () => {
    if (liveLocation) {
      setMapLocation({ ...liveLocation, latitudeDelta: 0.03, longitudeDelta: 0.03 });
    } else {
      Alert.alert("Geen live locatie beschikbaar", "Controleer of locatie is ingeschakeld.");
    }
  };

  const navigateToMarker = (latitude, longitude) => {
    setMapLocation({ latitude, longitude, latitudeDelta: 0.03, longitudeDelta: 0.03 });
  };

  const fitAllMarkers = () => {
    mapRef.current?.fitToCoordinates(
      markers.map((m) => ({ latitude: m.latitude, longitude: m.longitude })),
      { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true }
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await signOut(firebaseAuth);
      Alert.alert("Success", "You have been logged out.");
      navigation.replace("FrontPage");
    } catch (error) {
      Alert.alert("Logout Failed", `An error occurred: ${error.message}`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      {!showAccountMenu && (
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => setShowAccountMenu(true)}>
            <Ionicons name="person-circle-outline" size={40} color="black" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Zoek een locatie"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <Button title="Zoom op alle markers" onPress={fitAllMarkers} />
        </View>
      )}

{showAccountMenu && !showUpdateProfile && (
        <View style={styles.accountMenu}>
          <View style={styles.topSection}>
            <Text style={styles.accountText}>Name</Text>
          </View>
          <View style={styles.middleSection}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setShowUpdateProfile(true)}
            >
              <Text style={styles.menuButtonText}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={() => setShowMyPoints(true)}>
              <Text style={styles.menuButtonText}>My Points</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("HistoryScreen")} // Navigate to the history page
            >
            <Text style={styles.menuButtonText}>History</Text>
          </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton}
            onPress={() => navigation.navigate("TermsAndConditions")}
            >
              <Text style={styles.menuButtonText}>Terms & Conditions</Text>
            </TouchableOpacity>
            
          </View>
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Log out</Text>

            </TouchableOpacity>
            <TouchableOpacity onPress={toggleAccountMenu}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showUpdateProfile && (
        <View style={styles.accountMenu}>
          <View style={styles.topSection}>
            <Text style={styles.accountText}>Update Profile</Text>
          </View>
          <View style={styles.middleSection}>
            <TextInput style={styles.inputField} placeholder="Name" />
            <TextInput style={styles.inputField} placeholder="E-mail" />
            <TextInput style={styles.inputField} placeholder="Phone number" />
          </View>
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleAccountMenu}>
              <Text style={styles.menuButtonText}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setShowUpdateProfile(false)}
            >
              <Text style={styles.menuButtonText}>Back to menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      

      <TouchableOpacity 
        onPress={goToLiveLocation} 
        style={styles.locationButton}
      >
        <Image 
          source={require("../assets/MyLocationMarker.png")} 
          style={styles.locationButtonImage}
        />
      </TouchableOpacity>

      <MapView ref={mapRef} style={styles.map} region={mapLocation}>
        {liveLocation && (
          <Marker coordinate={liveLocation}>
              <View style={styles.markerContainer}>
             <Image
              source={require("../assets/car.png")} 
              style={styles.markerImage}
            />
          </View>
            <Callout>
              <Text>Dit ben jij!</Text>
            </Callout>
          </Marker>
        )}
        {/* Firestore marker */}
        {spotsDatabase.map((spot) => (
          <Marker
          key={spot.id}
          coordinate={{
            latitude: spot.latitude,
            longitude: spot.longitude,
          }}
          title={spot.title}
        >
          {/* Gebruik aangepaste afbeelding afhankelijk van de status */}
    <View style={styles.markerContainer}>
      <Image
        source={
          spot.status === "available"
            ? require("../assets/available.png")
            : require("../assets/notAvailable.png")
        }
        style={styles.markerImage}
      />
    </View>
          <Callout>
            <View>
              <Text>{spot.title}</Text>
              <Text>Prijs: {spot.price} EUR</Text>
              <Text>Status: {spot.status}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
      </MapView>

      {/*{!showAccountMenu && (
       <FlatList
          data={markers}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listText}>{item.title}</Text>
              <Button
                title="Zoom"
                onPress={() => navigateToMarker(item.latitude, item.longitude)}
              />
            </View>
          )}
        /> 
      )}*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 70,
    left: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  accountMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "60%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 2,
    padding: 20,
  },
  topSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  middleSection: {
    flex: 1,
    justifyContent: "center",
  },
  bottomSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  menuButton: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    alignItems: "center",
  },
  menuButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 18,
    color: "black",
    marginTop: 10,
    textAlign: "center",
  },
  accountText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputField: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  list: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    maxHeight: 200,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listText: {
    flex: 1,
  },

  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerImage: {
    width: 50, 
    height: 50, 
    resizeMode: "contain", // keep the ratio the same
  },

  locationButton: {
    position: "absolute",
    bottom: 40, // Zet de knop 20 eenheden van de onderkant
    left: 30,  // Zet de knop 10 eenheden van de linkerkant
    zIndex: 1, // Zorg ervoor dat de knop boven andere componenten komt
  },
  locationButtonImage: {
    width: 60, // Pas de grootte van de afbeelding aan
    height: 60,
    resizeMode: "contain", // Behoud de beeldverhouding
  },
});
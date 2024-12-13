import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  FlatList,
  Dimensions,
  Alert,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons"; // Voor het icoon

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [location, setLocation] = useState({
    latitude: 50.8503, // standaard locatie
    longitude: 4.3517,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });
  const [showAccountMenu, setShowAccountMenu] = useState(false); // Voor het zijmenu
  const [showUpdateProfile, setShowUpdateProfile] = useState(false); // Voor update profiel
  const [liveLocation, setLiveLocation] = useState(null); // Live locatie
  const mapRef = useRef(null);

  const markers = [
    {
      id: 1,
      latitude: 50.8466,
      longitude: 4.3528,
      title: "Grote Markt",
      price: 10,
      status: "available",
    },
    {
      id: 2,
      latitude: 50.8503,
      longitude: 4.3497,
      title: "Manneken Pis",
      price: "free",
      status: "unavailable",
    },
    {
      id: 3,
      latitude: 50.8456,
      longitude: 4.3572,
      title: "Koninklijke Sint-Hubertusgalerijen",
      price: 7.5,
      status: "available",
    },
    {
      id: 4,
      latitude: 50.8505,
      longitude: 4.3488,
      title: "Stadhuis van Brussel",
      price: 3.5,
      status: "available",
    },
  ];

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
    setShowUpdateProfile(false);
  };

  const searchLocation = async () => {
    if (searchQuery.trim() === "") {
      Alert.alert("Fout", "Voer een geldige locatie in.");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&addressdetails=1&limit=1`,
        {
          headers: {
            "User-Agent": "ReactNativeApp/1.0 (https://example.com)",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

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

      setLocation(coords);
      setLocationName(data[0].display_name);
    } catch (error) {
      Alert.alert(
        "Fout",
        `Er ging iets mis bij het ophalen van de locatie: ${error.message}`
      );
    }
  };

  const fitAllMarkers = () => {
    if (mapRef.current && markers.length > 0) {
      const coordinates = markers.map((marker) => ({
        latitude: marker.latitude,
        longitude: marker.longitude,
      }));
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const navigateToMarker = (latitude, longitude) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000 // Animatie duur in milliseconden
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Zoek en knop */}
      {!showAccountMenu && (
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={toggleAccountMenu}>
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

      {/* Zijmenu voor account */}
      {showAccountMenu && !showUpdateProfile && (
        <View style={styles.accountMenu}>
          <View style={styles.topSection}>
            <Text style={styles.accountText}>Weiam</Text>
          </View>

          <View style={styles.middleSection}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setShowUpdateProfile(true)}
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
            <TouchableOpacity style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Log out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleAccountMenu}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Update profiel */}
      {showUpdateProfile && (
        <View style={styles.accountMenu}>
          <View style={styles.topSection}>
            <Text style={styles.accountText}>Update Profile</Text>
          </View>

          <View style={styles.middleSection}>
            <TextInput
              style={styles.inputField}
              placeholder="Name"
              placeholderTextColor="gray"
            />
            <TextInput
              style={styles.inputField}
              placeholder="E-mail"
              placeholderTextColor="gray"
            />
            <TextInput
              style={styles.inputField}
              placeholder="Number-phone"
              placeholderTextColor="gray"
            />
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

      {/* Kaartweergave */}
      <MapView ref={mapRef} style={styles.map} region={location}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            pinColor={marker.status === "available" ? "green" : "red"}
          />
        ))}
      </MapView>

      {/* Lijst van markers */}
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
  callout: {
    padding: 10,
    minWidth: 150,
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
});

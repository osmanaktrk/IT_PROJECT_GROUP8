import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Dimensions,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons"; // Voor het icoon

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [location, setLocation] = useState({
    latitude: 50.8503,
    longitude: 4.3517,
    latitudeDelta: 0.065,
    longitudeDelta: 0.065,
  });
  const [showAccountMenu, setShowAccountMenu] = useState(false); // Voor het zijmenu

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
  ];

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu); // Toggle het zijmenu
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
    } catch (error) {
      Alert.alert(
        "Fout",
        `Er ging iets mis bij het ophalen van de locatie: ${error.message}`
      );
    }
  };

  return (
    <View style={styles.container}>
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
          <Button title="Zoek" onPress={searchLocation} />
        </View>
      )}

      {/* Zijmenu voor account */}
      {showAccountMenu && (
        <View style={styles.accountMenu}>
          {/* Bovenaan de naam van de gebruiker */}
          <View style={styles.topSection}>
            <Text style={styles.accountText}>Weiam</Text>
          </View>

          {/* In het midden de knoppen */}
          <View style={styles.middleSection}>
            <Button title="Update Profile" onPress={() => Alert.alert("Profile")} />
            <Button title="My Points" onPress={() => Alert.alert("Points")} />
            <Button
              title="Terms & Conditions"
              onPress={() => Alert.alert("Terms")}
            />
          </View>

          {/* Onderaan de log out en sluit knoppen */}
          <View style={styles.bottomSection}>
            <Button title="Log out" onPress={() => Alert.alert("Logged out")} />
            <TouchableOpacity onPress={toggleAccountMenu}>
              <Text style={styles.closeButton}>Sluit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Kaart */}
      <MapView style={styles.map} region={location}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            pinColor={marker.status === "available" ? "green" : "red"}
          >
            <Callout>
              <View style={styles.callout}>
                <Text>{marker.title}</Text>
                <Text>{"Status: " + marker.status}</Text>
                <Text>{"Price: " + marker.price + " euro"}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
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
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  accountMenu: {
    position: "absolute",
    top: 0,
    left: 0, // Zorgt ervoor dat het menu aan de linkerkant verschijnt
    width: "60%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Doorzichtig wit
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
    marginTop: 20,
    alignItems: "center",
  },
  closeButton: {
    fontSize: 18,
    color: "blue",
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
});

import React, { useState, useEffect } from "react";
import {StyleSheet, View, TextInput, Button, Dimensions, Alert,} from "react-native";
import MapView, { Marker } from "react-native-maps";

// kaart tonen met standaart locatie
export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [location, setLocation] = useState({
    latitude: 52.3676, // de x en y coordinaten van de standaart locatie
    longitude: 4.9041,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Debounce: Voer de zoekopdracht alleen uit als de gebruiker 1 seconde niet heeft getypt
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000); // 1000 ms = 1 seconde

    return () => {
      clearTimeout(handler); // Annuleer de vorige timer als de gebruiker opnieuw typt
    };
  }, [searchQuery]);

  // Voer de zoekopdracht uit zodra debouncedQuery verandert
  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      searchLocation(debouncedQuery);
    }
  }, [debouncedQuery]);



  // Functie om locatie op te halen
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
            "User-Agent": "ReactNativeApp/1.0 (https://example.com)", // Voeg een User-Agent toe (anders werkt het niet voor android)
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
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
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
      {/* Zoekbalk */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Zoek een locatie"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <Button title="Zoek" onPress={searchLocation} />
      </View>

      {/* Kaart */}
      <MapView style={styles.map} region={location}>
        <Marker coordinate={location} title="Gevonden locatie" />
      </MapView>
    </View>
  );
}

// basic css
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
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
});

import React, { useState, useEffect } from "react";
import {StyleSheet, View, TextInput, Button, Dimensions, Alert, Text} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";


// kaart tonen met standaart locatie
export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [location, setLocation] = useState({
    latitude: 50.8503, // Standaard locatie: Brussel
    longitude: 4.3517,
    latitudeDelta:  0.5,
    longitudeDelta:  0.5,
  });
  const [locationName, setLocationName] = useState("Brussel"); // Locatienaam

  // Lijst met extra markers (voorbeeld: populaire locaties in Brussel)
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
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };
  
      setLocation(coords);
      setLocationName(data[0].display_name); // Gebruik display_name voor de locatie
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

      {/* Kaart met markers */}
      <MapView style={styles.map} region={location}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            pinColor={marker.status === "available" ? "green" : "red"} // Marker kleur afhankelijk van status
          >
            <Callout>
              <View style={styles.callout}>
                <Text>{marker.title}</Text>
                <Text>{"Status: " + marker.status}</Text>
                <Text>{"price " + marker.price + " euro"}</Text>
              </View>
            </Callout>
          </Marker>
           ))}
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

  callout: {
    padding: 10,
    minWidth: 150,
  },
});

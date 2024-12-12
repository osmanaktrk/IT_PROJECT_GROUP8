import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Button, Dimensions, Alert, Text, Image } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location"; 


export default function App() {
 
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [location, setLocation] = useState({
    latitude: 50.8503, // standerd location
    longitude: 4.3517,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });
  const [liveLocation, setLiveLocation] = useState(null); // Live location
  const [permissionGranted, setPermissionGranted] = useState(false); // your location

  // some markers 
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

  // automaticly enter the search after 1 second
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      searchLocation(debouncedQuery);
    }
  }, [debouncedQuery]);

  // get the live location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {  // if the location isn't granted, give a message
        Alert.alert(
          "Locatietoegang geweigerd",
          "Schakel locatietoegang in om je huidige locatie te gebruiken."
        );
        return;
      }
      setPermissionGranted(true);

      // live locatie tracken
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          setLiveLocation({ latitude, longitude });
          setLocation((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
        }
      );
    })();
  }, []);

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

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Zoek een locatie"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <Button title="Zoek" onPress={searchLocation} />
      </View>
      <MapView style={styles.map} region={location}>
        {/* live locatie markering */}
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
                <Text>{"price " + marker.price + " euro"}</Text>
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

  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerImage: {
    width: 50, 
    height: 50, 
    resizeMode: "contain", // keep the ratio the same
  },
});

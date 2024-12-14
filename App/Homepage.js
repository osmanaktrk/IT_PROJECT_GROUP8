import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons"; // Voor het icoon


//********** For Authentication ***************
import { firebaseAuth } from "../FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

//********** For Authentication ***************



export default function HomePage({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState({
    latitude: 50.8503, // standaard locatie
    longitude: 4.3517,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });
  const [showAccountMenu, setShowAccountMenu] = useState(false); // Voor het zijmenu
  const [showUpdateProfile, setShowUpdateProfile] = useState(false); // Voor update profiel
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



  //********** For Authentication ***************
  //Test Logout

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
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

  // Inside the render method:
  {
    isLoggingOut && <ActivityIndicator size="large" color="#0000ff" />;
  }


  //Test delete Account

  // Reauthenticate the user
  const reauthenticate = async (email, password) => {
    try {
      const user = firebaseAuth.currentUser;
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      Alert.alert("Reauthentication Failed", error.message);
      return false;
    }
  };


  // Delete the user account
  const handleDeleteAccount = async () => {
    try {
      const user = firebaseAuth.currentUser;

      // Optional: Ask the user to confirm their password if needed
      const email = user.email;
      const password = "USER_PASSWORD_HERE"; // Get the password from user input
      const isReauthenticated = await reauthenticate(email, password);

      if (isReauthenticated) {
        await user.delete(); // Delete the user account
        Alert.alert("Account Deleted", "Your account has been successfully deleted.");
        navigation.replace("FrontPage"); // Navigate to the home or landing page
      }
    } catch (error) {
      Alert.alert("Account Deletion Failed", error.message);
    }
  };




  //********** For Authentication ***************

  return (
    <View style={styles.container}>

      {/* Test Authendication */}
      <View style={styles.testAuthendicationContainer}>
        {/* Test Logout */}
        <Button title="Test Logout" onPress={handleLogout} />
        {/* Test Delete Account */}
        <Button title="Test Delete Account" onPress={handleDeleteAccount} color="red" />

      </View>

      

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
            <Text style={styles.accountText}>Name</Text>
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
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.navigate("TermsConditions")}
            >
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
              placeholder="Phone number"
              placeholderTextColor="gray"
            />
          </View>

          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={toggleAccountMenu}
            >
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
      {!showAccountMenu && (
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
      )}
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
  testAuthendicationContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  
});

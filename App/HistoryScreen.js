// Importing React and required libraries
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Ionicons } from "@expo/vector-icons";
import {
  getDatabase,
  ref,
  onValue,
  update,
  get,
  remove,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { firebaseAuth, firebaseRealDB } from "../FirebaseConfig";
import * as OpenRouteServise from "./ApiService/openRouteService";

// Initializing the component with state for history data and user ID
export default function HistoryPage({ navigation }) {
  const [historyData, setHistoryData] = useState([]);
  const swipeableRefs = useRef({});

  const currentUser = firebaseAuth.currentUser;

  const fetchHistoryRecords = async () => {
    try {
      const historyRef = ref(
        firebaseRealDB,
        `users/${currentUser.uid}/history`
      );
      const snapshot = await get(historyRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const recordsWithIds = Object.entries(data).map(([id, record]) => ({
          id,
          ...record,
        }));

        const results = [];

        for (const item of recordsWithIds) {
          // console.log("item: ", item);
          try {
            const data = await OpenRouteServise.reverseGeocodeService(
              item.longitude,
              item.latitude
            );
            const address =
              data.features[0]?.properties?.name || "Unknown Address";

            results.push({
              ...item,
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

        // console.log("Fetched history records:", recordsWithIds);
        // console.log("results adress", results);
        setHistoryData(results);
      } else {
        setHistoryData(null);

        console.log("No history records found.");
      }
    } catch (error) {
      console.error("Error fetching history records:", error);
      setHistoryData(null);
    }
  };

  useEffect(() => {
    fetchHistoryRecords();
  }, []);

  const deleteHistoryRecord = async (recordId) => {
    try {
      const historyRef = ref(
        firebaseRealDB,
        `users/${currentUser.uid}/history/${recordId}`
      );
      await remove(historyRef);
      if (swipeableRefs.current[recordId]) {
        swipeableRefs.current[recordId].close();
      }

      fetchHistoryRecords();
      Alert.alert("Success", "History record deleted successfully.");
      console.log("History record deleted successfully.");
    } catch (error) {
      console.error("Error deleting history record:", error);
    }
  };

  // Swipeable action for deletion
  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteHistoryRecord(id)}
    >
      <Ionicons name="trash-outline" size={30} color="white" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recent History</Text>
      <FlatList
        data={historyData}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <Swipeable
            ref={(ref) => {
              if (ref) swipeableRefs.current[item.id] = ref;
            }}
            renderRightActions={() => renderRightActions(item.id)}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("HomePage", { selectedLocation: item })
              }
            >
              <View style={styles.historyItem}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color="black"
                  style={styles.icon}
                />
                <Text style={styles.itemText}>
                  {" "}
                  {item.address ||
                    (item.latitude && item.longitude
                      ? `${Math.abs(item.latitude).toFixed(4)}° ${
                          item.latitude >= 0 ? "N" : "S"
                        }, ${Math.abs(item.longitude).toFixed(4)}° ${
                          item.longitude >= 0 ? "E" : "W"
                        }`
                      : "Coordinates not available")}
                </Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
      />
      {/* Back button to navigate to the main menu */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to menu</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    width: 70,
    marginVertical: 5,
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

// Importing React and required libraries
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { getAuth } from "firebase/auth";

// Initializing the component with state for history data and user ID
export default function HistoryPage({ navigation }) {
  const [historyData, setHistoryData] = useState([]);
  const [userID, setUserID] = useState(null);

  // Listen to authentication state and update userID
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User logged in:", user.uid);
        setUserID(user.uid);
      } else {
        console.log("User not logged in.");
        setUserID(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user's history data and listen for real-time updates
  useEffect(() => {
    if (userID) {
      const db = getDatabase();
      const historyRef = ref(db, `users/${userID}/history`);

      const unsubscribe = onValue(historyRef, (snapshot) => {
        const data = snapshot.val() || {};
        console.log("Fetched data from database:", data);

        const formattedData = Object.keys(data)
          .filter((key) => !data[key].isDeleted) // Exclude deleted items
          .map((key) => ({
            id: key,
            ...data[key],
          }));

        console.log("Formatted data for FlatList:", formattedData);
        setHistoryData(formattedData);
      });

      return () => unsubscribe();
    }
  }, [userID]);

  // Delete a history entry by ID
  const handleDelete = async (id) => {
    try {
      const db = getDatabase();
      const itemRef = ref(db, `users/${userID}/history/${id}`);
      console.log("Deleting item with ID:", id);

      await update(itemRef, { isDeleted: true }); // Mark as deleted
      console.log("Item deleted successfully.");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // Swipeable action for deletion
  const renderRightActions = (id) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(id)}>
      <Ionicons name="trash-outline" size={30} color="white" />
    </TouchableOpacity>
  );

  if (!userID) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recent History</Text>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <TouchableOpacity
              onPress={() => navigation.navigate("HomePage", { selectedLocation: item })}
            >
              <View style={styles.historyItem}>
                <Ionicons name="time-outline" size={24} color="black" style={styles.icon} />
                <Text style={styles.itemText}>
                  {item.name ||
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

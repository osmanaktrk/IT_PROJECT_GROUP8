// Importing React and required libraries
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, getDocs, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { firestoreDB } from '../FirebaseConfig'; 
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
        setUserID(user.uid); 
      } else {
        setUserID(null); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  // Copy user's spots to history to avoid duplicates
  useEffect(() => {
    const copySpotsToHistory = async () => {
      if (!userID) return; //

      try {
         // Fetch spots visited by the user
        const spotsRef = collection(firestoreDB, "spots");
        const q = query(spotsRef, where("userID", "==", userID));
        const spotsSnapshot = await getDocs(q);

        // Fetch existing entries in the history collection
        const historyRef = collection(firestoreDB, "history");
        const historySnapshot = await getDocs(query(historyRef, where("userID", "==", userID)));
        const existingSpotIDs = historySnapshot.docs.map((doc) => doc.data().spotID); // Collect IDs of already stored spots

        // Add new spots to the history collection if not already present
        for (const spotDoc of spotsSnapshot.docs) {
          const spotData = spotDoc.data();
          if (!existingSpotIDs.includes(spotDoc.id)) { // 
            await addDoc(historyRef, {
              spotID: spotDoc.id,
              ...spotData,
              userID: userID, // 
            });
          }
        }
      } catch (error) {
        console.error("Error copying data: ", error); 
      }
    };

    copySpotsToHistory(); 
  }, [userID]); 

  // Fetch user's history data and listen for real-time updates
  useEffect(() => {
    if (userID) {
      const historyRef = collection(firestoreDB, "history");
      const q = query(historyRef, where("userID", "==", userID));

    
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistoryData(data); 
      });

      return () => unsubscribe(); 
    }
  }, [userID]); 

  // Delete a history entry by ID
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestoreDB, "history", id)); 
    } catch (error) {
      console.error("Error deleting document: ", error); 
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
            <View style={styles.historyItem}>
              <Ionicons name="time-outline" size={24} color="black" style={styles.icon} />
              <Text style={styles.itemText}>
                {item.name || `${Math.abs(item.coords.latitude).toFixed(4)}° ${item.coords.latitude >= 0 ? "N" : "S"}, ${Math.abs(item.coords.longitude).toFixed(4)}° ${item.coords.longitude >= 0 ? "E" : "W"}`}
              </Text>
            </View>
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
   // style
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
  



import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default function HistoryPage({ navigation }) {
  // History list (here is experimental data only)
  const [historyData, setHistoryData] = useState([
    { id: "1", name: "Quai de l'Industrie 170,1070" },
    { id: "2", name: "Quai de l'Industrie 170,1070" },
    { id: "3", name: "Quai de l'Industrie 170,1070" },
  ]);
  // Delete an item from the list
  const handleDelete = (id) => {
    setHistoryData((prevData) => prevData.filter((item) => item.id !== id));
  };

  // (Swipe)
  const renderRightActions = (id) => {
    return (
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(id)}>
        <Ionicons name="trash-outline" size={30} color="white" />
      </TouchableOpacity>
    );
  };


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
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          </Swipeable>
          )}
          />
        {/* Terugknop */}
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => navigation.goBack()}
                    >
                      <Text style={styles.backButtonText}>Back to menu</Text>
                    </TouchableOpacity>
    </View>
  );
}
   
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
  


import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

export default function HistoryPage({ navigation }) {
  // History list (here is experimental data only)
  const historyData = [
    { id: "1", name: "Quai de l'Industrie 170,1070" },
    { id: "2", name: "Quai de l'Industrie 170,1070" },
    { id: "3", name: "Quai de l'Industrie 170,1070" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recent History</Text>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.historyItem}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
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
  });
  


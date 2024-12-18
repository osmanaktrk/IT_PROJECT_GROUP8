import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function PointsInfo({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.header}>How to Earn Points</Text>

      {/* Beschrijving van manieren om punten te verdienen */}
      <View style={styles.infoSection}>
        <Text style={styles.pointHeader}>1. Marking a Parking Spot as Taken</Text>
        <Text style={styles.pointDescription}>
          - Earn 1 point by confirming that you have occupied a parking spot.{"\n"}
          - Make sure the location is accurate to help others.
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.pointHeader}>2. Marking a Parking Spot as Vacant</Text>
        <Text style={styles.pointDescription}>
          - Earn 1 point by indicating that you have vacated a parking spot.{"\n"}
          - This helps other users find available parking more easily.
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.pointHeader}>3. Reporting Incorrect Information</Text>
        <Text style={styles.pointDescription}>
          - Earn 3 points for reporting incorrect parking spot information.{"\n"}
          - Reports will be verified before awarding points.
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.pointHeader}>4. !!  Referring a Friend (OPTIONEEL)  !!</Text>
        <Text style={styles.pointDescription}>
          - Earn 5 points for each friend you refer who signs up and uses the app.{"\n"}
          - Share your unique referral code to get started.
        </Text>
      </View>

      {/* Terugknop */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  infoSection: {
    marginBottom: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  pointHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  pointDescription: {
    fontSize: 14,
    color: "#777",
    lineHeight: 20,
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

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function TermsConditions({ navigation }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.header}>TERMS & CONDITIONS</Text>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.text}>
              By using our parking app, you agree to the following terms:
            </Text>
            <Text style={styles.text}>
              1. <Text style={styles.bold}>Usage:</Text> The app is provided for
              booking parking spaces only. You are responsible for ensuring the
              accuracy of the information entered when making reservations.
            </Text>
            <Text style={styles.text}>
              2. <Text style={styles.bold}>Payment:</Text> Payments for parking
              are due at the time of booking and are non-refundable, except as
              outlined in our refund policy.
            </Text>
            <Text style={styles.text}>
              3. <Text style={styles.bold}>Liability:</Text> We are not liable
              for any damage, loss, or theft that occurs to your vehicle while
              parked in any space reserved through our app.
            </Text>
            <Text style={styles.text}>
              4. <Text style={styles.bold}>User Conduct:</Text> You agree to use
              the app in a lawful manner and not to misuse or interfere with the
              app's operations.
            </Text>
            <Text style={styles.text}>
              5. <Text style={styles.bold}>Modifications:</Text> We reserve the
              right to modify or discontinue the app's features at any time
              without notice.
            </Text>
          </ScrollView>
          {/* Back to Menu Button */}
          {/* Terugknop */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back to menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  contentContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
  },
  bold: {
    fontWeight: "bold",
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

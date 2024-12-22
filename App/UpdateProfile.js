import React from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";

export default function UpdateProfile({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/background.png")} // Update the path to your background image
      style={styles.background}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.inputField}
          placeholder="Change Username"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.inputField}
          placeholder="New Password"
          placeholderTextColor="#aaa"
          secureTextEntry={true}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.goBack()} // Navigate back to the previous screen
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log("Delete Account")}
          style={styles.deleteAccount}
        >
          <Text style={styles.deleteAccountText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // Ensure the background image covers the entire screen
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
  },
  inputField: {
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly transparent white background
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#333", // Button background color
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff", // Button text color
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteAccount: {
    marginTop: 20,
    alignItems: "center",
  },
  deleteAccountText: {
    color: "#fff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

import React from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
export default function UpdateProfile({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/background.png")} // Update the path to your background image
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Update Profile</Text>

        {/* Username Input */}
        <View style={styles.inputContainer}>
          <FontAwesome
            name="user"
            size={hp(3)}
            color="#B0BEC5"
            style={styles.icon}
          />
          <TextInput
            placeholder="Change Username"
            placeholderTextColor="#B0BEC5"
            style={styles.input}
          />
        </View>

        {/* New Password Input */}

        <View style={styles.inputContainer}>
          <FontAwesome
            name="lock"
            size={hp(3)}
            color="#B0BEC5"
            style={styles.icon}
          />
          <TextInput
            placeholder="New Password"
            placeholderTextColor="#B0BEC5"
            style={styles.input}
            secureTextEntry={true}
          />
        </View>
        {/* Confirm Password Input */}

        <View style={styles.inputContainer}>
          <FontAwesome
            name="lock"
            size={hp(3)}
            color="#B0BEC5"
            style={styles.icon}
          />

          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#B0BEC5"
            style={styles.input}
            secureTextEntry={true}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.goBack()} // Navigate back to the previous screen
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        {/* Delete Account */}

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
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp(5),
  },
  title: {
    fontSize: hp(4),
    fontWeight: "bold",
    color: "#B2DDF9",
    marginBottom: hp(2),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: wp(7),
    paddingHorizontal: wp(4),
    marginVertical: hp(1.5),
    width: "90%",
    height: hp(7),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: hp(2),
    color: "#000",
    marginLeft: wp(3),
  },
  icon: {
    marginRight: wp(2),
  },

  icon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#424242",
    paddingVertical: hp(2),
    borderRadius: wp(7),
    width: "90%",
    alignItems: "center",
    marginTop: 20,
    borderColor: "#B2DDF9",
    borderWidth: 1,
  },
  saveButtonText: {
    color: "#B2DDF9", // Button text color
    fontSize: hp(2.5),
    fontWeight: "bold",
  },
  deleteAccount: {
    marginTop: hp(2),
    alignItems: "center",
  },
  deleteAccountText: {
    color: "#B2DDF9",
    fontSize: hp(2),
    textDecorationLine: "underline",
  },
});

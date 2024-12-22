import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  getAuth,
  deleteUser,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

export default function UpdateProfile({ navigation }) {
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState(""); // Added state for the new username
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirming new password
  const [currentPassword, setCurrentPassword] = useState(""); // State for current password
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle visibility for new password
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Toggle visibility for confirm password
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false); // Toggle visibility for current password

  // Fetch the currently logged-in user's displayName
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const displayName = currentUser.displayName || "User"; // Declare `displayName`
      // Capitalize the first letter of the username
      setUsername(displayName.charAt(0).toUpperCase() + displayName.slice(1));
    }
  }, []);

  // Handle username and password change
  const handleSave = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentPassword.trim()) {
      Alert.alert("Error", "Please enter your current password.");
      return;
    }

    if (!newUsername.trim() && !newPassword.trim()) {
      Alert.alert("Error", "Please enter a new username, password, or both.");
      return;
    }

    try {
      // NEW: Reauthenticate the user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update username if provided
      if (newUsername.trim()) {
        await updateProfile(currentUser, { displayName: newUsername });
        setUsername(newUsername.charAt(0).toUpperCase() + newUsername.slice(1));
      }

      // Update password if provided
      if (newPassword.trim()) {
        if (newPassword.length < 6) {
          Alert.alert("Error", "Password must be at least 6 characters long.");
          return;
        }

        if (newPassword !== confirmPassword) {
          Alert.alert("Error", "Passwords do not match.");
          return;
        }
        await updatePassword(currentUser, newPassword);
      }

      Alert.alert("Success", "Your profile has been successfully updated!");
    } catch (error) {
      // NEW: Handle errors specifically
      if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Incorrect current password.");
      } else if (error.code === "auth/invalid-credential") {
        Alert.alert(
          "Invalid Credential",
          "The provided current password is incorrect. Please try again."
        );
      } else if (error.code === "auth/requires-recent-login") {
        Alert.alert(
          "Reauthentication Required",
          "Please log in again to perform this action."
        );
        navigation.replace("LoginScreen");
      } else {
        console.error("Error updating profile:", error);
        Alert.alert(
          "Error",
          "There was an issue updating your profile. Please try again."
        );
      }
    }
  };

  // Handle Delete Account

  const handleDeleteAccount = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const auth = getAuth();
              const currentUser = auth.currentUser;

              if (!currentPassword.trim()) {
                Alert.alert(
                  "Error",
                  "Please enter your current password to delete your account."
                ); // Ensure current password is entered
                return;
              }
              //Reauthenticate the user before deletion
              const credential = EmailAuthProvider.credential(
                currentUser.email,
                currentPassword
              );
              await reauthenticateWithCredential(currentUser, credential);

              await deleteUser(currentUser);
              Alert.alert("Account Deleted", "Your account has been deleted.");
              navigation.replace("LoginSignupChoiceScreen");
            } catch (error) {
              if (error.code === "auth/requires-recent-login") {
                Alert.alert(
                  "Reauthentication Required",
                  "Please log in again to perform this action."
                );
                navigation.replace("LoginScreen");
              } else {
                console.error("Error deleting account:", error);
                Alert.alert(
                  "Error",
                  "There was an issue deleting your account. Please try again."
                );
              }
            }
          },
        },
      ]
    );
  };
  return (
    <ImageBackground
      source={require("../assets/background.png")} // Update the path to your background image
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Update Profile</Text>
        <Text style={styles.welcomeText}>
          Hello {username}, you can change your username and password here.
        </Text>

        {/* Username Input */}
        <View style={styles.inputContainer}>
          <FontAwesome
            name="user"
            size={hp(3)}
            color="#B0BEC5"
            style={styles.icon}
          />
          <TextInput
            placeholder="New Username"
            placeholderTextColor="#B0BEC5"
            style={styles.input}
            value={newUsername} // Bind state
            onChangeText={setNewUsername} // Update state
          />
        </View>

        {/* Current Password Input */}
        <View style={styles.inputContainer}>
          <FontAwesome
            name="lock"
            size={hp(3)}
            color="#B0BEC5"
            style={styles.icon}
          />
          <TextInput
            placeholder="Current Password"
            placeholderTextColor="#B0BEC5"
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!currentPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setCurrentPasswordVisible(!currentPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={currentPasswordVisible ? "eye-off" : "eye"}
              size={hp(3)}
              color="#B0BEC5"
            />
          </TouchableOpacity>
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
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={hp(3)}
              color="#B0BEC5"
            />
          </TouchableOpacity>
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
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={confirmPasswordVisible ? "eye-off" : "eye"}
              size={hp(3)}
              color="#B0BEC5"
            />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        {/* Delete Account */}

        <TouchableOpacity
          onPress={handleDeleteAccount} // Call the delete account function
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
  welcomeText: {
    fontSize: hp(2.3), // Slightly smaller than the title
    color: "#B2DDF9", // Same color as the title
    textAlign: "center",
    marginBottom: hp(3),
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

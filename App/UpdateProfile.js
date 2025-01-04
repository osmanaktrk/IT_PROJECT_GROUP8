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
import { firebaseAuth, firebaseRealDB } from "../FirebaseConfig";
import { getDatabase, ref, set, update, remove, get } from "firebase/database";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UpdateProfile({ navigation }) {
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState(""); // State for the new username
  const [newPassword, setNewPassword] = useState(""); // State for the new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirming the new password
  const [currentPassword, setCurrentPassword] = useState(""); // State for the current password
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle visibility for new password
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Toggle visibility for confirm password
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false); // Toggle visibility for current password

  const currentUser = firebaseAuth.currentUser;

  const checkInternetConnection = async () => {
    const state = await NetInfo.fetch();
    return state.isConnected;
  };

  // Fetch the currently logged-in user's displayName
  useEffect(() => {
    if (currentUser) {
      const displayName = currentUser.displayName || "User"; // Default displayName
      // Capitalize the first letter of the username
      setUsername(displayName.charAt(0).toUpperCase() + displayName.slice(1));
    }
  }, []);

  // Handle Save Username
  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert("Error", "Please enter a new username.");
      return;
    }

    try {
      const isOnline = await checkInternetConnection();

      if (!isOnline) {
        Alert.alert(
          "No Internet Connection",
          "Changes will sync once the internet connection is restored."
        );
      }

      const usernameRef = ref(
        firebaseRealDB,
        `users/${currentUser.uid}/username`
      );
      await updateProfile(currentUser, { displayName: newUsername });
      await set(usernameRef, newUsername);

      setUsername(newUsername.charAt(0).toUpperCase() + newUsername.slice(1));
      setNewUsername("");
      Alert.alert("Success", "Your username has been updated!");
    } catch (error) {
      console.error("Error updating username:", error);
      Alert.alert("Error", "Could not update username. Please try again.");
    }
  };

  // Handle Save Password
  const handleSavePassword = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentPassword.trim()) {
      Alert.alert("Error", "Please enter your current password.");
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    // Password Validation
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    };

    if (!/[A-Z]/.test(newPassword)) {
      Alert.alert(
        "Error",
        "Password must contain at least one uppercase letter."
      );
      return;
    };

    if (!/[a-z]/.test(newPassword)) {
      Alert.alert(
        "Error",
        "Password must contain at least one lowercase letter."
      );
      return;
    };

    if (!/[0-9]/.test(newPassword)) {
      Alert.alert("Error", "Password must contain at least one number.");
      return;
    };

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      Alert.alert(
        "Error",
        "Password must contain at least one special character."
      );
      return;
    };

    try {
      const isOnline = await checkInternetConnection();

      if (!isOnline) {
        Alert.alert(
          "No Internet Connection",
          "Changes will sync once the internet connection is restored."
        );
      }

      await updatePassword(currentUser, newPassword);
      Alert.alert("Success", "Your password has been updated!");
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "Could not update password. Please try again.");
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {

    const isOnline = await checkInternetConnection();

      if (!isOnline) {
        Alert.alert(
          "No Internet Connection",
          "Please check the internet connection."
        );
        return;
      };

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
              
              if (!currentPassword.trim()) {
                Alert.alert(
                  "Error",
                  "Please enter your current password to delete your account."
                );
                return;
              };
              const userRef = ref(
                firebaseRealDB,
                `users/${currentUser.uid}`
              );
              const credential = EmailAuthProvider.credential(
                currentUser.email,
                currentPassword
              );

              await reauthenticateWithCredential(currentUser, credential);

              await deleteUser(currentUser);
              await remove(userRef);
              await AsyncStorage.clear();

              Alert.alert("Account Deleted", "Your account has been deleted.");
              navigation.replace("FrontPage");
            } catch (error) {
              console.error("Error deleting account:", error);
              if (error.code === "auth/wrong-password") {
                Alert.alert("Error", "The current password you entered is incorrect.");
              } else {
                Alert.alert("Error", "There was an issue deleting your account. Please try again.");
              };
              
            };
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
          <FontAwesome name="user" size={hp(3)} color="#B0BEC5" />
          <TextInput
            // placeholder="New Username"
            placeholder={`${
              currentUser?.displayName || "User"
            }, enter your new username`}
            placeholderTextColor="#B0BEC5"
            style={styles.input}
            value={newUsername}
            onChangeText={setNewUsername}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveUsername}
        >
          <Text style={styles.saveButtonText}>Save Username</Text>
        </TouchableOpacity>

        {/* Current Password Input */}
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={hp(3)} color="#B0BEC5" />
          <TextInput
            placeholder="Current Password"
            placeholderTextColor="#B0BEC5"
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!currentPasswordVisible}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setCurrentPasswordVisible(!currentPasswordVisible)}
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
          <FontAwesome name="lock" size={hp(3)} color="#B0BEC5" />
          <TextInput
            placeholder="New Password"
            placeholderTextColor="#B0BEC5"
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
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
          <FontAwesome name="lock" size={hp(3)} color="#B0BEC5" />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#B0BEC5"
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            <Ionicons
              name={confirmPasswordVisible ? "eye-off" : "eye"}
              size={hp(3)}
              color="#B0BEC5"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSavePassword}
        >
          <Text style={styles.saveButtonText}>Save Password</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          onPress={handleDeleteAccount}
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
    fontSize: hp(2.3),
    color: "#B2DDF9",
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
    height: hp(6),
  },
  input: {
    flex: 1,
    fontSize: hp(2),
    color: "#000",
    marginLeft: wp(3),
  },
  saveButton: {
    backgroundColor: "#424242",
    paddingVertical: hp(1.5),
    borderRadius: wp(7),
    width: "90%",
    alignItems: "center",
    marginVertical: 10,
    borderColor: "#B2DDF9",
    borderWidth: 1,
  },
  saveButtonText: {
    color: "#B2DDF9",
    fontSize: hp(2.5),
    fontWeight: "bold",
  },
  deleteAccount: {
    backgroundColor: "red",
    paddingVertical: hp(1.5),
    borderRadius: wp(7),
    width: "90%",
    alignItems: "center",
    marginVertical: 10,
    borderColor: "#B2DDF9",
    borderWidth: 1,
  },
  deleteAccountText: {
    color: "#B2DDF9",
    fontSize: hp(2.5),
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});

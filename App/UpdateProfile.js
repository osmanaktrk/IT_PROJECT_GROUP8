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
import { FontAwesome } from "@expo/vector-icons";
import { getAuth, deleteUser,updateProfile,updatePassword } from "firebase/auth";




export default function UpdateProfile({ navigation }) {
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState(""); // Added state for the new username
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirming new password


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

  // Handle username  and password change
  const handleSave = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!newUsername.trim() && !newPassword.trim()) {
      Alert.alert("Error", "Please enter a new username, password, or both.");
      return;
    }
    try {
      // Update username if provided
      if (newUsername.trim()) {
        await updateProfile(currentUser, { displayName: newUsername });
        setUsername(newUsername.charAt(0).toUpperCase() + newUsername.slice(1));
      }

      // Update password if provided
      if (newPassword.trim() || confirmPassword.trim()) {
        if (newPassword !== confirmPassword) {
          Alert.alert("Error", "Passwords do not match.");
          return;
        }
        await updatePassword(currentUser, newPassword);
      }

      Alert.alert("Success", "Your profile has been successfully updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error",
        "There was an issue updating your profile. Please try again."
      );
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

              if (currentUser) {
                await deleteUser(currentUser);
                Alert.alert(
                  "Account Deleted",
                  "Your account has been deleted."
                );
                navigation.replace("LoginSignupChoiceScreen");
              }
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert(
                "Error",
                "There was an issue deleting your account. Please try again."
              );
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
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />
        </View>

       {/* Save Button */}
       <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
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

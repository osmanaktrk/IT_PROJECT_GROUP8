import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { firebaseAuth } from "../../FirebaseConfig";
import {
  deleteUser,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TestProfilePage({ navigation }) {
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteUserPassword, setDeleteUserPassword] = useState("");

  const currentUser = firebaseAuth.currentUser;

  // Kullanıcı adını güncelle
  const handleUpdateUsername = async () => {
    try {
      await updateProfile(currentUser, {
        displayName: updatedUsername,
      });
      setUpdatedUsername("");
      Alert.alert("Success", "Username updated successfully!");
    } catch (error) {
      Alert.alert("Error", `Failed to update username: ${error.message}`);
    }
  };

  // Şifreyi güncelle
  const handleUpdatePassword = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);

      // AsyncStorage'de şifreyi güncelle
      await AsyncStorage.setItem("userPassword", newPassword);
      setCurrentPassword("");
      setNewPassword("")

      Alert.alert("Success", "Password updated successfully!");
    } catch (error) {
      Alert.alert("Error", `Failed to update password: ${error.message}`);
    }
  };

  // Profil resmini güncelle
  const handleUpdateProfileImage = async () => {
    try {
      await updateProfile(currentUser, {
        photoURL: profileImage,
      });
      Alert.alert("Success", "Profile image updated successfully!");
    } catch (error) {
      Alert.alert("Error", `Failed to update profile image: ${error.message}`);
    }
  };

  // Kullanıcıyı yeniden kimlik doğrula
  const reauthenticateUser = async (password) => {
    if (!password) {
      Alert.alert(
        "Error",
        "Current password is required for sensitive actions."
      );
      return false;
    }
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      await reauthenticateWithCredential(currentUser, credential);
      return true;
    } catch (error) {
      Alert.alert("Reauthentication Failed", error.message);
      return false;
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteUserPassword) {
      Alert.alert(
        "Error",
        "Current password is required for sensitive actions."
      );
      return false;
    }

    setIsLoading(true);

    // Reauthenticate the user

    try {
      const confirmed = await reauthenticateUser(deleteUserPassword);
      if (!confirmed) {
        setIsLoading(false);
        return;
      }

      // Delete user
      await deleteUser(currentUser);

      // Clear local storage
      await AsyncStorage.clear();

      Alert.alert(
        "Account Deleted",
        "Your account has been successfully deleted."
      );
      navigation.replace("FrontPage");
    } catch (error) {
      Alert.alert("Error", `Failed to delete account: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Input for entering the current password
  <TextInput
    style={styles.input}
    placeholder="Enter your current password"
    secureTextEntry
    value={deleteUserPassword}
    onChangeText={setDeleteUserPassword}
  />;

  return (
    <View style={styles.container}>
      {/* Kullanıcı Adını Güncelle */}
      <TextInput
        style={styles.input}
        placeholder={`Welcome: ${
          currentUser?.displayName || "User"
        }, enter your new username`}
        value={updatedUsername}
        onChangeText={setUpdatedUsername}
      />
      <Button title="Update Username" onPress={handleUpdateUsername} />

      {/* Şifreyi Güncelle */}
      <TextInput
        style={styles.input}
        placeholder="Enter current password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="Update Password" onPress={handleUpdatePassword} />

      {/* Profil Resmini Güncelle */}
      <View style={styles.imageContainer}>
        {profileImage && (
          <Image source={{ uri: profileImage }} style={styles.image} />
        )}
        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => setProfileImage("")}
        >
          <Text style={styles.imageButtonText}>Change Profile Image</Text>
        </TouchableOpacity>
      </View>
      <Button title="Update Profile Image" onPress={handleUpdateProfileImage} />

      {/* Delete Account Button */}
      <TextInput
        style={styles.input}
        placeholder="Enter current password"
        secureTextEntry
        value={deleteUserPassword}
        onChangeText={setDeleteUserPassword}
      />

      <Pressable
        style={[styles.button, styles.deleteButton]}
        onPress={handleDeleteAccount}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Delete Account</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
  },
  imageButtonText: {
    color: "#333",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: "#ff4d4f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

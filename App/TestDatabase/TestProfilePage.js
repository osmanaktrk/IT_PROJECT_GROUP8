// import React, { useState } from "react";
// import {
//   StyleSheet,
//   View,
//   TextInput,
//   Button,
//   Alert,
//   Image,
//   Text,
//   TouchableOpacity,
//   Pressable,
//   ActivityIndicator,
// } from "react-native";
// import { firebaseAuth, firestoreDB } from "../../FirebaseConfig";
// import {
//   deleteUser,
//   reauthenticateWithRedirect,
//   updateProfile,
//   updatePassword,
//   reauthenticateWithCredential,
//   EmailAuthProvider,
// } from "firebase/auth";
// import { doc, updateDoc } from "firebase/firestore";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useEffect } from "react";

// export default function TestProfilePage({ navigation }) {
//   const [updatedUsername, setUpdatedUsername] = useState("");
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [profileImage, setProfileImage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const currentUser = firebaseAuth.currentUser;

//   // Kullanıcı adını güncelle
//   const handleUpdateUsername = async () => {
//     try {
//       await updateProfile(currentUser, {
//         displayName: updatedUsername,
//       });

//       //const userDocRef = doc(firestoreDB, "users", currentUser.uid);
//       //await updateDoc(userDocRef, { displayName: updatedUsername });

//       Alert.alert("Success", "Username updated successfully!");
//     } catch (error) {
//       Alert.alert("Error", `Failed to update username: ${error.message}`);
//     }
//   };

//   // Şifreyi güncelle
//   const handleUpdatePassword = async () => {
//     try {
//       const credential = EmailAuthProvider.credential(
//         currentUser.email,
//         currentPassword
//       );
//       await reauthenticateWithCredential(currentUser, credential);

//       await updatePassword(currentUser, newPassword);
//       // Check if the user is already logged in when the app starts

//       const savedEmail = await AsyncStorage.getItem("userEmail");
//       const savedPassword = await AsyncStorage.getItem("userPassword");
//       const keepLoggedIn = await AsyncStorage.getItem("keepLoggedIn");

//       if (keepLoggedIn === "true" && savedEmail && savedPassword) {
//         try {
//           await AsyncStorage.setItem("userEmail", currentUser.email);
//           await AsyncStorage.setItem("userPassword", newPassword);
//           await AsyncStorage.setItem("keepLoggedIn", "true");
//         } catch (error) {
//           Alert.alert("Auto-login failed", "Please log in again.");

//           //console.error("Auto-login failed:", error.message);
//         }
//       }

//       Alert.alert("Success", "Password updated successfully!");
//     } catch (error) {
//       Alert.alert("Error", `Failed to update password: ${error.message}`);
//     }
//   };

//   // Profil resmini güncelle (localde resim upload edilir gibi simüle ediliyor)
//   const handleUpdateProfileImage = async () => {
//     try {
//       await updateProfile(currentUser, {
//         photoURL: profileImage,
//       });

//       const userDocRef = doc(firestoreDB, "users", currentUser.uid);
//       await updateDoc(userDocRef, { photoURL: profileImage });

//       Alert.alert("Success", "Profile image updated successfully!");
//     } catch (error) {
//       Alert.alert("Error", `Failed to update profile image: ${error.message}`);
//     }
//   };

//   // Reauthenticate the user
//   const reauthenticateUser = async () => {
//     if (!currentPassword) {
//       Alert.alert("Error", "Password is required for sensitive actions.");
//       return false;
//     }
//     try {
//       const credential = EmailAuthProvider.credential(
//         currentUser.email,
//         currentPassword
//       );
//       await reauthenticateWithCredential(currentUser, credential);
//       return true;
//     } catch (error) {
//       Alert.alert("Reauthentication Failed", error.message);
//       return false;
//     }
//   };

//   // Delete user account
//   const handleDeleteAccount = async () => {
//     setIsLoading(true);

//     try {
//       const confirmed = await reauthenticateUser();
//       if (!confirmed) {
//         setIsLoading(false);
//         return;
//       }

//       // Delete Firestore user document
//       //await deleteDoc(doc(firestoreDB, "users", currentUser.uid));

//       // Delete Firebase Auth user

//       await deleteUser(currentUser);

//       await AsyncStorage.clear();

//       await firebaseAuth.signOut();

//       Alert.alert(
//         "Account Deleted",
//         "Your account has been successfully deleted."
//       );
//       navigation.replace("FrontPage");
//     } catch (error) {
//       Alert.alert("Error", `Failed to delete account: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Kullanıcı Adını Güncelle */}
//       <TextInput
//         style={styles.input}
//         placeholder={`Welcome: ${currentUser.displayName}, Enter your new username`}
//         value={updatedUsername}
//         onChangeText={setUpdatedUsername}
//       />
//       <Button title="Update Username" onPress={handleUpdateUsername} />

//       {/* Şifreyi Güncelle */}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter current password"
//         secureTextEntry
//         value={currentPassword}
//         onChangeText={setCurrentPassword}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Enter new password"
//         secureTextEntry
//         value={newPassword}
//         onChangeText={setNewPassword}
//       />
//       <Button title="Update Password" onPress={handleUpdatePassword} />

//       {/* Profil Resmini Güncelle */}
//       <View style={styles.imageContainer}>
//         {profileImage && (
//           <Image source={{ uri: profileImage }} style={styles.image} />
//         )}
//         <TouchableOpacity
//           style={styles.imageButton}
//           onPress={() => setProfileImage("")}
//         >
//           <Text style={styles.imageButtonText}>Change Profile Image</Text>
//         </TouchableOpacity>
//       </View>
//       <Button title="Update Profile Image" onPress={handleUpdateProfileImage} />

//       {/* Delete Account Button */}
//       <Pressable
//         style={[styles.button, styles.deleteButton]}
//         onPress={handleDeleteAccount}
//       >
//         {isLoading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Delete Account</Text>
//         )}
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 10,
//   },
//   imageContainer: {
//     alignItems: "center",
//     marginVertical: 20,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   imageButton: {
//     backgroundColor: "#f5f5f5",
//     padding: 10,
//     borderRadius: 5,
//   },
//   imageButtonText: {
//     color: "#333",
//   },
//   button: {
//     backgroundColor: "#007bff",
//     paddingVertical: 15,
//     borderRadius: 5,
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   deleteButton: {
//     backgroundColor: "#ff4d4f",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

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
  const [deleteUserPassword, setDeleteUserPassword] = useState("")

  const currentUser = firebaseAuth.currentUser;

  // Kullanıcı adını güncelle
  const handleUpdateUsername = async () => {
    try {
      await updateProfile(currentUser, {
        displayName: updatedUsername,
      });
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
  const reauthenticateUser = async () => {
    if (!currentPassword) {
      Alert.alert(
        "Error",
        "Current password is required for sensitive actions."
      );
      return false;
    }
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      return true;
    } catch (error) {
      Alert.alert("Reauthentication Failed", error.message);
      return false;
    }
  };

  // Kullanıcıyı sil
  // const handleDeleteAccount = async () => {
  //   setIsLoading(true);

  //   const reauthenticateUser = async () => {
  //     if (!delteUserPassword) {
  //       Alert.alert(
  //         "Error",
  //         "Current password is required for sensitive actions."
  //       );
  //       return false;
  //     }
  //     try {
  //       const credential = EmailAuthProvider.credential(
  //         currentUser.email,
  //         delteUserPassword
  //       );
  //       await reauthenticateWithCredential(currentUser, credential);
  //       return true;
  //     } catch (error) {
  //       Alert.alert("Reauthentication Failed", error.message);
  //       return false;
  //     }
  //   };

  //   try {
  //     const confirmed = await reauthenticateUser();
  //     if (!confirmed) {
  //       setIsLoading(false);
  //       return;
  //     }

  //     await deleteUser(currentUser);
  //     await AsyncStorage.clear();
  //     Alert.alert(
  //       "Account Deleted",
  //       "Your account has been successfully deleted."
  //     );
  //     navigation.replace("FrontPage");
  //   } catch (error) {
  //     Alert.alert("Error", `Failed to delete account: ${error.message}`);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
  
    // Reauthenticate the user
    const reauthenticateUser = async () => {
      if (!deleteUserPassword) {
        Alert.alert(
          "Error",
          "Current password is required for sensitive actions."
        );
        return false;
      }
      try {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          deleteUserPassword
        );
        await reauthenticateWithCredential(currentUser, credential);
        return true;
      } catch (error) {
        Alert.alert("Reauthentication Failed", error.message);
        return false;
      }
    };
  
    try {





      const confirmed = await reauthenticateUser();
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

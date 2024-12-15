import React, { useState, useEffect, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  TextInput,
  Switch,
  Alert,
  Modal,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseAuth } from "../FirebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  // State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Check if the user is already logged in when the app starts
  useEffect(() => {
    const checkUserStatus = async () => {
      const savedEmail = await AsyncStorage.getItem("userEmail");
      const savedPassword = await AsyncStorage.getItem("userPassword");
      const keepLoggedIn = await AsyncStorage.getItem("keepLoggedIn");

      if (keepLoggedIn === "true" && savedEmail && savedPassword) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            firebaseAuth,
            savedEmail,
            savedPassword
          );
          const user = userCredential.user;
          Alert.alert(
            "Welcome Back",
            `You are logged in as ${user.displayName}`
          );
          navigation.replace("HomePage");
        } catch (error) {
          console.error("Auto-login failed:", error.message);
        }
      }
      setIsLoading(false);
    };

    checkUserStatus();
  }, [navigation]);

  // Login handler
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      const user = userCredential.user;

      // Check if the user's email is verified
      if (!user.emailVerified) {
        // Email not verified
        Alert.alert(
          "Email Verification Required",
          `Welcome. Your account has been created. Please verify your email before logging in.`
        );

        // Redirect user to the email verification screen

        navigation.replace("VerifyEmailScreen");

        // Sign out the user to prevent access
        setTimeout(async () => {
          await signOut(firebaseAuth);
        }, 500);
        return;
      } else {
        if (rememberMe) {
          // Save login credentials to AsyncStorage
          await AsyncStorage.setItem("userEmail", email);
          await AsyncStorage.setItem("userPassword", password);
          await AsyncStorage.setItem("keepLoggedIn", "true");
        } else {
          // Clear login credentials if "Keep me logged in" is not selected
          await AsyncStorage.removeItem("userEmail");
          await AsyncStorage.removeItem("userPassword");
          await AsyncStorage.setItem("keepLoggedIn", "false");
        }

        Alert.alert("Login Successful", `Welcome back ${user.displayName}!`);

        navigation.replace("HomePage");
      }
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          // Incorrect password entered by the user
          setModalMessage("Incorrect password. Please try again.");
          setModalVisible(true);
          break;

        case "auth/email-already-in-use":
          // Email is already associated with another account
          setModalMessage(
            "This email is already in use. Please use a different email or log in."
          );
          setModalVisible(true);
          break;
        case "auth/user-not-found":
          // User not found in the database
          setModalMessage("Email not found. Please sign up.");
          setModalVisible(true);
          break;

        case "auth/missing-password":
          // Password is missing in the request
          setModalMessage("Password is required. Please provide a password.");
          setModalVisible(true);
          break;

       

        case "auth/invalid-email":
          // Invalid email format entered
          setModalMessage(
            "Invalid email format. Please check your email address."
          );
          setModalVisible(true);
          break;
        case "auth/too-many-requests":
          // Too many login attempts; user is temporarily blocked
          setModalMessage(
            "Too many unsuccessful login attempts. Please try again later."
          );
          setModalVisible(true);
          break;

        case "auth/network-request-failed":
          // Network connectivity issue during the request
          setModalMessage(
            "Network error. Please check your internet connection and try again."
          );
          setModalVisible(true);
          break;

        case "auth/invalid-credential":
          // Invalid authentication credentials
          setModalMessage(
            "Invalid credentials. Please check your email and password."
          );
          setModalVisible(true);
          break;

        case "auth/user-disabled":
          // The user's account has been disabled
          setModalMessage(
            "Your account has been disabled. Please contact support for assistance."
          );
          setModalVisible(true);
          break;

        case "auth/internal-error":
          // An unexpected internal error occurred
          setModalMessage(
            "An internal error occurred. Please try again later or contact support."
          );
          setModalVisible(true);
          break;

        case "auth/requires-recent-login":
          // User needs to log in again to perform the action
          setModalMessage(
            "Your session has expired. Please log in again to continue."
          );
          setModalVisible(true);
          break;

        default:
          if (!user.emailVerified) {
            // Email not verified
            Alert.alert(
              "Email Verification Required",
              "Please verify your email before logging in."
            );

            // Sign out the user to prevent access
            await signOut(firebaseAuth);

            // Redirect user to the email verification screen
            navigation.replace("VerifyEmailScreen");
            return; // Stop further execution
          }
          // Generic fallback for unexpected errors
          Alert.alert(
            "Login Failed",
            `Unexpected error occurred: ${error.code}`
          );
          break;
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Checking authentication status...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Main Title */}
        <Text style={styles.title}>Log In</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <FontAwesome
            name="envelope"
            size={hp(3)}
            color="#B0BEC5"
            style={styles.icon}
          />
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#B0BEC5"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            accessibilityLabel="Email Input Field"
          />
        </View>

        {/* Password Input with Visibility Toggle */}
        <View style={styles.inputContainer}>
          <FontAwesome
            name="lock"
            size={hp(3)}
            color="#B0BEC5"
            style={styles.icon}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#B0BEC5"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
            accessibilityLabel="Password Input Field"
          />
          <Pressable
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}
            accessibilityLabel="Toggle Password Visibility"
          >
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={hp(3)}
              color="#B0BEC5"
            />
          </Pressable>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <View style={styles.rememberMe}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              style={{ marginRight: wp(2) }}
              ios_backgroundColor="#B2DDF9"
              trackColor={{ false: "#B2DDF9", true: "#008000" }}
              thumbColor={rememberMe ? "#B2DDF9" : "#f4f3f4"}
            />
            <Text style={styles.rememberText}>Keep me logged in</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate("ForgetPasswordScreen")}
            style={({ pressed }) => pressed && styles.linkPressed}
          >
            <Text style={styles.forgetPassword}>Forgot password?</Text>
          </Pressable>
        </View>

        {/* Login Button */}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLogin}
          accessibilityRole="button"
          accessibilityLabel="Log in button"
          accessibilityHint="Logs in to your account"
        >
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        {/* FrontPage Button */}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.navigate("FrontPage")}
          accessibilityLabel="Navigate to the front page"
          accessibilityHint="Navigates to the front page of the application"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Home Page</Text>
        </Pressable>

        {/* Modal for Login Errors */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modalMessage}</Text>

              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => setModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close modal"
                accessibilityHint="Closes the error modal"
              >
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(5),
  },
  title: {
    fontSize: hp(5),
    fontWeight: "bold",
    color: "#B2DDF9",
    textAlign: "center",
    marginBottom: hp(6),
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
  optionsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    marginVertical: hp(2),
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  rememberText: {
    color: "#B2DDF9",
    fontSize: hp(2),
    fontWeight: "600",
  },
  forgetPassword: {
    color: "#B2DDF9",
    textDecorationLine: "underline",
    fontSize: hp(2),
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: hp(2.5),
  },
  modalButton: {
    backgroundColor: "#424242",
    borderRadius: wp(7),
    width: "90%",
    alignItems: "center",
    padding: hp(2),
    marginTop: hp(3),
    borderColor: "#B2DDF9",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#424242",
    borderRadius: wp(7),
    width: "90%",
    alignItems: "center",
    paddingVertical: hp(2),
    marginTop: hp(3),
    borderColor: "#B2DDF9",
    borderWidth: 1,
  },
  buttonPressed: {
    backgroundColor: "#525252",
  },
  buttonText: {
    color: "#B2DDF9",
    fontSize: hp(2.5),
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default LoginScreen;

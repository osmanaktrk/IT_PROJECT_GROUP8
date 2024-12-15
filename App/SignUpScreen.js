import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
  ImageBackground,
  Modal,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { firebaseAuth } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile
} from "firebase/auth";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false); // To control popup visibility
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSignup = async () => {
    // Clear previous error messages
    setModalMessage("");

    // Check if passwords match
    if (password !== confirmPassword) {
      setModalMessage("Passwords do not match!");
      setModalVisible(true);
      return;
    }

    // Username Validation
    if (username.length < 3) {
      setModalMessage("Your username must be at least 3 characters long.");
      setModalVisible(true);
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setModalMessage(
        "Your username can only contain letters, numbers, and underscores."
      );
      setModalVisible(true);
      return;
    }

    // Email Validation
    if (!email) {
      setModalMessage("Email address is required.");
      setModalVisible(true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setModalMessage("Please enter a valid email address.");
      setModalVisible(true);
      return;
    }

    //*********** Password Verification will remain as a comment temporarily ***********

    // Password Validation
    // if (password.length < 6) {
    //   setModalMessage("Your password must be at least 6 characters long.");
    //   setModalVisible(true);
    //   return;
    // }
    // if (!/[A-Z]/.test(password)) {
    //   setModalMessage(
    //     "Your password must contain at least one uppercase letter."
    //   );
    //   setModalVisible(true);
    //   return;
    // }
    // if (!/[a-z]/.test(password)) {
    //   setModalMessage(
    //     "Your password must contain at least one lowercase letter."
    //   );
    //   setModalVisible(true);
    //   return;
    // }
    // if (!/[0-9]/.test(password)) {
    //   setModalMessage("Your password must contain at least one number.");
    //   setModalVisible(true);
    //   return;
    // }
    // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    //   setModalMessage(
    //     "Your password must contain at least one special character."
    //   );
    //   setModalVisible(true);
    //   return;
    // }

    //*********** Password Verification will remain as a comment temporarily ***********

    // Check Terms and Conditions
    if (!isChecked) {
      setModalMessage(
        "In order to create an account, you must read and accept the terms and conditions."
      );
      setModalVisible(true);
      return;
    }

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });
      // Send email verification
      await sendEmailVerification(user);
      Alert.alert(
        "Success",
        `Hello ${user.displayName}, welcome. Your account has been created. Please verify your email before logging in.`
      );

      // Sign out the user until email is verified
      navigation.replace("VerifyEmailScreen");
      setTimeout(async () => {
        await signOut(firebaseAuth);
      }, 500);
    } catch (error) {
      // Handle Firebase authentication errors
      switch (error.code) {
        case "auth/email-already-in-use":
          // Email is already associated with an account
          setModalMessage(
            "This email is already in use. Please use a different email."
          );
          setModalVisible(true);
          break;
        case "auth/invalid-email":
          // Email format is invalid
          setModalMessage(
            "Invalid email format. Please enter a valid email address."
          );
          setModalVisible(true);
          break;

        case "auth/missing-password":
          // Password is missing in the request
          setModalMessage("Password is required. Please provide a password.");
          setModalVisible(true);
          break;
        case "auth/weak-password":
          // Password is too weak
          setModalMessage(
            "Your password is too weak. Please use a stronger password."
          );
          setModalVisible(true);
          break;
        case "auth/network-request-failed":
          // Network error
          setModalMessage(
            "Network error. Please check your internet connection and try again."
          );
          setModalVisible(true);
          break;
        case "auth/operation-not-allowed":
          // Email/password accounts are not enabled in Firebase
          setModalMessage(
            "Sign up is currently not allowed. Please contact support."
          );
          setModalVisible(true);
          break;
        default:
          // Handle unexpected errors
          setModalMessage(`An unexpected error occurred: ${error.message}`);
          setModalVisible(true);
      }
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")} // Ensure the image exists in the correct path
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>SIGN-UP</Text>

        {/* Username Input */}
        <View style={styles.inputContainer}>
          <FontAwesome
            name="user"
            size={hp(3)}
            color="#B0BEC5"
            style={styles.icon}
          />
          <TextInput
            placeholder="Enter your username"
            placeholderTextColor="#B0BEC5"
            style={styles.input}
            value={username}
            onChangeText={(value) => setUsername(value.trim())}
            autoCapitalize="none"
          />
        </View>

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
            onChangeText={(value) => setEmail(value.trim())}
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
            onChangeText={(value) => setPassword(value.trim())}
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

        {/* Confirm Password Input with Visibility Toggle */}
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
            onChangeText={(value) => setConfirmPassword(value.trim())}
            secureTextEntry={!passwordConfirmVisible}
            autoCapitalize="none"
            accessibilityLabel="Password Input Field"
          />
          <Pressable
            onPress={() => setPasswordConfirmVisible(!passwordConfirmVisible)}
            style={styles.eyeIcon}
            accessibilityLabel="Toggle Password Visibility"
          >
            <Ionicons
              name={passwordConfirmVisible ? "eye-off" : "eye"}
              size={hp(3)}
              color="#B0BEC5"
            />
          </Pressable>
        </View>

        <View style={styles.checkboxContainer}>
          <Switch
            value={isChecked}
            onValueChange={(value) => {
              setIsChecked(value);
              setTermsModalVisible(value);
            }}
            ios_backgroundColor="#B2DDF9"
            trackColor={{ false: "#B2DDF9", true: "#008000" }}
            thumbColor={isChecked ? "#B2DDF9" : "#f4f3f4"}
          />
          <Text style={styles.checkboxText}>
            I agree to Terms and Conditions
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSignup} // Navigate to VerifyEmailScreen
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>
      </ScrollView>

      {/* Modal for Terms and Conditions */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={termsModalVisible}
        onRequestClose={() => setTermsModalVisible(false)} // Close the modal when the user presses back
      >
        <View style={styles.termsModalBackground}>
          <View style={styles.termsModalContainer}>
            <Text style={styles.termsModalTitle}>Terms and Conditions</Text>
            <Text style={styles.termsModalContent}>
              These terms and conditions outline the rules and regulations for
              the use of the application's services.
            </Text>
            <Text style={styles.termsModalContent}>
              By accessing the application, we assume you accept these terms and
              conditions. Do not continue to use the application if you do not
              agree to take all of the terms and conditions stated here.
            </Text>

            <View style={styles.termsModalButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.agreeButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => {
                  setTermsModalVisible(false);
                  setIsChecked(true);
                }} // Close the modal
              >
                <Text style={styles.termsButtonsText}>Agree</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.disagreeButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => {
                  setTermsModalVisible(false);
                  setIsChecked(false);
                }} // Close the modal
              >
                <Text style={styles.termsButtonsText}>Disagree</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable
              style={[styles.modalButton]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(2),
  },
  checkboxText: {
    color: "#B2DDF9",
    marginLeft: wp(2),
    fontSize: hp(2),
  },
  button: {
    backgroundColor: "#424242",
    paddingVertical: hp(2),
    borderRadius: wp(7),
    width: "90%",
    alignItems: "center",
    marginTop: hp(2),
    borderColor: "#B2DDF9",
    borderWidth: 1,
  },
  buttonPressed: {
    backgroundColor: "#525252",
  },
  buttonText: {
    color: "#B2DDF9",
    fontWeight: "bold",
    fontSize: hp(2.5),
  },
  termsModalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  termsModalContainer: {
    backgroundColor: "#424242",
    width: "90%",
    borderRadius: wp(5),
    padding: wp(5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  termsModalTitle: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: "#B2DDF9",
    marginBottom: hp(2),
  },
  termsModalContent: {
    fontSize: hp(2),
    color: "#B0BEC5",
    marginBottom: hp(2),
    textAlign: "left",
  },
  termsModalButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  agreeButton: {
    flex: 1,
    backgroundColor: "#008000",
    paddingVertical: hp(1.5),
    borderRadius: wp(5),
    alignItems: "center",
    marginTop: hp(2),
    marginRight: 10,
  },
  disagreeButton: {
    flex: 1,
    backgroundColor: "#FF0000",
    paddingVertical: hp(1.5),
    borderRadius: wp(5),
    alignItems: "center",
    marginTop: hp(2),
  },
  termsButtonsText: {
    color: "#B2DDF9",
    fontWeight: "bold",
    fontSize: hp(2),
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    paddingHorizontal: wp(7),
    elevation: 2,
    backgroundColor: "#424242",
    paddingVertical: hp(2),
    borderRadius: wp(7),
    width: "90%",
    alignItems: "center",
    marginTop: hp(2),
    borderColor: "#B2DDF9",
    paddingVertical: hp(2),
    borderWidth: 1,
  },

  textStyle: {
    color: "#B2DDF9",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
});

export default SignUpScreen;

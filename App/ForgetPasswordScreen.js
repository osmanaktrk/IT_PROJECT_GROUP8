import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "../FirebaseConfig";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      // Directly send password reset email
      await sendPasswordResetEmail(firebaseAuth, email);
      Alert.alert(
        "Success",
        "A password reset email has been sent to your email address. Please check your inbox."
      );
      setEmail(""); // Clear the email input field
      navigation.replace("LoginScreen");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          Alert.alert(
            "Invalid Email",
            "The email address entered is invalid. Please try again."
          );
          break;

        case "auth/user-not-found":
          Alert.alert(
            "No Account Found",
            "There is no account registered with this email address."
          );
          break;

        case "auth/network-request-failed":
          Alert.alert(
            "Network Error",
            "Network error. Please check your internet connection and try again."
          );
          break;

        default:
          Alert.alert("Error", error.message);
          break;
      }
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Forgot Password</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Please enter your email to reset the password.
        </Text>

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

        {/* Reset Password Button */}
        <Pressable
          style={({ pressed }) => [
            styles.resetButton,
            pressed && styles.resetButtonPressed,
          ]}
          onPress={handleResetPassword}
        >
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </Pressable>
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
    fontSize: hp(4.5),
    fontWeight: "bold",
    color: "#B2DDF9",
    textAlign: "center",
    marginBottom: hp(3),
    lineHeight: hp(5),
  },
  subtitle: {
    fontSize: hp(2),
    color: "#B2DDF9",
    textAlign: "center",
    marginBottom: hp(3),
    lineHeight: hp(2.5),
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
  resetButton: {
    backgroundColor: "#424242",
    borderRadius: wp(7),
    height: hp(7),
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(3),
    borderColor: "#B2DDF9",
    borderWidth: 1,
  },
  resetButtonPressed: {
    backgroundColor: "#525252",
  },
  resetButtonText: {
    color: "#B2DDF9",
    fontSize: hp(2.5),
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ForgotPasswordScreen;
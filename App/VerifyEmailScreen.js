import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ImageBackground,
  Alert,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { firebaseAuth } from "../FirebaseConfig";
import {
  sendEmailVerification,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const VerifyEmailScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const resendEmail = async () => {
    // Email Validation
    if (!email) {
      Alert.alert("Email", "Email address is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Email", "Please enter a valid email address.");
      return;
    }

    // Password Validation
    if (password.length < 6) {
      Alert.alert(
        "Password",
        "Your password must be at least 6 characters long."
      );
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      const user = userCredential.user;

      await sendEmailVerification(user);
      Alert.alert(
        "Success",
        "A verification email has been sent to your email address."
      );

      setEmail("");
      setPassword("");

      await signOut(firebaseAuth);
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          Alert.alert("Password", "Incorrect password. Please try again.");
          break;

        case "auth/user-not-found":
          Alert.alert("Email", "Email not found. Please sign up.");
          break;

        case "auth/invalid-email":
          Alert.alert(
            "Email",
            "Invalid email format. Please check your email address."
          );
          break;

        case "auth/network-request-failed":
          Alert.alert(
            "Network Error",
            "Network error. Please check your internet connection and try again."
          );
          break;

        case "auth/invalid-credential":
          Alert.alert(
            "Invalid credentials",
            "Invalid credentials. Please check your email and password."
          );
          break;

        case "auth/internal-error":
          Alert.alert(
            "Internal Error",
            "An internal error occurred. Please try again later or contact support."
          );
          break;

        default:
          Alert.alert("Unexpected Error", "An unexpected error occurred");
      }
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Check Your Email</Text>
        <Text style={styles.subtitle}>
          We sent a confirmation link to your email. Please verify your email
          before logging in.
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
            onChangeText={(value) => setEmail(value.trim())}
            autoCapitalize="none"
            keyboardType="email-address"
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
          />
          <Pressable
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={hp(3)}
              color="#B0BEC5"
            />
          </Pressable>
        </View>

        {/* Resend Email Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={resendEmail}
        >
          <Text style={styles.buttonText}>Resend Email</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
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
  subtitle: {
    fontSize: hp(2),
    color: "#B2DDF9",
    textAlign: "center",
    marginBottom: hp(5),
    lineHeight: hp(3),
    width: wp(80),
  },
  button: {
    backgroundColor: "#424242",
    paddingVertical: hp(2),
    paddingHorizontal: wp(20),
    borderRadius: wp(5),
    marginTop: hp(2),
    borderColor: "#B2DDF9",
    borderWidth: 1,
  },
  buttonPressed: { backgroundColor: "#525252" },
  buttonText: {
    color: "#B2DDF9",
    fontSize: hp(2.5),
    fontWeight: "bold",
    textAlign: "center",
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
  },
  input: { flex: 1, fontSize: hp(2), color: "#000", marginLeft: wp(3) },
  icon: { marginRight: wp(2) },
});

export default VerifyEmailScreen;

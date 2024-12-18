import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  ActivityIndicator,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseAuth } from "../FirebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

const ChoiceButton = ({ title, onPress, accessibilityLabel, accessibilityHint }) => (
  <Pressable
    style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}
    accessibilityHint={accessibilityHint}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </Pressable>
);

const LoginSignupChoiceScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Check user authendication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        navigation.replace("HomePage");
      } else {
        setIsLoading(false);
      }
    });
    return unsubscribe; // Cleanup on unmount
  }, [navigation]);

  // Check if the user is already logged in when the app starts
  useEffect(() => {
    const checkUserStatus = async () => {
      const savedEmail = await AsyncStorage.getItem("userEmail");
      const savedPassword = await AsyncStorage.getItem("userPassword");
      const keepLoggedIn = await AsyncStorage.getItem("keepLoggedIn");
      

      if (keepLoggedIn === 'true' && savedEmail && savedPassword) {
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
          Alert.alert(
            "Auto-login failed",
            "Please log in again."
          );

          //console.error("Auto-login failed:", error.message);
        }
      }
      setIsLoading(false);
    };

    checkUserStatus();
  }, [navigation]);

  // Show loading indicator while checking authentication state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#B2DDF9" />
      </View>
    );
  }



  return (
    <ImageBackground
      source={require("../assets/background.png")} // Background image
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Log in Section */}
        <Text style={styles.title}>Do you have an account?</Text>
        <ChoiceButton
          title="Log in"
          onPress={() => navigation.navigate("LoginScreen")}
          accessibilityLabel="Navigate to Login Screen"
          accessibilityHint="Tap to navigate to the Login screen"
        />

        {/* Sign up Section */}
        <Text style={styles.title}>Don’t have an account?</Text>
        <ChoiceButton
          title="Sign up"
          onPress={() => navigation.navigate("SignUpScreen")}
          accessibilityLabel="Navigate to Sign Up Screen"
          accessibilityHint="Tap to navigate to the Sign Up screen"
        />
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
    paddingHorizontal: wp(5), // Dynamic padding
  },
  title: {
    color: "#B2DDF9",
    fontSize: hp(2.5), // Responsive font size
    marginVertical: hp(2), // Dynamic vertical margin
    textAlign: "center",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#424242", // Button background color
    borderRadius: wp(10), // Fully rounded corners
    paddingVertical: hp(2), // Responsive padding
    paddingHorizontal: wp(20), // Responsive width
    marginVertical: hp(1.5), // Dynamic spacing between buttons
    borderColor: "#B2DDF9",
    borderWidth:1,
  },
  buttonPressed: {
    backgroundColor: "#525252", // Slightly lighter background on press
  },
  buttonText: {
    color: "#B2DDF9",
    fontSize: hp(2.5), // Responsive font size
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LoginSignupChoiceScreen;
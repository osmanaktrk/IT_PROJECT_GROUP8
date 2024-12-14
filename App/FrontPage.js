

import React from "react";
import { View, Text, StyleSheet, Image, ImageBackground, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Icon library
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"; // Responsive screen library

const FrontPage = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../assets/background.png")} // Background image
      style={styles.container}
    >
      <View style={styles.overlay}>
        {/* Front Logo */}
        <Image
          source={require("../assets/FrontLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Parking made simple in real-time</Text>

        {/* Forward Button with Icon */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed, // Apply pressed style dynamically
          ]}
          onPress={() => navigation.navigate("LoginSignupChoiceScreen")}
        >
          <Ionicons name="arrow-forward-circle" size={hp(6)} color="#B2DDF9" />
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay effect
    width: "100%",
    height: "100%",
    paddingTop: hp(12),
  },
  logo: {
    width: wp(50), // Dynamic width for logo
    height: wp(50), // Dynamic height for logo
    marginBottom: hp(8), // Add spacing below logo
    opacity: 0.8,
  },
  title: {
    fontSize: hp(4.5), // Responsive font size
    fontWeight: "bold",
    color: "#B2DDF9",
    textAlign: "center",
    marginBottom: hp(8), // Space below the title
    lineHeight: hp(5), // Adjust line height
    opacity: 0.8,
    width: "80%", // Ensure text fits within bounds
  },
  button: {
    backgroundColor: "#424242", // Button background color
    width: wp(20), // Responsive width
    height: wp(20), // Responsive height
    borderRadius: wp(10), // Fully rounded button
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8, // Default opacity
  },
  buttonPressed: {
    backgroundColor: "#525252", // Slightly lighter background on press
    opacity: 1, // Full opacity on press
  },
});

export default FrontPage;
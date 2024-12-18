import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const FrontPage = ({ navigation }) => {
  setTimeout(() => {
    navigation.navigate("LoginSignupChoiceScreen");
  }, 700);

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
            pressed && styles.pressedStyle, // Apply pressed style dynamically
          ]}
          onPress={() => navigation.navigate("LoginSignupChoiceScreen")}
          accessibilityLabel="Navigate to Login or Signup choice screen"
        >
          <Ionicons
            name="arrow-forward-circle"
            size={Math.min(wp(20), hp(8))}
            color="#B2DDF9"
          />
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: "100%",
    height: "100%",
    paddingTop: hp(12),
    paddingHorizontal: wp(5), // Add horizontal padding
  },
  logo: {
    width: wp(50),
    height: wp(50),
    marginBottom: hp(8),
    opacity: 0.8,
  },
  title: {
    fontSize: Math.min(Math.max(hp(3), 16), 24), // Dynamic size with min/max
    fontWeight: "bold",
    color: "#B2DDF9",
    textAlign: "center",
    marginBottom: hp(8),
    lineHeight: Math.min(hp(5), 30),
    opacity: 0.8,
    width: "80%",
  },
  button: {
    backgroundColor: "#424242",
    width: wp(50),
    height: wp(20),
    borderRadius: wp(10),
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
    borderColor: "#B2DDF9",
    borderWidth: 1,
  },
  pressedStyle: {
    backgroundColor: "#525252",
    opacity: 1,
  },
});

export default FrontPage;

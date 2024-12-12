import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // For navigation

const LoginSignupChoiceScreen = () => {
  const navigation = useNavigation(); // Hook for navigation

  return (
    <ImageBackground
      source={require("../assets/background.png")} //Background photo
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>You have an account?</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("LoginScreen")} // Navigate to Login screen
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Don’t have an account?</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SignUpScreen")} // Navigate to SignUpScreen
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
//Style for the Login/Signup Choice Screen

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#B2DDF9", // Standard font color..
    marginVertical: 10,
    textAlign: "center",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#424242", // Standard buttons color..
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 60,
    marginVertical: 10,
  },
  buttonText: {
    color: "#B2DDF9",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LoginSignupChoiceScreen;

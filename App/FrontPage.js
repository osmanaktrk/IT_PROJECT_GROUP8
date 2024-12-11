import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";


const FrontPage = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../assets/background.png")} //background page
      style={styles.container}
    >
      <View style={styles.overlay}>
      <Image
          source={require('../assets/FrontLogo.png')} //FrontLogo
          style={styles.logo}
             resizeMode="contain"
        />
        <Text style={styles.title}>Parking made simple in real-time</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("LoginSignupChoiceScreen")} // Navigate to LoginSignupPageChoicePage
        >
          <Text style={styles.arrow}>&rarr;</Text>
        </TouchableOpacity>
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
    paddingTop:100,
  },
  logo: {
    width: 250,
    height: 250, 
    marginBottom: 60,
 opacity:0.8,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#B2DDF9",
    textAlign: "center",
    marginBottom: 60,
    lineHeight: 40,
    opacity:0.8,
    width: "80%",
  },

  button: {
    backgroundColor: "#424242", //Standard button color..
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    opacity:0.8,
  },
  arrow: {
    fontSize: 36,
    color: "#B2DDF9",
  },
});

export default FrontPage;

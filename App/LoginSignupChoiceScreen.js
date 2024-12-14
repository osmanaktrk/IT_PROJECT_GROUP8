import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
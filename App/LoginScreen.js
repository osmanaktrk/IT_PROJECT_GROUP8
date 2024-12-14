import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// InputField Component
const InputField = memo(({ placeholder, iconName, secureTextEntry }) => (
  <View style={styles.inputContainer}>
    <FontAwesome name={iconName} size={hp(3)} color="#B0BEC5" style={styles.icon} />
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#B0BEC5"
      secureTextEntry={secureTextEntry}
      style={styles.input}
      accessibilityLabel={`Input field for ${placeholder}`}
    />
  </View>
));

// PrimaryButton Component
const PrimaryButton = memo(
  ({ title, onPress, accessibilityLabel, accessibilityHint }) => (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed, // Shrink effect on press
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  )
);

const LoginScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Main Title */}
        <Text style={styles.title}>Log in</Text>

        {/* Email Input */}
        <InputField placeholder="Enter your email" iconName="envelope" />

        {/* Password Input */}
        <InputField placeholder="Password" iconName="lock" secureTextEntry />

        {/* Login Button */}
        <PrimaryButton
          title="Log in"
          onPress={() => navigation.navigate("HomePage")}
          accessibilityLabel="Log in button"
          accessibilityHint="Navigates to the home page after logging in"
        />

        {/* Forget Password */}
        <Pressable
          onPress={() => navigation.navigate("ForgetPasswordScreen")}
          style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
        >
          <Text style={styles.linkText}>Forgot password?</Text>
        </Pressable>

        {/* FrontPage Button */}
        <PrimaryButton
          title="Go to Front Page"
          onPress={() => navigation.navigate("FrontPage")}
          accessibilityLabel="Navigate to the front page"
          accessibilityHint="Navigates to the front page of the application"
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
    paddingHorizontal: wp(5),
  },
  title: {
    fontSize: hp(5), // Adjusted for better visibility
    fontWeight: "bold",
    color: "#B2DDF9",
    textAlign: "center",
    marginBottom: hp(6),
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    lineHeight: hp(6),
    opacity: 0.9,
    width: "80%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly transparent white background
    borderRadius: wp(7),
    paddingHorizontal: wp(4),
    marginVertical: hp(1.5),
    width: "90%",
    height: hp(7),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // Shadow for Android
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
  button: {
    backgroundColor: "#424242",
    borderRadius: wp(7),
    width: "90%",
    alignItems: "center",
    paddingVertical: hp(2),
    marginTop: hp(3),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }], // Shrink effect on press
    backgroundColor: "#525252", // Slightly lighter on press
  },
  buttonText: {
    color: "#B2DDF9",
    fontSize: hp(2.5),
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    marginTop: hp(2),
    paddingVertical: hp(0.5),
  },
  linkPressed: {
    transform: [{ scale: 0.95 }], // Shrink effect
  },
  linkText: {
    color: "#B2DDF9",
    fontSize: hp(2),
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});

export default LoginScreen;
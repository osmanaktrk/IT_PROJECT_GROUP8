import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const VerifyEmailScreen = () => {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const inputs = useRef([]);

  const handleCodeChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;

    // If a value is entered, focus the next input
    if (value.length === 1 && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
    // If the value is empty and not the first field, focus the previous input
    else if (value === "" && index > 0) {
      inputs.current[index - 1].focus();
    }

    setCode(newCode);
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")} // Ensure the image exists in the correct path
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We sent a confirmation link to {"\n"}
          <Text style={styles.email}>John.doe@gmail.com</Text>
          {"\n"}Enter the 5-digit code mentioned in the email
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.codeInput}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(value) => handleCodeChange(index, value)}
              ref={(input) => (inputs.current[index] = input)} // Set the ref to enable focus shifting
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Verify Code</Text>
        </TouchableOpacity>

        <Text style={styles.resendText}>
          Haven’t got the email yet?{" "}
          <Text style={styles.resendLink}>Resend email</Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // Make the image cover the entire screen
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold", 
    color: "#B2DDF9", 
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold", 
    color: "#B2DDF9",
    textAlign: "center",
    marginBottom: 20,
  },
  email: {
    fontWeight: "bold",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    backgroundColor: "#424242",
    color: "#B2DDF9",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold", 
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#424242",
    padding: 15,
    borderRadius: 25,
    width: "90%",
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#B2DDF9",
    fontWeight: "bold", 
    fontSize: 18,
  },
  resendText: {
    color: "#B2DDF9",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold", 
  },
  resendLink: {
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});

export default VerifyEmailScreen;

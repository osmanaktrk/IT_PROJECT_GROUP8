import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // For navigation

const VerifyEmailScreen = () => {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false); // Control the success modal
  const inputs = useRef([]);
  const navigation = useNavigation(); // Navigation function

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

  const handleVerifyCode = () => {
    // Show the success modal
    setSuccessModalVisible(true);

    // Wait for 3 seconds and navigate to LoginScreen
    setTimeout(() => {
      setSuccessModalVisible(false); // Hide the modal
      navigation.navigate("LoginScreen"); // Navigate to LoginScreen
    }, 3000);
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

        <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
          <Text style={styles.buttonText}>Verify Code</Text>
        </TouchableOpacity>

        <Text style={styles.resendText}>
          Haven’t got the email yet?{" "}
          <Text style={styles.resendLink}>Resend email</Text>
        </Text>
      </View>
      {/* Success Modal */}
      <Modal
        animationType="fade" // Changed to "fade" for smoother appearance
        transparent={true}
        visible={isSuccessModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.checkIcon}>✔️</Text>
            </View>
            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successMessage}>
              Congrats, your account has been successfully created
            </Text>
          </View>
        </View>
      </Modal>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#B2DDF9",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#B2DDF9",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22, // Added line height for better readability
  },

  email: {
    fontWeight: "bold",
  },
  codeContainer: {
    flexDirection: "row", // Arrange inputs in a row
    justifyContent: "space-between", // Space inputs evenly
    width: "80%", // Adjust container width
    marginBottom: 20,
  },
  codeInput: {
    width: 50, // Match input box width from the image
    height: 50, // Match input box height from the image
    backgroundColor: "#fff", // White background
    color: "#000", // Black text color
    textAlign: "center", // Center align text
    fontSize: 20, // Adjust font size to match the design
    fontWeight: "bold", // Bold text
    borderRadius: 8, // Rounded corners
    borderWidth: 2, // Add border
    borderColor: "#B2DDF9", // Match border color when active
    shadowColor: "#000", // Add shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Add elevation for shadow
  },

  button: {
    backgroundColor: "#424242",
    padding: 15,
    borderRadius: 30,
    width: "85%",
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    backgroundColor: "#fff", // Updated to white for better visibility
    width: "75%",
    padding: 25,
    borderRadius: 20, // Added rounded corners
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: "#B2DDF9",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkIcon: {
    fontSize: 32,
    color: "#424242",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#424242",
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: "#424242",
    textAlign: "center",
  },
});

export default VerifyEmailScreen;

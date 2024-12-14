import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  ImageBackground,
  Modal,
} from "react-native";






const SignUpScreen = ({navigation}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // To control popup visibility

  const toggleSwitch = (value) => {
    setIsChecked(value);
    if (value) {
      setModalVisible(true); // Show popup when switch is turned on
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")} // Ensure the image exists in the correct path
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>SIGN-UP</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#B0BEC5"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#B0BEC5"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#B0BEC5"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#B0BEC5"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Mobile number"
          placeholderTextColor="#B0BEC5"
          keyboardType="phone-pad"
          value={mobileNumber}
          onChangeText={(text) => setMobileNumber(text)}
        />

        <View style={styles.checkboxContainer}>
          <Switch
            value={isChecked}
            onValueChange={toggleSwitch}
            trackColor={{ false: "#424242", true: "#B2DDF9" }}
            thumbColor={isChecked ? "#B2DDF9" : "#fff"}
          />
          <Text style={styles.checkboxText}>
            I agree to Terms and condition
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("VerifyEmailScreen")} // Navigate to VerifyEmailScreen
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for Terms and Conditions */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Close the modal when the user presses back
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Terms and Condition</Text>
            <Text style={styles.modalContent}>
              These terms and conditions outline the rules and regulations for
              the use of the application's services.
            </Text>
            <Text style={styles.modalContent}>
              By accessing the application, we assume you accept these terms and
              conditions. Do not continue to use the application if you do not
              agree to take all of the terms and conditions stated here.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)} // Close the modal
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#B2DDF9",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    color: "#000",
    borderRadius: 50,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxText: {
    color: "#B2DDF9",
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#424242",
    padding: 15,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    borderColor: "#B2DDF9",
    borderWidth:1,
  },
  buttonText: {
    color: "#B2DDF9",
    fontWeight: "bold",
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#424242",
    width: "90%",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#B2DDF9",
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
    color: "#B0BEC5",
    marginBottom: 15,
    textAlign: "left",
  },
  closeButton: {
    backgroundColor: "#B2DDF9",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#424242",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SignUpScreen;

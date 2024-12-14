//*****************************************************************************
//
//This page was created to test database connections. Do not make any changes.
//
//
//****************************************************************************





import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Switch,
  Alert,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { firebaseAuth } from "../../FirebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const TestLoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        Alert.alert("Welcome Back", `You are logged in as ${user.email}`);
        navigation.replace("TestLogoutPage");
      }
      setIsLoading(false);
    });

    // Cleanup
    return () => unsubscribe();
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;
      Alert.alert("Login Successful", `Welcome back, ${user.email}!`);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setModalMessage("Email not found. Please sign up.");
        setModalVisible(true);
      } else if (error.code === "auth/invalid-credential") {
        setModalMessage("Invalid credentials. Please check your email and password.");
        setModalVisible(true);
      } else {
        Alert.alert("Login Failed", error.message);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Checking authentication status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <View style={styles.switchContainer}>
        <Text>Keep me logged in</Text>
        <Switch value={keepLoggedIn} onValueChange={setKeepLoggedIn} />
      </View>

      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity
        onPress={() => navigation.navigate("TestForgetPasswordPage")}
      >
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.divider} />
      <Button
        title="Go to Homepage"
        onPress={() => navigation.navigate("TestHomePage")}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TestLoginPage;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  link: { color: "blue", textAlign: "center", marginTop: 10 },
  divider: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

});
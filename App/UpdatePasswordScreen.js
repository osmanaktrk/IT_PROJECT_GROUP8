import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const UpdatePasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <ImageBackground
      source={require('../assets/background.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
       
        {/* Title */}
        <Text style={styles.title}>Set a new password</Text>
        <Text style={styles.subtitle}>
          Create a new password. Ensure it differs from previous ones for security.
        </Text>

        {/* Enter the new password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your new password"
            placeholderTextColor="#B0BEC5"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <FontAwesome
            name={showPassword ? 'eye-slash' : 'eye'}
            size={20}
            color="#B0BEC5"
            style={styles.icon}
            onPress={() => setShowPassword(!showPassword)}
          />
        </View>

        {/* Re-enter Password*/}
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Re-enter password"
            placeholderTextColor="#B0BEC5"
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          <FontAwesome
            name={showConfirmPassword ? 'eye-slash' : 'eye'}
            size={20}
            color="#B0BEC5"
            style={styles.icon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </View>

        {/* Update password button*/}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => navigation.navigate('ConfirmPasswordResetScreen')} 
        >
          <Text style={styles.updateButtonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
 
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#B2DDF9",
    textAlign: "center",
    marginBottom: 5,
    paddingRight: 30,
    lineHeight: 50,
    opacity:0.8,
    width: "80%",
  },
  subtitle: {
    fontSize: 16,
    color: '#B2DDF9',
    textAlign: 'left',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#B2DDF9',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  icon: {
    marginLeft: 10,
  },
  updateButton: {
    backgroundColor: '#424242',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#B2DDF9', 
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UpdatePasswordScreen;

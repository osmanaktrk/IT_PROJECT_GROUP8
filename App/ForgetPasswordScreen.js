
import React from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ImageBackground,} from 'react-native';


const ForgotPasswordScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/background.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
      
        {/* Title */}
        <Text style={styles.title}>Forgot Password</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Please enter your email to reset the password
        </Text>

        {/* Email input */}
        <Text style={styles.label}>Your Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Joh.doe@gmail.com"
            placeholderTextColor="#B0BEC5"
            style={styles.input}
          />
        </View>

        {/* Rest password button*/}
        <TouchableOpacity
  style={styles.resetButton}
  onPress={() => navigation.navigate('VerifyCodeScreen')} // Navigate to verfication screen
>
  <Text style={styles.resetButtonText}>Rest Password</Text>
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
    fontSize: 39,
    fontWeight: "bold",
    color: "#B2DDF9",
    textAlign: "center",
    marginBottom: 30,
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
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    color: '#000',
  },
  resetButton: {
    backgroundColor: '#424242',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: '#B2DDF9', 
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;

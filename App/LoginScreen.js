import React from 'react';
import { View, Text, TextInput,TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation


const LoginScreen = () => {
  const navigation = useNavigation(); // Navigation function

  return (
    <ImageBackground
      source={require('../assets/background.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
  

        {/* Main Title */}
        <Text style={styles.title}>Log in</Text>

        {/* Email Input Field */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#B0BEC5"
            style={styles.input}
          />
          <FontAwesome name="envelope" size={20} color="#B0BEC5" style={styles.icon} />
        </View>

        {/* Password Input Field */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#B0BEC5"
            secureTextEntry
            style={styles.input}
          />
          <FontAwesome name="lock" size={20} color="#B0BEC5" style={styles.icon} />
        </View>

        {/*Another options */}
        <View style={styles.optionsContainer}>
  {/* Remember Me Button */}
  <View style={styles.rememberMe}>
    <Switch
      value={true}
      onValueChange={(newValue) => console.log(newValue)} 
      style={{ marginRight: 5 }}
    />
    <TouchableOpacity>
      <Text style={styles.rememberText}>Remember me</Text>
    </TouchableOpacity>
  </View>

  {/* Forget Password Button */}
  <TouchableOpacity onPress={() => navigation.navigate('ForgetPasswordScreen')}>
    <Text style={styles.forgetPassword}>Forget password?</Text>
  </TouchableOpacity>
</View>


        {/* Login Button */}
        <TouchableOpacity
  style={styles.loginButton}
  onPress={() => navigation.navigate('HomePage')} 
>
  <Text style={styles.loginButtonText}>Log in</Text>
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
    alignItems: 'center',
    paddingHorizontal: 20,
  },
 
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#B2DDF9",
    textAlign: "center",
    marginBottom: 60,
    lineHeight: 40,
    opacity:0.8,
    width: "80%",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '90%',
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  icon: {
    marginLeft: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginVertical: 10,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    color: '#B2DDF9',
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  forgetPassword: {
    color: '#B2DDF9',
    textDecorationLine: 'underline',
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#424242',
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#B2DDF9', 
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen;

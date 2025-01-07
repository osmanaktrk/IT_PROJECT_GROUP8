import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; //Arrow icon

const LoginSignupChoicePage = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/background.png')} //photo as background 
      style={styles.background}
    >
      <View style={styles.container}>
        <Ionicons name="arrow-back" size={30} color="#B2DDF9" style={styles.backIcon} />
        <Text style={styles.title} >You have an account?</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Don’t have an account?</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.termsButton]}
          onPress={() => navigation.navigate('TermsConditions')}
        >
          <Text style={styles.buttonText}>Terms and Conditions</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
//Style for the Login/Signup Choice Page

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
  backIcon: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  title: {
    color: '#B2DDF9', // Standard font color..
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#424242', // Standard buttons color..
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 60,
    marginVertical: 10,
  },
  buttonText: {
    color: '#B2DDF9', 
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  termsButton: {
    backgroundColor: '#007AFF', // Different color for Terms and Conditions button
  },
});

export default LoginSignupChoicePage;


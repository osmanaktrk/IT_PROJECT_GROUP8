import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Arrow icon
import { useNavigation } from '@react-navigation/native'; // Importeer de hook

const LoginSignupChoicePage = () => {
  const navigation = useNavigation(); // Gebruik de hook voor navigatie

  return (
    <ImageBackground
      source={require('../assets/background.png')} // Achtergrondafbeelding
      style={styles.background}
    >
      <View style={styles.container}>
        <Ionicons name="arrow-back" size={30} color="#B2DDF9" style={styles.backIcon} />
        <Text style={styles.title}>You have an account?</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Don’t have an account?</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        {/* Toevoegen van een knop naar de homepagina */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomePage')}>
          <Text style={styles.buttonText}>Go to HomePage</Text>
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
  backIcon: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  title: {
    color: '#B2DDF9',
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#424242',
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
});

export default LoginSignupChoicePage;

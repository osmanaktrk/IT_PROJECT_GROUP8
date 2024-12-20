import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,ImageBackground,} from 'react-native';


const ConfirmPasswordResetScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/background.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
      

        {/* Title */}
        <Text style={styles.title}>Password reset</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Your password has been successfully reset. Click confirm to set a new password.
        </Text>

        {/* confirm button */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => navigation.navigate('LoginScreen')} // Navigate to login page
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B2DDF9',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B2DDF9',
    textAlign: 'center',
    marginBottom: 30,
  },
  confirmButton: {
    backgroundColor: '#424242',
    borderRadius: 25,
    height: 50,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#B2DDF9',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ConfirmPasswordResetScreen;

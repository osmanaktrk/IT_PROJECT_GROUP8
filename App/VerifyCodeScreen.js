import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ImageBackground,} from 'react-native';

const VerifyCodeScreen = ({navigation}) => {
  const [code, setCode] = useState(['', '', '', '', '']); //To store the entered code

  const handleInputChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
       

        {/* Title */}
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We sent a reset link to <Text style={styles.bold}>John.doe@gmail.com</Text>
        </Text>
        <Text style={styles.subtitle}>
          Enter 5 digit code that mentioned in the email
        </Text>

        {/* Code input boxes*/}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.inputBox}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(value) => handleInputChange(value, index)}
            />
          ))}
        </View>

        {/* Verify Button */}

        <TouchableOpacity
  style={styles.verifyButton}
  onPress={() => navigation.navigate('UpdatePasswordScreen')} // Navigte to UpdatePasswordScreen
>
  <Text style={styles.verifyButtonText}>Verify Code</Text>
</TouchableOpacity>

        {/* Resend email text */}
        <Text style={styles.resendText}>
          Haven’t got the email yet?{' '}
          <Text style={styles.resendLink}>Resend email</Text>
        </Text>
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
    marginTop: 60,
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
    textAlign: 'center',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  inputBox: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    marginHorizontal: 5,
    marginTop: 30,
  },
  verifyButton: {
    backgroundColor: '#424242',
    borderRadius: 25,
    height: 50,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  verifyButtonText: {
    color: '#B2DDF9', 
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
  resendText: {
    fontSize: 16,
    color: '#B2DDF9',
    textAlign: 'center',
    marginTop: 30,
  },
  resendLink: {
    color: '#90CAF9',
    textDecorationLine: 'underline',
  },
});

export default VerifyCodeScreen;

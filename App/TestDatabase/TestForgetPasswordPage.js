//*****************************************************************************
//
//This page was created to test database connections. Do not make any changes.
//
//
//****************************************************************************



import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { firebaseAuth } from '../../FirebaseConfig';

const TestForgetPasswordPage = ({ navigation }) => {
  const [email, setEmail] = useState('');

  // E-posta ile şifre sıfırlama
  const handleEmailResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      Alert.alert('Success', 'A password reset email has been sent to your email address.');
      navigation.navigate('TestLoginPage');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      {/* E-posta ile şifre sıfırlama */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button title="Reset via Email" onPress={handleEmailResetPassword} />
    </View>
  );
};

export default TestForgetPasswordPage;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    borderColor: '#ccc',
  },
});

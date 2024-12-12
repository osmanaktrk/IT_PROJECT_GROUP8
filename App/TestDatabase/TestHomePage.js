//*****************************************************************************
//
//This page was created to test database connections. Do not make any changes.
//
//
//****************************************************************************



import { StyleSheet, Text, View, TextInput, Button, Switch, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { firebaseAuth } from '../../FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const TestHomePage = ({ navigation }) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        navigation.replace('TestLogoutPage'); // Eğer kullanıcı zaten giriş yaptıysa logout sayfasına yönlendirme
      }
    });

    return () => unsubscribe(); // Cleanup
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App</Text>
      <Button title="Login" onPress={() => navigation.navigate('TestLoginPage')} />
      <Button title="Sign Up" onPress={() => navigation.navigate('TestSignupPage')} />
    </View>
  );
};

export default TestHomePage;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});

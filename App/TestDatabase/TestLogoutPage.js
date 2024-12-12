//*****************************************************************************
//
//This page was created to test database connections. Do not make any changes.
//
//
//****************************************************************************





import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import React from 'react';
import { firebaseAuth } from '../../FirebaseConfig';
import { signOut } from 'firebase/auth';

const TestLogoutPage = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
      Alert.alert('Success', 'You have been logged out.');
      navigation.replace('TestLoginPage'); // Login sayfasına yönlendirme
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logout</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default TestLogoutPage;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
});

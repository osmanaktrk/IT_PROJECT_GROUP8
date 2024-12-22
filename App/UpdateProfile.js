import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function UpdateProfile({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      <TextInput style={styles.inputField} placeholder="Name" />
      <TextInput style={styles.inputField} placeholder="E-mail" keyboardType="email-address" />
      <TextInput style={styles.inputField} placeholder="Phone number" keyboardType="phone-pad" />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()} // Navigate back to the previous screen
      >
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

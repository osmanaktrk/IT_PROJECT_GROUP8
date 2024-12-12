//*****************************************************************************
//
//This page was created to test database connections. Do not make any changes.
//
//
//****************************************************************************



import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TestHomePage from './App/TestDatabase/TestHomePage';
import TestLoginPage from './App/TestDatabase/TestLoginPage';
import TestSignupPage from './App/TestDatabase/TestSignupPage';
import TestForgetPasswordPage from './App/TestDatabase/TestForgetPasswordPage';
import TestLogoutPage from './App/TestDatabase/TestLogoutPage';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TestHomePage">
        <Stack.Screen name="TestHomePage" component={TestHomePage} options={{ title: 'Welcome' }} />
        <Stack.Screen name="TestLoginPage" component={TestLoginPage} options={{ title: 'Login' }} />
        <Stack.Screen name="TestSignupPage" component={TestSignupPage} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="TestForgetPasswordPage" component={TestForgetPasswordPage} />
        <Stack.Screen name="TestLogoutPage" component={TestLogoutPage} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

//export default App;

const styles = StyleSheet.create({})
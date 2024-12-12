import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FrontPage from './App/FrontPage';
import LoginSignupChoiceScreen from './App/LoginSignupChoiceScreen'; // Pas dit pad aan naar jouw bestand
import HomePage from './App/Homepage'; // Zorg ervoor dat je een HomePage hebt
import LoginScreen from './App/LoginScreen';
import ForgetPasswordScreen from './App/ForgetPasswordScreen';
import VerifyCodeScreen from './App/VerifyCodeScreen';
import UpdatePasswordScreen from './App/UpdatePasswordScreen';
import SignUpScreen from "./App/SignUpScreen";
import VerifyEmailScreen from './App/VerifyEmailScreen';
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="FrontPage"
        screenOptions={{ headerShown: false }}
      >
        {/* Front Page */}
        <Stack.Screen name="FrontPage" component={FrontPage} />

        {/* Login/Signup Choice Page */}
        <Stack.Screen
          name="LoginSignupChoiceScreen"
          component={LoginSignupChoiceScreen}
        />

        {/* Login Page */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />

        {/* VerifyCodeScreen Page */}
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        
        {/* VerifyEmailScreen Page */}
        <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />

        {/* ForgetPasswordScreen Page */}
        <Stack.Screen
          name="ForgetPasswordScreen"
          component={ForgetPasswordScreen}
        />

        {/* VerifyCodeScreen Page */}
        <Stack.Screen name="VerifyCodeScreen" component={VerifyCodeScreen} />

        {/* UpdatePasswordScreen Page */}
        <Stack.Screen name="UpdatePasswordScreen" component={UpdatePasswordScreen} />


        {/* Home Page */}
        <Stack.Screen name="HomePage" component={HomePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

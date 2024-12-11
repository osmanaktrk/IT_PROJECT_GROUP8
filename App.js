import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // For managing navigation
import { createStackNavigator } from '@react-navigation/stack'; // For creating a navigation stack
import LoginSignupChoiceScreen from './src/pages/LoginSignupChoiceScreen';  //Add Login/Signup choice 
import LoginScreen from './src/pages/LoginScreen'; // Add Login screen



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginSignupChoiceScreen">
        {/* Login/Signup choice screen */}
        <Stack.Screen
          name="LoginSignupChoiceScreen"
          component={LoginSignupChoiceScreen}
          options={{ headerShown: false }} // Hide the top header
        />
        {/* Login page */}
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

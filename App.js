import React from 'react';
import LoginSignupChoicePage from './App/LoginSignupChoicePage';
import TermsAndConditionsPage from './App/TermsAndConditions';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginSignupChoice">
        {/* Login/Signup Choice Page */}
        <Stack.Screen
          name="LoginSignupChoice"
          component={LoginSignupChoicePage}
          options={{ headerShown: false }}
        />

        {/* Terms and Conditions Page */}
        <Stack.Screen
          name="TermsConditions"
          component={TermsAndConditionsPage}
          options={{ title: 'Terms & Conditions' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

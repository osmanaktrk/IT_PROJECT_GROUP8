import React from 'react';
import LoginSignupChoicePage from './App/LoginSignupChoicePage'; './App/LoginSignupChoicePage.js'; //Import the RegisterScreen
import TermsAndConditionsPage from './App/TermsAndConditions';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

export default function App() {
  return <LoginSignupChoicePage />; 
  return (
    <NavigatorContainer>
      <Stack.Navigator>
        <Stack.Screen name="TermsConditions" component={TermsAndConditionsPage} />
        </Stack.Navigator>
    </NavigatorContainer>
  )
}



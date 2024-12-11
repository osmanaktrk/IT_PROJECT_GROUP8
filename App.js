import React from "react";


import FrontPage from "./src/pages/FrontPage";

import { NavigationContainer } from '@react-navigation/native'; // For managing navigation
import { createStackNavigator } from '@react-navigation/stack'; // For creating a navigation stack
import LoginSignupChoiceScreen from './src/pages/LoginSignupChoiceScreen';  //Add Login/Signup choice 
import LoginScreen from './src/pages/LoginScreen'; // Add Login screen



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="FrontPage"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="FrontPage" component={FrontPage} />
        <Stack.Screen
          name="LoginSignupChoicePage"
          component={LoginSignupChoicePage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

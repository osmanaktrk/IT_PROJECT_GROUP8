import React from "react";


import FrontPage from "./src/pages/FrontPage";

import { NavigationContainer } from '@react-navigation/native'; // For managing navigation
import { createStackNavigator } from '@react-navigation/stack'; // For creating a navigation stack
import LoginSignupChoiceScreen from './src/pages/LoginSignupChoiceScreen';  //Add Login/Signup choice 
import LoginScreen from './src/pages/LoginScreen'; // Add Login screen


import LoginSignupChoicePage from './App/LoginSignupChoicePage'; // Pas dit pad aan naar jouw bestand
import HomePage from './App/Homepage'; // Zorg ervoor dat je een HomePage hebt

const Stack = createStackNavigator();

function App() {
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
          options={{ headerShown: false }} // Verberg de header
          />
        <Stack.Screen
 name="HomePage"
 component={HomePage}
 options={{ headerShown: false }} // Verberg de header
/>
</Stack.Navigator>
</NavigationContainer>
);
}

export default App;
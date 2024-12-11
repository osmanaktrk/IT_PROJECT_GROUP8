import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginSignupChoicePage from './App/LoginSignupChoicePage'; // Pas dit pad aan naar jouw bestand
import HomePage from './App/Homepage'; // Zorg ervoor dat je een HomePage hebt

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginSignupChoicePage">
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

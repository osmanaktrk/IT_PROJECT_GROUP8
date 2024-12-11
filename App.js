import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FrontPage from './App/FrontPage';
import LoginSignupChoiceScreen from './App/LoginSignupChoiceScreen'; // Pas dit pad aan naar jouw bestand
import HomePage from './App/Homepage'; // Zorg ervoor dat je een HomePage hebt

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FrontPage" screenOptions={{ headerShown: false }}>
        {/* Front Page */}
        <Stack.Screen name="FrontPage" component={FrontPage} />

        {/* Login/Signup Choice Page */}
        <Stack.Screen name="LoginSignupChoiceScreen" component={LoginSignupChoiceScreen} />

        {/* Home Page */}
        <Stack.Screen name="HomePage" component={HomePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FrontPage from "./src/pages/FrontPage";
import LoginSignupChoicePage from "./src/pages/LoginSignupChoicePage";

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

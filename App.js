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
import ConfirmPasswordResetScreen from './App/ConfirmPasswordResetScreen';
import SignUpScreen from "./App/SignUpScreen";
import VerifyEmailScreen from './App/VerifyEmailScreen';
import TermsAndConditions from './App/TermsAndConditions';
import UpdateProfile from './App/UpdateProfile';
import { LoaderProvider } from "./App/LoaderContextPage";
//test Pages

import TestHomePage from './App/TestDatabase/TestHomePage';
import TestProfilePage from './App/TestDatabase/TestProfilePage';

//Test Pages
import PointsInfo from './App/PointsInfo';
import HistoryScreen from './App/HistoryScreen'; 

//import MyPoints from './App/MyPoints';
const Stack = createStackNavigator();

function App() {
  return (
    <LoaderProvider>

    
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

        {/* PointsInfo Page */}
        <Stack.Screen
          name="PointsInfo"
          component={PointsInfo}
        />

        {/* TermsAndconditions Page */}
        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndConditions}
        />

        {/* Login Page */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />

        {/* SignUpScreen Page */}
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        
        {/* VerifyEmailScreen Page */}
        <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />

        {/* ForgetPasswordScreen Page */}
        <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen}/>

        {/* VerifyCodeScreen Page */}
        <Stack.Screen name="VerifyCodeScreen" component={VerifyCodeScreen} />

        {/* UpdatePasswordScreen Page */}
        <Stack.Screen name="UpdatePasswordScreen" component={UpdatePasswordScreen} />

        {/* ConfirmPasswordResetScreen Page */}
        <Stack.Screen name="ConfirmPasswordResetScreen" component={ConfirmPasswordResetScreen} />



        {/* Home Page */}
        <Stack.Screen name="HomePage" component={HomePage} />


        {/* HistoryScreen Page */}
        <Stack.Screen name="HistoryScreen" component={HistoryScreen} />


        {/* UpdateProfile Page */}
        <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
        {/* Test Pages */}
        <Stack.Screen name="TestHomePage" component={TestHomePage} />
        <Stack.Screen name="TestProfilePage" component={TestProfilePage} />



        {/* Test Pages */}
      </Stack.Navigator>
    </NavigationContainer>
    </LoaderProvider>
  );
}

export default App;

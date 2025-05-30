import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";

import LoginScreen from "./src/LoginScreen";
import MainScreen from "./src/MainScreen";
import SettingsScreen from "./src/SettingsScreen";
import AllBins from "./src/AllBins";
import RegisterScreen from "./src/RegisterScreen";
import { BinsProvider } from "./src/BinsContext";

const Stack = createStackNavigator();

const App = () => {
  return (
    <BinsProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" />
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AllBins"
            component={AllBins}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </BinsProvider>
  );
};

export default App;

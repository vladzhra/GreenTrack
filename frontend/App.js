import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { TransitionPresets } from "@react-navigation/stack";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";

import MainScreen from "./src/screens/MainScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.ModalFadeTransition,
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ title: "Accueil" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

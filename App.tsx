import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Preload from "./components/preload/Preload";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import Register from "./components/register/Register";
import {
  OpenSans_400Regular,
  OpenSans_700Bold,
  OpenSans_300Light,
  useFonts,
} from "@expo-google-fonts/open-sans";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import * as SplashScreen from "expo-splash-screen";
import { NativeWindStyleSheet } from "nativewind";
import { BackHandler, Alert, StatusBar } from "react-native";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, 
});

NativeWindStyleSheet.setOutput({
  default: "native",
});

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    OpenSans_300Light,
    Caveat_400Regular,
  });

  const stackScreens = [
    { name: "Preload", component: Preload },
    { name: "Login", component: Login },
    { name: "Register", component: Register},
    { name: "Home", component: Home },
  ]

  useEffect(() => {
    StatusBar.setBackgroundColor("#0A0A0A");
    StatusBar.setBarStyle("light-content");
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    loadAsyncResources();
  }, [fontsLoaded]);

  const loadAsyncResources = async () => {
    try {
      await SplashScreen.preventAutoHideAsync();
      fontsLoaded;
      await SplashScreen.hideAsync();
    } catch (error) {
      console.error("Błąd ładowania zasobów:", error);
    }
  };
  const backAction = () => {
    Alert.alert("Attention!", "The back button is blocked on this screen.");
    return true;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Preload">
        {stackScreens.map((screen) => <Stack.Screen key={screen.name} name={screen.name} component={screen.component} options={{ headerShown: false }} />)}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

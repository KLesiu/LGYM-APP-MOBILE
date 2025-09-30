import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
import * as SplashScreen from "expo-splash-screen";
import {
  OpenSans_400Regular,
  OpenSans_700Bold,
  OpenSans_300Light,
  useFonts,
} from "@expo-google-fonts/open-sans";
import { StatusBar } from "expo-status-bar";
import AppProvider from "./AppContext";

NativeWindStyleSheet.setOutput({ default: "native" });

SplashScreen.preventAutoHideAsync();

const Layout: React.FC = () => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    OpenSans_300Light,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); 
    }
  }, [fontsLoaded]);

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="light" backgroundColor="#000000" />
    </AppProvider>
  );
};

export default Layout;

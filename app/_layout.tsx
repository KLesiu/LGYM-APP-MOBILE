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
import AppProvider from "./AppContext";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './i18n';

NativeWindStyleSheet.setOutput({ default: "native" });

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      retry: false,
    },
  },
});

const Layout: React.FC = () => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    OpenSans_300Light,
  });

  useEffect(() => {
    const hideSplash = async () => {
      if (fontsLoaded) {
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          console.error("Błąd ukrywania splash:", error);
        }
      }
    };
    hideSplash();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false ,gestureEnabled:false,headerBackButtonMenuEnabled:false}} />
        <Toast />
      </AppProvider>
    </QueryClientProvider>
  );
};

export default Layout;

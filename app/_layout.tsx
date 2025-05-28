import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NativeWindStyleSheet } from "nativewind";
import {
  OpenSans_400Regular,
  OpenSans_700Bold,
  OpenSans_300Light,
  useFonts,
} from "@expo-google-fonts/open-sans";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import { NavigationContainer } from "@react-navigation/native";

NativeWindStyleSheet.setOutput({ default: "native" });

SplashScreen.preventAutoHideAsync();

const Layout: React.FC = () => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    OpenSans_300Light,
    Caveat_400Regular,
  });

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

  return (
    <NavigationContainer>
      <Stack screenOptions={{ headerShown: false }} />
    </NavigationContainer>
  );
};

export default Layout;

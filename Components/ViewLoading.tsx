import { Text, View } from "react-native";
import { useFonts, Teko_700Bold } from "@expo-google-fonts/teko";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
const ViewLoading: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Teko_700Bold,
    Caveat_400Regular,
  });
  useEffect(() => {
    const loadAsyncResources = async () => {
      try {
        SplashScreen.preventAutoHideAsync();
        await fontsLoaded;
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Błąd ładowania zasobów:", error);
      }
    };

    loadAsyncResources();
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return (
      <View className="absolute w-full h-full bg-[#28292a] flex flex-row justify-center items-center">
        <Text className="text-[20] text-white">Loading fonts...</Text>
      </View>
    );
  }
  return (
    <View className="absolute w-full h-full bg-[#28292a] flex flex-row justify-center items-center">
      <Text
        className="text-[30] text-white"
        style={{ fontFamily: "Teko_700Bold" }}
      >
        Loading...
      </Text>
    </View>
  );
};
export default ViewLoading;
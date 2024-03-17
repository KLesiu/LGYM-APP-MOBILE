import logoLGYM from "./img/logoLGYM.png";
import { Text, Image, View } from "react-native";
import { useState, useEffect } from "react";
import {
  useFonts,
  Teko_700Bold,
  Teko_400Regular,
} from "@expo-google-fonts/teko";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import * as SplashScreen from "expo-splash-screen";
import LoadingProps from "./props/LoadingProps";
import ViewLoading from "./ViewLoading";

const Loading: React.FC<LoadingProps> = (props) => {
  const [width, setWidth] = useState<number>(0);
  const [fontsLoaded] = useFonts({
    Teko_700Bold,
    Caveat_400Regular,
    Teko_400Regular,
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
  useEffect(() => {
    if (width === 100) return props.offLoading();
    setTimeout(() => changeWidth(width), 300);
  }, [width]);
  const changeWidth = (width: number) => {
    setWidth(width + 10);
  };
  if (!fontsLoaded) {
    return <ViewLoading />;
  }
  return (
    <View className="bg-black h-full w-full absolute flex flex-col items-center z-[6]" >
      <Image source={logoLGYM} className="w-[70%] h-[40%]" />
      <View className="flex flex-col mx-[5%] mt-[40%] w-[90%]">
        <View className="border-[2px] border-gray-500 w-full rounded-xl h-1/5">
          <View
            style={{
              width: `${width}%`,
            }}
            className="bg-gray-500 rounded-xl h-full z-[7]"
          ></View>
        </View>
        <Text
          style={{
            fontFamily: "Teko_400Regular"
          }}
          className="text-[40px] text-white text-center w-full mt-12"
        >
          Loading...
        </Text>
      </View>
    </View>
  );
};
export default Loading;

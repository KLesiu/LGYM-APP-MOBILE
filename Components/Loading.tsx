import logoLGYM from "./img/logoLGYM.png";
import { Text, Image, View } from "react-native";
import { LoadingStyles } from "./styles/LoadingStyles";
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
    setTimeout(() => changeWidth(width), 200);
  }, [width]);
  const changeWidth = (width: number) => {
    setWidth(width + 10);
  };
  if (!fontsLoaded) {
    return <ViewLoading />;
  }
  return (
    <View style={LoadingStyles.loadingContainer}>
      <Image source={logoLGYM} style={LoadingStyles.logoLGYMAPP} />
      <View style={LoadingStyles.loadingDiv}>
        <View style={LoadingStyles.loadingHolder}>
          <View
            style={{
              backgroundColor: "grey",
              borderRadius: 10,
              height: "100%",
              width: `${width}%`,
              zIndex: 7,
            }}
          ></View>
        </View>
        <Text
          style={{
            fontFamily: "Teko_400Regular",
            ...LoadingStyles.loadingDivP,
          }}
        >
          Loading...
        </Text>
      </View>
    </View>
  );
};
export default Loading;

import { TextInput, TouchableOpacity, View, Text } from "react-native";
import ImportPlanPopUpProps from "./props/ImportPlanPopUpProps";
import { useEffect, useState } from "react";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import * as SplashScreen from "expo-splash-screen";

import { Teko_700Bold } from "@expo-google-fonts/teko";
import { useFonts } from "expo-font";
import ViewLoading from "./ViewLoading";
const ImportPlanPopUp: React.FC<ImportPlanPopUpProps> = (props) => {
  const [userId, setUserId] = useState<string>();
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
  const importPlan = (): void => {
    props.setImportPlan(userId as string);
  };
  if (!fontsLoaded) {
    return <ViewLoading />;
  }
  return (
    <View className="absolute w-full h-full top-0 flex flex-col items-center justify-center bg-[#000000f4]">
      <Text className="text-white text-[20px] text-center" style={{ fontFamily: "Teko_700Bold"}}>
        If you want to copy someone plan you need to have a userId!
      </Text>
      <TextInput
        className="rounded-xl h-[6%] text-[15px] w-4/5 border-[#3c3c3c] border-[2px] mt-[5px] pl-[15px] text-white"
        placeholder="UserID"
        onChangeText={(text: string | "") => setUserId(text)}
      ></TextInput>
      <TouchableOpacity
      className="w-1/2 h-[10%] rounded-xl bg-[#aab4bd] flex justify-center items-center mt-[5%]"

        onPress={() => importPlan()}
      >
        <Text style={{ fontFamily: "Teko_700Bold", fontSize: 25 }}>COPY!</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ImportPlanPopUp;

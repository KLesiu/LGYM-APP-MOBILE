import {
  Text,
  Image,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import backgroundLogo from "./img/backgroundLGYMApp500.png";
import { useFonts, Teko_700Bold } from "@expo-google-fonts/teko";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import deadLiftIcon from "./img/dlIcon.png";
import benchPressIcon from "./img/benchpressIcon.png";
import squatIcon from "./img/squatIcon.png";
import RecordsPopUp from "./RecordsPopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewLoading from "./ViewLoading";
const Records: React.FC = () => {
  const [deadLift, setDeadLift] = useState<number>();
  const [squat, setSquat] = useState<number>();
  const [benchPress, setBenchPress] = useState<number>();
  const [total, setTotal] = useState<number>();
  const [popUp, setPopUp] = useState<boolean>(false);
  const [viewLoading, setViewLoading] = useState<boolean>(true);
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
  useEffect(() => {
    getDataFromStorage();
  }, [popUp]);

  const chagePopUpValue: VoidFunction = (): void => {
    setPopUp(false);
  };
  const getDataFromStorage = async (): Promise<void> => {
    const dl = await AsyncStorage.getItem("dl");
    const sq = await AsyncStorage.getItem("sq");
    const bp = await AsyncStorage.getItem("bp");
    setDeadLift(dl ? parseFloat(dl!) : 0);
    setBenchPress(bp ? parseFloat(bp!) : 0);
    setSquat(sq ? parseFloat(sq!) : 0);
    setTotal(parseFloat(dl!) + parseFloat(sq!) + parseFloat(bp!));
    setViewLoading(false);
  };
  if (!fontsLoaded) {
    return <ViewLoading />;
  }
  return (
    <ImageBackground source={backgroundLogo} className="h-[79%] w-[98%] mx-[1%] flex-1 flex justify-center items-center opacity-100 ">
      <View className="rounded-tl-10 rounded-tr-10 bg-[#fffffff7] h-[99%] w-full z-[2] flex flex-row flex-wrap justify-center">
        <Text className="border-b-white border-b-2 pb-[2px] text-center w-[70%] text-2xl" style={{ fontFamily: "Teko_700Bold"}}>
          Records in powerlifting:
        </Text>
        <View className="items-center w-full mt-[5%] flex justify-center flex-row bg-[#b8babd]">
          <Image className="w-[7%] h-[70%] mb-[1%]" source={deadLiftIcon} />
          <Text style={{ fontFamily: "Teko_700Bold"}} className="ml-[1%] text-xl">
            Dead Lift:
          </Text>
        </View>
        <Text style={{ fontFamily: "Teko_700Bold"}} className="w-full text-center text-[40px]">
          {deadLift || 0} kg
        </Text>
        <View className="items-center w-full mt-[5%] flex justify-center flex-row bg-[#b8babd]">
          <Image className="w-[7%] h-[70%] mb-[1%]" source={squatIcon} />
          <Text style={{ fontFamily: "Teko_700Bold"}} className="ml-[1%] text-xl">
            Squat:
          </Text>
        </View>
        <Text style={{ fontFamily: "Teko_700Bold"}} className="w-full text-center text-[40px]">
          {squat || 0} kg
        </Text>
        <View className="items-center w-full mt-[5%] flex justify-center flex-row bg-[#b8babd]">
          <Image className="w-[7%] h-[70%] mb-[1%]" source={benchPressIcon} />
          <Text style={{ fontFamily: "Teko_700Bold"}} className="ml-[1%] text-xl">
            Bench Press:
          </Text>
        </View>
        <Text style={{ fontFamily: "Teko_700Bold"}} className="w-full text-center text-[40px]">
          {benchPress || 0} kg
        </Text>
        <Text className="w-[70%] text-2xl border-b-white border-b-2 text-center" style={{ fontFamily: "Teko_700Bold"}}>
          Your total is: {total || 0} kg
        </Text>
        <TouchableOpacity
          onPress={() => setPopUp(true)}
          className="w-3/5 h-[10%] mt-[15%] rounded-xl bg-[#aab4bd] flex justify-center items-center"
        >
          <Text
          className="text-2xl"
            style={{ fontFamily: "Teko_700Bold"}}
          >
            Update Records
          </Text>
        </TouchableOpacity>
        {popUp ? <RecordsPopUp offPopUp={chagePopUpValue} /> : ""}
        {viewLoading ? <ViewLoading /> : ""}
      </View>
    </ImageBackground>
  );
};
export default Records;

import {
  Text,
  View,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import {
  OpenSans_400Regular,
  OpenSans_700Bold,
  OpenSans_300Light,
  useFonts,
} from "@expo-google-fonts/open-sans";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorMsg from "./types/ErrorMsg";
import Training from "./types/Training";
import ViewLoading from "./ViewLoading";
import ReactNativeCalendarStrip from "react-native-calendar-strip";
import TrainingSession from "./TrainingSession";
const History: React.FC = () => {
  const calendar = useRef(null);
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    OpenSans_300Light,
  });
  const [session,setSession]=useState<Training>()
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
  const getTrainingByDate = async (dateObject: any): Promise<void> => {
    const date: Date = new Date(dateObject._d);
    setSession(undefined)
    if (!date) return;
    const id = await AsyncStorage.getItem("id");
    const response: ErrorMsg | Training = await fetch(
      `${process.env.REACT_APP_BACKEND}/api/${id}/getTraining`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          createdAt: date,
        }),
      }
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => res);
      if('exercises' in response)setSession(response as Training)
      else setSession(undefined)
        
      
      
      
    };
  if (!fontsLoaded) {
    return <ViewLoading />;
  }

  return (
    <View className="flex flex-col h-[78%] p-4 ">
      <Text
        style={{ fontFamily: "OpenSans_700Bold" }}
        className="w-full text-2xl text-white font-bold py-6"
      >
        Training history
      </Text>
      <ReactNativeCalendarStrip
        onDateSelected={getTrainingByDate}
        ref={calendar}
        iconLeftStyle={{
          backgroundColor: "#4CD964",
          height: 20,
          width: 20,
          borderRadius: 5,
        }}
        iconRightStyle={{
          backgroundColor: "#4CD964",
          height: 20,
          width: 20,
          borderRadius: 5,
        }}
        scrollable
        style={{ height: 100 }}
        calendarColor={"#131313"}
        calendarHeaderStyle={{ color: "white" }}
        dateNumberStyle={{ color: "#5A5A5A" }}
        dateNameStyle={{ color: "#5A5A5A" }}
        highlightDateContainerStyle={{
          backgroundColor: "#4CD964",
          borderRadius: 5,
        }}
        highlightDateNumberContainerStyle={{
          backgroundColor: "#4CD964",
          borderRadius: 5,
        }}
        iconContainer={{ flex: 0.1 }}
      />
            {session?<TrainingSession training={session}/>:
      <View className="flex justify-center w-full h-1/2 items-center p-4">
          <Text style={{fontFamily:'OpenSans_700Bold'}} className="text-white text-xl text-center">You dont have training session this day!</Text>
        </View>}
    </View>
  );
};
export default History;

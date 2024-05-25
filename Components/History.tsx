import {
  Text,
  View,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorMsg from "./types/ErrorMsg";
import Training from "./types/Training";
import ReactNativeCalendarStrip from "react-native-calendar-strip";
import TrainingSession from "./TrainingSession";
import ViewLoading from "./ViewLoading";
const History: React.FC = () => {
  const calendar = useRef(null);
  const [session,setSession]=useState<Training>()
  const [viewLoading,setViewLoading]=useState<boolean>(false)
  useEffect(()=>{
    setViewLoading(true)
    const initialDateObj = {_d:new Date()}
    getTrainingByDate(initialDateObj)
  },[])
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
    setViewLoading(false)
    };
  return (
    <View className="relative h-[78%]">
      <View className="flex flex-col h-full p-4">
      <ReactNativeCalendarStrip
        onDateSelected={getTrainingByDate}
        ref={calendar}
        selectedDate={new Date()}
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
      {viewLoading?<ViewLoading/>:<Text></Text>}
    </View>
  );
};
export default History;

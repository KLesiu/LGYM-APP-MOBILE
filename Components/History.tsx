import {
  Text,
  View,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorMsg from "./types/ErrorMsg";
import Training,{TrainingsDates} from "./types/Training";
import ReactNativeCalendarStrip from "react-native-calendar-strip";
import TrainingSession from "./TrainingSession";
import ViewLoading from "./ViewLoading";
import HistoryProps from "./props/HistoryProps";
import { TrainingByDate, TrainingByDateDetails } from "./interfaces/Training";
import { Message } from "./enums/Message";
const History: React.FC<HistoryProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const calendar = useRef(null);
  const [trainings,setTrainings]=useState<TrainingByDateDetails[]>()
  const [viewLoading,setViewLoading]=useState<boolean>(false)
  useEffect(()=>{
    setViewLoading(true)
    const initialDateObj = {_d:new Date()}
    getTrainingByDate(initialDateObj)
  },[])

  const getTrainingByDate = async (dateObject: any): Promise<void> => {
    const date: Date = new Date(dateObject._d);
    if (!date) return;
    const id = await AsyncStorage.getItem("id");
    const response: Message | TrainingByDateDetails[] = await fetch(
      `${apiURL}/api/${id}/getTrainingByDate`,
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
      .then((res) => res)
      .catch((err) => err)
      .then((res) => res.json());
      if(Array.isArray(response)){
        setTrainings(response)
      }else{
        setTrainings([])
      }
    setViewLoading(false)
    };
  return (
    <View className="bg-[#121212] flex-1 w-full relative">
      <View className="flex flex-col h-full p-4">
      <ReactNativeCalendarStrip
        onDateSelected={getTrainingByDate}
        ref={calendar}
        selectedDate={new Date()}
        iconLeftStyle={{
          backgroundColor: "#94e798",
          height: 25,
          width: 25,
          borderRadius: 5,
        }}
        iconRightStyle={{
          backgroundColor: "#94e798",
          height: 25,
          width: 25,
          borderRadius: 5,
        }}
        markedDates={props.trainingsDates}
        scrollable
        style={{ height: 150 }}
        calendarColor={"#131313"}
        dayContainerStyle={{height:40,width:40}}
        calendarHeaderStyle={{ color: "white",fontSize:22 }}
        dateNumberStyle={{ color: "#5A5A5A",fontSize:14 }}
        dateNameStyle={{ color: "#5A5A5A",fontSize:11 }}
        highlightDateContainerStyle={{
          backgroundColor: "#94e798",
          borderRadius: 5,
        }}
        highlightDateNumberContainerStyle={{
          backgroundColor: "#94e798",
          borderRadius: 5,
        }}
        highlightDateNameStyle={{
          fontSize:11,

        }}
        highlightDateNumberStyle={{
          fontSize:14,
        }}
        iconContainer={{ flex: 0.1 }}
      />
            {trainings && trainings.length?<TrainingSession trainings={trainings}/>:
      <View className="flex justify-center w-full h-1/2 items-center p-4">
          <Text style={{fontFamily:'OpenSans_700Bold'}} className="text-white text-xl text-center">You dont have training session this day!</Text>
        </View>}
      </View>
      {viewLoading?<ViewLoading/>:<Text></Text>}
    </View>
  );
};
export default History;

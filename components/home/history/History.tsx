import { Text, View } from "react-native";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MarkedDates } from "../../../interfaces/Training";
import ReactNativeCalendarStrip from "react-native-calendar-strip";
import TrainingSession from "./TrainingSession";
import ViewLoading from "../../elements/ViewLoading";
import { TrainingByDateDetails } from "../../../interfaces/Training";
import { Message } from "../../../enums/Message";
const History: React.FC = () => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const calendar = useRef(null);
  const [trainings, setTrainings] = useState<TrainingByDateDetails[]>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [trainingDates,setTrainingDates]= useState<MarkedDates[]>([]);
  useEffect(() => {
    init()
  }, []);


const init = async()=>{
  setViewLoading(true);
  await getTrainingDates();
  const initialDateObj = { _d: new Date() };
  await getTrainingByDate(initialDateObj);
  setViewLoading(false);
}


  const getTrainingByDate = async (dateObject: any): Promise<void> => {
    const date: Date = new Date(dateObject._d);
    if (!date) return;
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
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
    const result: Message | TrainingByDateDetails[]= await response.json()
    if (Array.isArray(result)) {
      setTrainings(result);
    } else {
      setTrainings([]);
    }
  };
  const getTrainingDates = async():Promise<void>=>{
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${apiURL}/api/${id}/getTrainingDates`)
    const data:Date[] = await response.json();
    const markedDates:MarkedDates[] = data.map((date:Date)=>({
      date:date,
      dots:[{color:'#94e798'}]
    }))
    setTrainingDates(markedDates);
  }
  return (
    <View className="bg-[#121212] flex-1 w-full relative">
      <View className="flex flex-col h-full p-4">
        <ReactNativeCalendarStrip
          onDateSelected={getTrainingByDate}
          ref={calendar}
          selectedDate={new Date()}
          iconLeftStyle={{
            height: 15,
            width: 15,
          }}
          iconRightStyle={{
            height: 15,
            width: 15,
          }}
          markedDates={trainingDates}
          scrollable
          style={{width:'100%',height:150}}
          calendarColor={"#131313"}
          dayContainerStyle={{backgroundColor:'rgb(40, 40, 40)',borderRadius:8,padding:4 }}
          calendarHeaderStyle={{ color: "white", fontSize: 22,paddingBottom:16 }}
          dateNumberStyle={{ color: "#5A5A5A", fontSize: 16 }}
          dateNameStyle={{ color: "#5A5A5A", fontSize: 14 }}
          highlightDateContainerStyle={{
            backgroundColor: "#94e798",
          }}
          highlightDateNumberContainerStyle={{
            backgroundColor: "#94e798",
          }}
          highlightDateNameStyle={{
            fontSize: 14,
          }}
          highlightDateNumberStyle={{
            fontSize: 16,
          }}
          iconContainer={{
            height: 30,
            width: 30,
            backgroundColor: "#94e798",
            borderRadius:4,
          }}
          numDaysInWeek={5}
        />
        {trainings && trainings.length ? (
          <TrainingSession  trainings={trainings} />
        ) : (
          <View className="flex justify-center w-full h-1/2 items-center p-4">
            <Text
              style={{ fontFamily: "OpenSans_700Bold" }}
              className="text-white text-xl text-center"
            >
              You dont have training session this day!
            </Text>
          </View>
        )}
      </View>
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </View>
  );
};
export default History;

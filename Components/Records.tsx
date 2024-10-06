import {
  Text,
  View,
  ScrollView,
  Pressable,
  Image
} from "react-native";
import { useEffect, useState } from "react";
import RecordsPopUp from "./RecordsPopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewLoading from "./ViewLoading";
import RecordsProps from "./props/RecordsProps";
import { MainRecordsLast } from "./interfaces/MainRecords";
import Remove from "./img/icons/remove.png";
import Progress from "./img/icons/progress.png"

const Records: React.FC<RecordsProps> = (props) => {
  const [popUp, setPopUp] = useState<boolean>(false);
  const [records, setRecords] = useState<MainRecordsLast[]>([]); // Tablica dla gridu
  const [viewLoading, setViewLoading] = useState<boolean>(true);
  const [exercise,setExercise]= useState<string | undefined>();

  useEffect(() => {
    getRecords();
  }, []);

  const chagePopUpValue: VoidFunction = (): void => {
    setPopUp(false);
    props.toggleMenuButton(false);
  };
  const showPopUp = ()=>{
    props.toggleMenuButton(true);
    setPopUp(true);
  }
  const updateSettedExerciseRecord = (exerciseId:string | undefined):void=>{
    if(!exerciseId) return;
    setExercise(exerciseId)
    showPopUp()
  }
  const getRecords = async () => {
    const id = await AsyncStorage.getItem("id");
    const response: MainRecordsLast[] = await fetch(
      `${process.env.REACT_APP_BACKEND}/api/mainRecords/${id}/getLastMainRecords`
    )
      .then((res) => res.json())
      .catch((err) => err);
    setRecords(response);
    props.toggleMenuButton(false);
    setViewLoading(false);
  };
  const deleteRecord = async(recordId:string | undefined)=>{
    if(!recordId) return;
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/mainRecords/${recordId}/deleteMainRecord`)
      .then(res=>res.json()).catch(err=>err)
      await getRecords()
  }
  return (
    <View className="flex flex-1 relative w-full bg-[#121212]">
      {popUp ? (
        <RecordsPopUp offPopUp={chagePopUpValue} exerciseId={exercise} />
      ) : (
        <View
          style={{ gap: 16 }}
          className="flex flex-col items-center w-full h-full"
        >
          {viewLoading ? (
            <ViewLoading />
          ) : (
            <ScrollView
              className="w-full smh:h-52 mdh:h-96"
              contentContainerStyle={{ padding: 10 }}
            >
              {records && records.length ?    <View className="flex flex-col w-full" style={{ gap: 8 }}>
                {records.map((record) => (
                  <View
                    key={record._id}
                    className="w-full bg-[#282828]  p-4 rounded-lg"
                  >
                    <View  className="flex flex-row justify-between">
                      <Text
                        style={{
                          fontFamily: "OpenSans_700Bold",
                        }}
                        className="text-xl font-bold text-[#94e798]"
                      >
                        {record.exerciseDetails.name}
                      </Text>
                      <View style={{ gap: 16 }} className="flex flex-row">
                        <Pressable
                        onPress={()=>updateSettedExerciseRecord(record.exerciseDetails._id)}
                         
                        >
                          <Image className="w-6 h-6" source={Progress} />
                        </Pressable>
                        <Pressable
                         onPress={()=>deleteRecord(record._id)}
                        >
                          <Image className="w-6 h-6" source={Remove} />
                        </Pressable>
                      </View>
                    </View>

                    <Text
                      style={{ fontFamily: "OpenSans_400Regular" }}
                      className="text-base text-white"
                    >
                      Weight: {record.weight} {record.unit}
                    </Text>
                    <Text
                      style={{ fontFamily: "OpenSans_400Regular" }}
                      className="text-base text-white"
                    >
                      Date: {new Date(record.date).toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View> : <></>}
           
            </ScrollView>
          )}
          <Pressable
            onPress={()=>{
              setExercise(undefined)
              showPopUp()
            }}
            className="h-20 w-80 rounded-lg py-4 px-2 m-0 bg-[#94e798] flex justify-center items-center"
          >
            <Text
              className="text-base w-full text-center text-[#131313]"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              ADD NEW RECORDS
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Records;

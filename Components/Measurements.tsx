import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Pressable, ScrollView } from "react-native";
import { MeasurementForm } from "./types/Measurements";
import AddMeasurementsPopUp from "./AddMeasurementsPopUp";

const Measurements: React.FC = () => {
  const [measurements, setMeasurements] = useState<JSX.Element[]>([]);
  const [measurementsObject,setMeasurementsObject]=useState<MeasurementForm | undefined>()
  const [isFormShow,setIsFormShow]=useState<boolean>(false)
  useEffect(() => {
    renderMeasurementsTemplates();
  }, []);
  const hideForm = ()=>{
    setIsFormShow(false)
    setMeasurements([])
    renderMeasurementsTemplates()
  }
  const renderMeasurementsTemplates = async () => {
    const id = await AsyncStorage.getItem("id");
    let holderForResponse:MeasurementForm
    const response: MeasurementForm = await fetch(
      `${process.env.REACT_APP_BACKEND}/api/measurements/${id}/getLast`
    )
      .then((res) => res.json())
      .catch((err) => err);
    if ("msg" in response){
        holderForResponse={
          weight:0,
          neck:0,
          chest:0,
          biceps:0,
          waist:0,
          abdomen:0,
          hips:0,
          thigh:0,
          calf:0
        }
    }else{
      holderForResponse=response
    } 
    const keys = Object.keys(holderForResponse);
    const values = Object.values(holderForResponse);
    setMeasurementsObject(holderForResponse)
    setMeasurements(
      keys.map((ele: string, index: number) => {
        return (
          <View className="flex flex-row py-2 pl-6 justify-between items-center m-0">
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="text-gray-200/80 font-light leading-4 text-sm"
            >
              {ele}
            </Text>
            <View className="bg-[#1E1E1E73] w-36 h-16 py-4 px-6 rounded-lg flex justify-center items-center m-0">
              <Text
                style={{ fontFamily: "OpenSans_400Regular" }}
                className="text-gray-200/80 font-base leading-4 text-md"
              >
                {values[index]} {index===0?'kg':'cm'}
              </Text>
            </View>
          </View>
        );
      })
    );
  };
  return (
    <View className="bg-[#131313] flex flex-col px-1">
        <ScrollView className="w-full  smh:h-56 xsmh:h-72 mdh:h-80 lgh:h-96" >
        {measurements.length > 0?measurements:''}
        </ScrollView>

      <Pressable onPress={()=>setIsFormShow(true)} className="w-full h-12 rounded-lg smh:py-2 smh:px-4 mdh:py-4 mdh:px-6 gap-1 m-0  bg-[#4CD964] flex justify-center items-center">
        <Text
          className="text-lg text-black"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Update Measurements
        </Text>
      </Pressable>
      {isFormShow && measurementsObject?<AddMeasurementsPopUp hideForm={hideForm} measurements={measurementsObject}/>:''}
    </View>
  );
};
export default Measurements;

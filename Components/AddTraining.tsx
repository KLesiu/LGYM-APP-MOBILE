import {
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ViewLoading from "./ViewLoading";
import MiniLoading from "./MiniLoading";
import useInterval from "./helpers/hooks/useInterval";
import TrainingPlanDay from "./TrainingPlanDay";
import AddTrainingProps from "./props/AddTrainingProps";


const AddTraining: React.FC<AddTrainingProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [isAddTrainingActive, setIsAddTrainingActive] =
    useState<boolean>(false);
  const [dayId, setDayId] = useState<string>();
  const [isUserHavePlan,setIsUserHavePlan] = useState<boolean>(false); 
  const [chooseDay, setChooseDay] = useState<JSX.Element>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);


  useInterval(() => {
  }, 1000);
  useEffect(() => {
    setViewLoading(true);
    checkIsUserHavePlan()
    setViewLoading(false);
  }, []);


  const checkIsUserHavePlan = async()=>{
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${apiURL}/api/${id}/checkIsUserHavePlan`).then(res=>res.json()).catch(err=>err)
    setIsUserHavePlan(response)
  }
  const getInformationsAboutPlanDays: VoidFunction = async (): Promise<void> => {
      setLoading(true);
      const id = await AsyncStorage.getItem("id");
      const trainingTypes = await fetch(
        `${apiURL}/api/planDay/${id}/getPlanDaysTypes`
      )
        .then((res) => res.json())
        .catch((err) => err)
    

      setChooseDay(
        <View className="items-center bg-[#131313] flex flex-col justify-start gap-y-5  h-full absolute m-0 w-full top-0">
          <Text
          className="text-3xl text-white"
            style={{ fontFamily: "OpenSans_700Bold"}}
          >
            Choose training day!
          </Text>
          {trainingTypes.map((ele:{_id:string,name:string}) => (
            <TouchableOpacity
              onPress={() => showDaySection(ele._id, false)}
              className="items-center border-[#868686] border-[1px] rounded-xl flex text-[10px] justify-center mt-5 h-[10%] opacity-100 w-[70%]"
              key={ele._id}
            >
              <Text
              className="text-white text-3xl"
                style={{
                  fontFamily: "OpenSans_700Bold",
                }}
              >
                {ele.name}
              </Text>
            </TouchableOpacity>
          ))}
          {loading ? <MiniLoading /> :<Text></Text>}
        </View>
      );
      setLoading(false);
    };
    const resetChoosePlanDay=()=>{
      setChooseDay(<></>)
    }
  const showDaySection = async (
    day: string,
    session: boolean
  ): Promise<void> => {
    setViewLoading(true);

    setIsAddTrainingActive(true);
    setDayId(day);
    setViewLoading(false);
    props.toggleMenuButton(true);
  };
  const hideDaySection = () =>{
    setIsAddTrainingActive(false)
    setDayId('')
    props.toggleMenuButton(false)
  }

  return (
    <View className="bg-[#131313] flex-1 w-full">
      {isUserHavePlan ? (
        <View className="relative  flex flex-col justify-center items-center h-full w-full">
          <TouchableOpacity onPress={getInformationsAboutPlanDays}>
            <Icon
              style={{ fontSize: 140, color: "#4CD964" }}
              name="plus-circle"
            />
          </TouchableOpacity>
          {loading ? <MiniLoading /> : <Text></Text>}
          {}
          {chooseDay}
          {isAddTrainingActive && dayId ? (
            <TrainingPlanDay
              hideChooseDaySection={resetChoosePlanDay}
              hideDaySection={hideDaySection}
              dayId={dayId}
            />
          ) : (
            <></>
          )}
        </View>
      ) : (
        <View className="w-full h-full flex flex-row justify-center text-center text-2xl items-center p-4">
          <Text
            className="text-white text-xl text-center"
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            You cant add training, because you dont have plan!
          </Text>
        </View>
      )}
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </View>
  );
};
export default AddTraining;

import {
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ViewLoading from "./ViewLoading";
import MiniLoading from "./MiniLoading";
import useInterval from "./helpers/hooks/useInterval";
import TrainingPlanDay from "./TrainingPlanDay";
import AddTrainingProps from "./props/AddTrainingProps";
import { TrainingSessionScores } from "./interfaces/Training";
import { ExerciseScoresTrainingForm } from "./interfaces/ExercisesScores";
import { WeightUnits } from "./enums/Units";
import { Message } from "./enums/Message";


const AddTraining: React.FC<AddTrainingProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [isAddTrainingActive, setIsAddTrainingActive] =
    useState<boolean>(false);
  
  const [dayId, setDayId] = useState<string>();
  const [isUserHavePlan,setIsUserHavePlan] = useState<boolean>(false); 
  const [chooseDay, setChooseDay] = useState<JSX.Element>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);


  useInterval(() => {setChooseDay
  }, 1000);
  useEffect(() => {
    setViewLoading(true);
    checkIsUserHavePlan()
    checkIsUserHaveActivePlanDayTraining()
    setViewLoading(false);
  }, []);


  const checkIsUserHavePlan = async()=>{
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${apiURL}/api/${id}/checkIsUserHavePlan`).then(res=>res).catch(err=>err).then(res=>res.json())
    setIsUserHavePlan(response)
  }
  const checkIsUserHaveActivePlanDayTraining = async()=>{
    const response = JSON.parse(`${await AsyncStorage.getItem('planDay')}`);
    
    if(response && Object.keys(response).length) setIsAddTrainingActive(true)
  }
  const getInformationsAboutPlanDays: VoidFunction = async (): Promise<void> => {
      setLoading(true);
      const id = await AsyncStorage.getItem("id");
      const trainingTypes = await fetch(
        `${apiURL}/api/planDay/${id}/getPlanDaysTypes`
      )
        .then((res) => res)
        .catch((err) => err).then(res=>res.json());
    

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
              onPress={() => showDaySection(ele._id)}
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

  const getCurrentPlanDayTraining = async()=>{
    const response = await AsyncStorage.getItem('planDay');
    if(!response) return;
    const planDay = JSON.parse(response);
    showDaySection(planDay._id)
  }
  const showDaySection = async (
    day: string,
    
  ): Promise<void> => {
    setViewLoading(true);

    setIsAddTrainingActive(true);
    setDayId(day);
    setViewLoading(false);
    props.toggleMenuButton(true);
  };
  const hideDaySection = () =>{
    setDayId('')
    props.toggleMenuButton(false)
  }
  const hideAndDeleteTrainingSession = async()=>{
    await AsyncStorage.removeItem('planDay')
    await AsyncStorage.removeItem('trainingSessionScores')
    setIsAddTrainingActive(false)
    hideDaySection()
  }
  const addTraining = async(exercises:TrainingSessionScores[])=>{
    const id = await AsyncStorage.getItem("id");
    const type =  dayId;
    const createdAt = new Date();
    const training = exercises.map((ele:TrainingSessionScores)=>{
      const exerciseScoresTrainingForm: ExerciseScoresTrainingForm = {
        exercise: `${ele.exercise._id}`,
        reps: ele.reps,
        series: ele.series,
        weight: ele.weight,
        unit: WeightUnits.KILOGRAMS
      }
      return exerciseScoresTrainingForm
    })
    const response = await fetch(`${apiURL}/api/${id}/addTraining`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({type:type,createdAt:createdAt,exercises:training})
    }).then(res=>res).catch(err=>err).then(res=>res.json())
    if(response.msg === Message.Created){
      await hideAndDeleteTrainingSession()
    }

  }

  return (
    <View className="bg-[#121212] flex-1 w-full">
      {isUserHavePlan ? (
        <View className="relative  flex flex-col justify-center items-center h-full w-full">
          {isAddTrainingActive ?  <Pressable onPress={getCurrentPlanDayTraining}>
            <Icon
              style={{ fontSize: 140, color: "#94e798" }}
              name="play-circle"
            />
          </Pressable> :   <Pressable onPress={getInformationsAboutPlanDays}>
            <Icon
              style={{ fontSize: 140, color: "#94e798" }} 
              name="plus-circle"
            />
          </Pressable> }
        
        
          {loading ? <MiniLoading /> : <Text></Text>}
          {}
          {chooseDay}
          {isAddTrainingActive && dayId ? (
            <TrainingPlanDay
              hideChooseDaySection={resetChoosePlanDay}
              hideDaySection={hideDaySection}
              hideAndDeleteTrainingSession={hideAndDeleteTrainingSession}
              addTraining={addTraining}
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

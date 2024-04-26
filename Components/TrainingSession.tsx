import { View, Text, ScrollView } from "react-native";
import TrainingSessionProps from "./props/TrainingSessionProps";
import {
  OpenSans_400Regular,
  OpenSans_700Bold,
  OpenSans_300Light,
  useFonts,
} from "@expo-google-fonts/open-sans";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import ViewLoading from "./ViewLoading";
import {ExerciseTrainingScaledSession, ExerciseTrainingSession,ScaledExerciseTraining} from './types/Session'
import ExerciseTraining from "./types/ExerciseTraining";
const TrainingSession: React.FC<TrainingSessionProps> = (props) => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    OpenSans_300Light,
  });
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [exercises, setExercises] = useState<ExerciseTrainingScaledSession[]>();
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
    const exercisesData: any = {};
    props.training.exercises.forEach((item) => {
      const [name] = item.field.split("Series");
      const exerciseName = name.trim();
      const score = parseFloat(item.score);

      if (!exercisesData[exerciseName]) {
        exercisesData[exerciseName] = {
          name: exerciseName,
          exercises: [],
        };
      }

      exercisesData[exerciseName].exercises.push({ field: item.field, score });
    },[props.training]);

    const exercisesArray = Object.values(exercisesData as any) as ExerciseTrainingSession[];
    const scaledExercisesArray: ExerciseTrainingScaledSession[] = exercisesArray.map(ele=>{return {name:ele.name,exercises:scaleSeries(ele.exercises)}})
    setExercises(scaledExercisesArray);
  }, []);
  function scaleSeries(data:ExerciseTraining[]) {
    const scaledData = [];
    for (let i = 0; i < data.length; i += 2) {
        const rep = parseInt(data[i].score);
        const weight = parseInt(data[i + 1].score);
        scaledData.push({ [`name`]: `${rep} x ${weight}` });
    }
    return scaledData;
}
  return (
    <View className="h-3/4 p-6">
      <View className="flex py-6 flex-col gap--2">
        <Text
          style={{ fontFamily: "OpenSans_700Bold" }}
          className="text-xl text-[#4CD964]"
        >
          Training {props.training.type}
        </Text>
        <Text style={{fontFamily:'OpenSans_300Light'}} className="text-sm text-[#5A5A5A]">Series: {props.training.exercises.length/2}</Text>
      </View>
      <ScrollView className="w-full h-96 flex flex-col gap-3">
        {exercises?exercises.map(ele=>{
          return(
            <View className="flex flex-col  rounded-lg bg-[#1E1E1E73] p-3">
                <Text style={{fontFamily:'OpenSans_700Bold'}} className="text-[14px] text-white">{ele.name}</Text>
                <View className="flex flex-col px-3">
                  {ele.exercises.map((ele:ScaledExerciseTraining,index:number)=>{
                    index += 1
                    return(
                      <View className="flex justify-between border-b-2 mt-1 border-b-[#5A5A5A] flex-row">
                        <Text style={{fontFamily:'OpenSans_300Light'}} className="text-[14px] text-[#868686] ">Series: {index}</Text>
                        <Text style={{fontFamily:'OpenSans_300Light'}} className="text-[14px] text-[#868686] ">{ele.name}kg</Text>
                      </View>
                    )
                  })}
                </View>
            </View>
          )
        }):''}
      </ScrollView>
      {viewLoading ? <ViewLoading /> : ""}
    </View>
  );
};
export default TrainingSession;

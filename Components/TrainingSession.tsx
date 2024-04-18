import { View,Text,ScrollView } from "react-native"
import TrainingSessionProps from "./props/TrainingSessionProps"
import {
    OpenSans_400Regular,
    OpenSans_700Bold,
    OpenSans_300Light,
    useFonts,
  } from "@expo-google-fonts/open-sans";
  import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import ViewLoading from "./ViewLoading";
import ExerciseTraining from "./types/ExerciseTraining";
  const TrainingSession:React.FC<TrainingSessionProps> = (props)=>{
    const [fontsLoaded] = useFonts({
        OpenSans_400Regular,
        OpenSans_700Bold,
        OpenSans_300Light,
      });
      const [viewLoading,setViewLoading]=useState<boolean>(false)
      const [exercises,setExercises]=useState({})
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
      useEffect(()=>{
        const exercisesData:any = {};

        props.training.forEach(item => {
            const [name] = item.field.split('Series');
            const exerciseName = name.trim();
            const score = parseFloat(item.score);
        
            if (!exercisesData[exerciseName]) {
                exercisesData[exerciseName] = {
                    name: exerciseName,
                    exercises: []
                };
            }
        
            exercisesData[exerciseName].exercises.push({ field: item.field, score });
        });
        
        const exercisesArray = Object.values(exercisesData);
        setExercises(exercisesArray)
      },[])
    return(
        <View className="h-3/4 p-1">
      <ScrollView className="w-full h-96">
        <View className="flex flex-row w-full flex-wrap">
          {props.training.map((ele:ExerciseTraining, index: number) => (
            <View
              key={index}
              className="items-center flex justify-between text-center flex-row w-1/2 border-b-[1px] border-b-white "
            >
              <View className="items-center flex justify-between flex-row h-full w-full text-left">
                {index % 2 ? (
                  <Text style={{ fontSize: 0, width: 0 }}> {ele.field}</Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: "OpenSans_400Regular"
                    }}
                    className="text-center w-[75%] text-[18px] h-full pl-[5%] pr-[5%] border-r-white border-r-[1px] bg-[#9696961a] rounded-lg text-white"
                  >
                    {/* {ele.field.slice(0, ele.field.length - 3)} */}
                    {
                    (()=>{
                      const  text = ele.field.slice(0, ele.field.length - 3)
                      const seriesIndex = text.indexOf("Series");
                      if(text.includes('1')){
                        const result = text.slice(0,seriesIndex).trim();
                        return  result
                      }
                      return ''
                    })()
                    }
                    {'\n'}
                    {
                    (()=>{
                      const  text = ele.field.slice(0, ele.field.length - 3)
                      const seriesIndex = text.indexOf("Series");
                      const result = text.slice(seriesIndex).trim();
                      
                      return  result
                    })()
                    }

                  </Text>
                )}
                {index % 2 ? (
                  <Text
                    style={{
                      fontFamily: "OpenSans_400Regular"
                    }}
                    className="w-full text-3xl text-white"
                  >
                    x {ele.score}kg
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: "OpenSans_400Regular"
                    }}
                    className="text-white text-3xl w-1/5 text-right"
                  >
                    {ele.score}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      {viewLoading ? <ViewLoading /> : ""}
            
        </View>
    )
}
export default TrainingSession
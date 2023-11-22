import { Text,Image,View,ImageBackground,TouchableOpacity,ScrollView } from "react-native";
import Training from "./types/Training";
import ExerciseTraining from "./types/ExerciseTraining";
import {useState,useEffect} from 'react'
import { CurrentTrainingHistorySessionStyles } from "./styles/CurrentTrainingHistorySessionStyles";
import CurrentTrainingHistorySessionProps from "./props/CurrentTrainingHistorySessionProps";
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import ViewLoading from "./ViewLoading";
const CurrentTrainingHistorySession:React.FC<CurrentTrainingHistorySessionProps>=(props)=>{
    const [infoAboutSession,setInfoAboutSession]=useState<JSX.Element>()
    const [exercises,setExercises]=useState<ExerciseTraining[]>()
    const [viewLoading,setViewLoading]=useState<boolean>(false)
    const [fontsLoaded]=useFonts({
        Teko_700Bold,
        Caveat_400Regular
    })
    useEffect(() => {
        const loadAsyncResources = async () => {
          try {
            SplashScreen.preventAutoHideAsync();
            await fontsLoaded;
            SplashScreen.hideAsync();
          } catch (error) {
            console.error('Błąd ładowania zasobów:', error);
          }
        };
    
        loadAsyncResources();
      }, [fontsLoaded]);
    useEffect(()=>{
        setViewLoading(true)
        getInformationAboutSession()
    },[])
    const getInformationAboutSession=async():Promise<void>=>{
        const response:string|Training= await props.getInformationAboutHistorySession(props.id).then(res=>res)
        if(typeof response !== 'string'){
            setExercises(response.exercises)
            setInfoAboutSession(()=>
            <View style={CurrentTrainingHistorySessionStyles.sessionTrainingContainer}>
                <Text style={{fontFamily:'Teko_700Bold',...CurrentTrainingHistorySessionStyles.h3}}>TrainingDay: {response.type}</Text>
                
            </View>
            )
            
        }
        setViewLoading(false)
    }
    if(!fontsLoaded){
        return <View><Text>Loading...</Text></View>
    }
    return(
        <View style={CurrentTrainingHistorySessionStyles.currentTrainingHistorySession} >
            <Text style={{fontFamily:'Teko_700Bold',...CurrentTrainingHistorySessionStyles.date}}>Date: {props.date.slice(0,25)}</Text>
            {infoAboutSession}
            <ScrollView style={{height:10000}}>
                <View style={CurrentTrainingHistorySessionStyles.container}>
            {exercises?.map((ele,index:number)=>
                <View key={index} style={CurrentTrainingHistorySessionStyles.exerciseDiv}>
                    <View style={CurrentTrainingHistorySessionStyles.exerciseDivSpan}>
                        {index%2?
                        <Text style={{fontSize:0,width:0}}> {ele.field}</Text>
                        :
                        <Text style={{fontFamily:'Teko_400Regular',...CurrentTrainingHistorySessionStyles.exerciseDivSpanP}}>{ele.field.slice(0,ele.field.length-3)}</Text>
                        }
                        {index%2?
                        <Text style={{fontFamily:'Teko_400Regular',...CurrentTrainingHistorySessionStyles.exerciseDivSpanSpanWeight}}>x {ele.score}kg</Text>
                        :
                        <Text style={{fontFamily:'Teko_400Regular',...CurrentTrainingHistorySessionStyles.exerciseDivSpanSpan}}>{ele.score}</Text>}
                    </View>
                </View>

            )}
                </View>
            </ScrollView>
            {viewLoading?<ViewLoading/>:''}
        </View>
    )
}
export default CurrentTrainingHistorySession
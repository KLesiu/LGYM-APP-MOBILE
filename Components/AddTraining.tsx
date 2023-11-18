import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import backgroundLogo from './img/backgroundLGYMApp500.png'
import { AddTrainingStyles } from "./styles/AddTrainingStyles";
import { useState,useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts,Teko_700Bold,Teko_400Regular } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Exercise from "./types/Exercise";
import Data from "./types/DataPlansArrays";


const AddTraining:React.FC=()=>{
    const [plan,setPlan]=useState<string | null | undefined>('')
    const [chooseDay,setChooseDay]=useState<JSX.Element>(<View></View>)
    const [daySection,setDaySection]=useState<JSX.Element>(<View></View>)
    const [dayToCheck,setDayToCheck]=useState<string>()
    const [pickedDay,setPickedDay]=useState<Array<Exercise>>()

    const [fontsLoaded]=useFonts({
        Teko_700Bold,
        Caveat_400Regular,
        Teko_400Regular
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
        getFromStorage()
    },[])
    const getFromStorage=async():Promise<void>=>{
        const plan:string|null|undefined = await AsyncStorage.getItem('plan') || ''
        setPlan(plan)
    }
    const getInformationsAboutPlanDays:VoidFunction = async():Promise<void>=>{
        const id = await AsyncStorage.getItem('id')
        const trainingDays:number = await fetch(`${process.env.REACT_APP_BACKEND}/api/${id}/configPlan`).then(res=>res.json()).catch(err=>err).then(res=>res.count)
        const helpsArray= ["A","B","C","D","E","F","G"]
        const daysArray = []
        for(let i=0;i<trainingDays;i++){
            daysArray.push(helpsArray[i])
        }
        
        setChooseDay(<View style={AddTrainingStyles.chooseDaySection} >
            <Text style={{fontFamily:'Teko_700Bold',fontSize:40,color:'white'}}>Choose training day!</Text>
            {daysArray.map((ele,index:number)=><TouchableOpacity onPress={()=>showDaySection(ele)} style={AddTrainingStyles.button}  key={index}>
                <Text style={{fontFamily:'Teko_700Bold',fontSize:30}}>{ele}</Text></TouchableOpacity>)}
        </View>)
    }
    const showDaySection=async(day:string):Promise<void>=>{   
        const id = await AsyncStorage.getItem('id')     
        const planOfTheDay:Array<Exercise> | undefined = await fetch(`${process.env.REACT_APP_BACKEND}/api/${id}/getPlan`).then(res=>res.json()).catch(err=>err).then(res=>{
            const data:Data=res.data
            if(day=== 'A') return data.planA
            else if(day=== 'B') return data.planB
            else if(day=== 'C') return data.planC
            else if(day=== 'D') return data.planD
            else if(day=== 'E') return data.planE
            else if(day=== 'F') return data.planF
            else if(day ==='G') return data.planG
        })
        // setCurrentDaySection(planOfTheDay!,day)
        setDayToCheck(day)
        setChooseDay(<View></View>)
        setPickedDay(planOfTheDay)

        
    }
    
      if(!fontsLoaded){
        return <View><Text>Loading...</Text></View>
    }
    return(
        <ImageBackground source={backgroundLogo} style={AddTrainingStyles.background}>
            <View style={AddTrainingStyles.addTrainingContainer}>
                {plan==='completed'?
                <View style={AddTrainingStyles.addTrainingSection}>
                    <Text style={{fontFamily:'Teko_400Regular',fontSize:45,textAlign:'center'}}>Add Training!</Text>
                    <TouchableOpacity onPress={getInformationsAboutPlanDays}>
                        <Icon style={{fontSize:100,marginTop:'40%'}} name="plus-circle" />
                    </TouchableOpacity>
                    {chooseDay}
                    {daySection}
                </View>
                :
                <View style={AddTrainingStyles.withoutTraining}>
                    <Text style={{fontFamily:'Teko_400Regular',fontSize:25,textAlign:'center'}}>You cant add training, because you dont have plan!</Text>
                </View>}
            </View>
        </ImageBackground>
    )
}
export default AddTraining
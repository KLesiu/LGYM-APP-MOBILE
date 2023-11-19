import { Text,Image,View,ImageBackground,TouchableOpacity, TextInput, ScrollView,KeyboardAvoidingView,Button } from "react-native";
import backgroundLogo from './img/backgroundLGYMApp500.png'
import { AddTrainingStyles } from "./styles/AddTrainingStyles";
import { useState,useEffect,useReducer } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts,Teko_700Bold,Teko_400Regular } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Exercise from "./types/Exercise";
import Data from "./types/DataPlansArrays";
import LastTrainingSession from "./types/LastTrainingSession";
import ExerciseTraining from "./types/ExerciseTraining";
import KeyboardAwareScrollView from 'react-native-keyboard-aware-scroll-view';

type InputAction = {
    type: 'UPDATE_INPUT';
    index: number;
    value: string;
  };
  
  type InputState = Record<number, string>;
  
  const inputReducer = (state: InputState, action: InputAction): InputState => {
    switch (action.type) {
      case 'UPDATE_INPUT':
        return {
          ...state,
          [action.index]: action.value,
        };
      default:
        return state;
    }
  };


const AddTraining:React.FC=()=>{
    const [plan,setPlan]=useState<string | null | undefined>('')
    const [chooseDay,setChooseDay]=useState<JSX.Element>(<View></View>)
    const [daySection,setDaySection]=useState<JSX.Element>(<View></View>)
    const [dayToCheck,setDayToCheck]=useState<string>()
    const [pickedDay,setPickedDay]=useState<Array<Exercise>>()
    const [lastTrainingSessionDate,setLastTrainingSessionDate]=useState<string>()
    const [lastTrainingSessionExercises,setLastTrainingSessionExercises]=useState<Array<ExerciseTraining>>()
    const [showExercise,setShowExercise]=useState<boolean>()
    const [inputValues,dispatch] = useReducer(inputReducer,{})
    const [inputWeightValues,dispatchWeight]=useReducer(inputReducer,{})


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

        setCurrentDaySection(planOfTheDay!,day)
        setDayToCheck(day)
        setChooseDay(<View></View>)
        setPickedDay(planOfTheDay)

        
    }
    const setCurrentDaySection=async(exercises:Array<Exercise>,day:string):Promise<void>=>{
        const id = await AsyncStorage.getItem('id')
        const response:{prevSession:LastTrainingSession}|null = await fetch(`${process.env.REACT_APP_BACKEND}/api/${id}/getPrevSessionTraining/${day}`).then(res=>res.json()).catch(err=>err).then(res=>res)
        let lastTraining:string
        let lastExercises:Array<ExerciseTraining>
        
        if('prevSession' in response!){
                lastTraining = response.prevSession.createdAt.slice(0,24) 
                lastExercises=response.prevSession.exercises.map(ele=>ele)
                
        }
        setDaySection(
            <View style={AddTrainingStyles.daySection}>
                <Text style={{fontFamily:'Teko_700Bold',width:'100%',textAlign:'center',fontSize:30}}>Training <Text>{day}</Text></Text>
                <ScrollView>
                {exercises.map((ele:Exercise,index:number)=>{
                    let helpsArray:Array<string> = []
                    for(let i=1;i<+ele.series+1;i++){
                        helpsArray.push(`Series: ${i}`)
                    }
                    return(
                        <View style={{marginBottom:50}} key={index}>
                            <Text style={{fontFamily:'Teko_700Bold',fontSize:20,marginBottom:30,marginLeft:5}}>{ele.name}</Text>
                            {helpsArray.map((s,index:number)=>{
                                return(
                                    <View style={AddTrainingStyles.exerciseDiv} key={index}>
                                        <Text style={{fontFamily:'Teko_400Regular',fontSize:15,width:'20%'}}>
                                            <Text>{ele.name}</Text> {s}: Rep
                                        </Text>
                                        <TextInput onChangeText={(text) => handleInputChange(index, text)}  style={AddTrainingStyles.input} />
                                        <Text style={{fontFamily:'Teko_400Regular',fontSize:15,width:'20%',marginLeft:'10%'}}>
                                            <Text>{ele.name}</Text> {s}: Weight (kg)
                                        </Text>
                                        <TextInput onChangeText={(text) => handleInputWeightChange(index, text)} style={{borderBottomColor:'grey',borderBottomWidth:2,...AddTrainingStyles.input}}/>
                                      
                                    </View>
                                )
                            })}
                        </View>
                    )
                })}
                </ScrollView>
            </View>
        
        )
        setLastTrainingSessionDate(lastTraining!)
        setLastTrainingSessionExercises(lastExercises!)
        setShowExercise(true)
        
    }
    const handleInputChange = (index:number, text:string) => {
        dispatch({
          type: 'UPDATE_INPUT',
          index,
          value: text,
        });
      };
    const handleInputWeightChange=(index:number, text:string)=> {
        dispatchWeight({
          type: 'UPDATE_INPUT',
          index,
          value: text,
        });
      };
    const handleButtonPress = () => {
        console.log('Input rep values:', inputValues);
        console.log('Input weight values:',inputWeightValues)
    
        // Tutaj możesz wykonywać inne operacje na wartościach pól TextInput
      };
    
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
                    {showExercise?
                    <View style={AddTrainingStyles.buttonsSection}>
                            <TouchableOpacity onPress={handleButtonPress} style={AddTrainingStyles.buttonAtAddTrainingConfig}><Text style={{fontFamily:'Teko_400Regular',textAlign:'center',fontSize:25}}>ADD TRAINING</Text></TouchableOpacity>
                            <TouchableOpacity style={AddTrainingStyles.buttonAtAddTrainingConfig}><Text style={{fontFamily:'Teko_400Regular',textAlign:'center',fontSize:17}}>SHOW PREVIOUS SESSION</Text></TouchableOpacity>
                    </View>
                        :''}
            
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
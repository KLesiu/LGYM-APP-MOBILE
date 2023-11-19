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
import addTrainingFetchType from "./types/AddTrainingFetchAnsw";
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
    const [fieldsArray,setFieldsArray]=useState<String[]>()
    const [isPopUpShowed,setIsPopUpShowed] = useState<boolean>(false)
    const [inputValues,dispatch] = useReducer(inputReducer,{})
    const [inputWeightValues,dispatchWeight]=useReducer(inputReducer,{})
    // Second
    const [inputValuesSecond, dispatchSecond] = useReducer(inputReducer, {});
    const [inputWeightValuesSecond, dispatchWeightSecond] = useReducer(inputReducer, {});

    // Third
    const [inputValuesThird, dispatchThird] = useReducer(inputReducer, {});
    const [inputWeightValuesThird, dispatchWeightThird] = useReducer(inputReducer, {});

    // Fourth
    const [inputValuesFourth, dispatchFourth] = useReducer(inputReducer, {});
    const [inputWeightValuesFourth, dispatchWeightFourth] = useReducer(inputReducer, {});

    // Fifth
    const [inputValuesFifth, dispatchFifth] = useReducer(inputReducer, {});
    const [inputWeightValuesFifth, dispatchWeightFifth] = useReducer(inputReducer, {});

    // Sixth
    const [inputValuesSixth, dispatchSixth] = useReducer(inputReducer, {});
    const [inputWeightValuesSixth, dispatchWeightSixth] = useReducer(inputReducer, {});

    // Seventh
    const [inputValuesSeventh, dispatchSeventh] = useReducer(inputReducer, {});
    const [inputWeightValuesSeventh, dispatchWeightSeventh] = useReducer(inputReducer, {});

    // Eighth
    const [inputValuesEighth, dispatchEighth] = useReducer(inputReducer, {});
    const [inputWeightValuesEighth, dispatchWeightEighth] = useReducer(inputReducer, {});

    // Ninth
    const [inputValuesNinth, dispatchNinth] = useReducer(inputReducer, {});
    const [inputWeightValuesNinth, dispatchWeightNinth] = useReducer(inputReducer, {});

    // Tenth
    const [inputValuesTenth, dispatchTenth] = useReducer(inputReducer, {});
    const [inputWeightValuesTenth, dispatchWeightTenth] = useReducer(inputReducer, {});

    // Eleventh
    const [inputValuesEleventh, dispatchEleventh] = useReducer(inputReducer, {});
    const [inputWeightValuesEleventh, dispatchWeightEleventh] = useReducer(inputReducer, {});

    // Twelfth
    const [inputValuesTwelfth, dispatchTwelfth] = useReducer(inputReducer, {});
    const [inputWeightValuesTwelfth, dispatchWeightTwelfth] = useReducer(inputReducer, {});

    // Thirteenth
    const [inputValuesThirteenth, dispatchThirteenth] = useReducer(inputReducer, {});
    const [inputWeightValuesThirteenth, dispatchWeightThirteenth] = useReducer(inputReducer, {});

    // Fourteenth
    const [inputValuesFourteenth, dispatchFourteenth] = useReducer(inputReducer, {});
    const [inputWeightValuesFourteenth, dispatchWeightFourteenth] = useReducer(inputReducer, {});

    // Fifteenth
    const [inputValuesFifteenth, dispatchFifteenth] = useReducer(inputReducer, {});
    const [inputWeightValuesFifteenth, dispatchWeightFifteenth] = useReducer(inputReducer, {});

    // Sixteenth
    const [inputValuesSixteenth, dispatchSixteenth] = useReducer(inputReducer, {});
    const [inputWeightValuesSixteenth, dispatchWeightSixteenth] = useReducer(inputReducer, {});

    // Seventeenth
    const [inputValuesSeventeenth, dispatchSeventeenth] = useReducer(inputReducer, {});
    const [inputWeightValuesSeventeenth, dispatchWeightSeventeenth] = useReducer(inputReducer, {});

    // Eighteenth
    const [inputValuesEighteenth, dispatchEighteenth] = useReducer(inputReducer, {});
    const [inputWeightValuesEighteenth, dispatchWeightEighteenth] = useReducer(inputReducer, {});

    // Nineteenth
    const [inputValuesNineteenth, dispatchNineteenth] = useReducer(inputReducer, {});
    const [inputWeightValuesNineteenth, dispatchWeightNineteenth] = useReducer(inputReducer, {});

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
        let arr:String[]=[]
        setDaySection(
            <View style={AddTrainingStyles.daySection}>
                <Text style={{fontFamily:'Teko_700Bold',width:'100%',textAlign:'center',fontSize:30}}>Training <Text>{day}</Text></Text>
                <ScrollView>
                {exercises.map((ele:Exercise,indexMain:number)=>{
                    let helpsArray:Array<string> = []
                    for(let i=1;i<+ele.series+1;i++){
                        helpsArray.push(`Series: ${i}`)
                    }
                    return(
                        <View style={{marginBottom:50}} key={indexMain}>
                            <Text style={{fontFamily:'Teko_700Bold',fontSize:20,marginBottom:30,marginLeft:5}}>{ele.name}</Text>
                            {helpsArray.map((s,index:number)=>{
                                arr.push(`${ele.name} ${s}: Rep`)
                                arr.push(`${ele.name} ${s}: Weight (kg)`)
                                return(
                                    <View style={AddTrainingStyles.exerciseDiv} key={index}>
                                        <Text style={{fontFamily:'Teko_400Regular',fontSize:15,width:'20%'}}>
                                            <Text>{ele.name}</Text> {s}: Rep
                                        </Text>
                                        <TextInput onChangeText={(text) => handleInputChange(index, text,indexMain)}  style={AddTrainingStyles.input} />
                                        <Text style={{fontFamily:'Teko_400Regular',fontSize:15,width:'20%',marginLeft:'10%'}}>
                                            <Text>{ele.name}</Text> {s}: Weight (kg)
                                        </Text>
                                        <TextInput onChangeText={(text) => handleInputWeightChange(index, text,indexMain)} style={{borderBottomColor:'grey',borderBottomWidth:2,...AddTrainingStyles.input}}/>
                                      
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
        setFieldsArray(arr)
    }
    const handleInputChange = (index:number, text:string,indexMain:number) => {
                if(indexMain === 0)
                dispatch({
                    type: 'UPDATE_INPUT',
                    index,
                    value: text,
                });
                else if(indexMain === 1)
                dispatchSecond({
                    type: 'UPDATE_INPUT',
                    index,
                    value: text,
                })
                else if(indexMain===2)
                dispatchThird({
                    type: 'UPDATE_INPUT',
                    index,
                    value: text,})
                else if(indexMain===3)
                dispatchFourth({
                    type: 'UPDATE_INPUT',
                    index,
                    value: text,})
                else if (indexMain === 4) {
                dispatchFifth({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } else if (indexMain === 5) {
                dispatchSixth({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } else if (indexMain === 6) {
                dispatchSeventh({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } else if (indexMain === 7) {
                dispatchEighth({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } else if (indexMain === 8) {
                dispatchNinth({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } else if (indexMain === 9) {
                dispatchTenth({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } else if (indexMain === 10) {
                dispatchEleventh({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } else if (indexMain === 11) {
                dispatchTwelfth({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } else if (indexMain === 12) {
                dispatchThirteenth({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } else if (indexMain === 13) {
                dispatchFourteenth({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } else if (indexMain === 14) {
                dispatchFifteenth({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } else if (indexMain === 15) {
                dispatchSixteenth({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } else if (indexMain === 16) {
                dispatchSeventeenth({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } else if (indexMain === 17) {
                dispatchEighteenth({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } else if (indexMain === 18) {
                dispatchNineteenth({
                  type: 'UPDATE_INPUT',
                  index,
                  value: text,
                });
              } 
              
       
      };
    const handleInputWeightChange=(index:number, text:string,indexMain:number)=> {
        if (indexMain === 0) {
            dispatchWeight({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 1) {
            dispatchWeightSecond({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 2) {
            dispatchWeightThird({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 3) {
            dispatchWeightFourth({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 4) {
            dispatchWeightFifth({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 5) {
            dispatchWeightSixth({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 6) {
            dispatchWeightSeventh({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 7) {
            dispatchWeightEighth({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 8) {
            dispatchWeightNinth({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 9) {
            dispatchWeightTenth({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 10) {
            dispatchWeightEleventh({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 11) {
            dispatchWeightTwelfth({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 12) {
            dispatchWeightThirteenth({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 13) {
            dispatchWeightFourteenth({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 14) {
            dispatchWeightFifteenth({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 15) {
            dispatchWeightSixteenth({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 16) {
            dispatchWeightSeventeenth({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 17) {
            dispatchWeightEighteenth({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } else if (indexMain === 18) {
            dispatchWeightNineteenth({
              type: 'UPDATE_INPUT',
              index,
              value: text,
            });
          } 
          
        
      };

    const submitYourTraining = () => {
        const arrReps:ExerciseTraining[]=[]
        const arrWeight:ExerciseTraining[]=[]
        const arr:ExerciseTraining[]=[]
        
        let helpsArrayReps = fieldsArray?.filter((ele,index:number)=> index===0||index%2===0)
        let helpsArrayWeights = fieldsArray?.filter((ele,index:number)=>index !== 0 && index%2 !== 0)
        // if(pickedDay?.length===1){
        //     for(let i=0;i<Object.keys(inputValues).length;i++)
        //           arrReps.push({field:`${helpsArrayReps![i]}`,score:inputValues[`${i}`]})
        //     for(let i=0; i<Object.keys(inputWeightValues).length;i++)
        //           arrWeight.push({field:`${helpsArrayWeights![i]}`,score:inputWeightValues[`${i}`]})
        //     for(let i=0;i<arrReps.length;i++){
        //             arr.push(arrReps[i])
        //             arr.push(arrWeight[i])
        //     }

        // }
        // else if(pickedDay?.length===2){
        //     for(let i=0;i<Object.keys(inputValues).length;i++)
        //         arrReps.push({field:`${helpsArrayReps![i]}`,score:inputValues[`${i}`]})
        //     for(let i=0; i<Object.keys(inputWeightValues).length;i++)
        //         arrWeight.push({field:`${helpsArrayWeights![i]}`,score:inputWeightValues[`${i}`]})
            
            
        //     helpsArrayReps=helpsArrayReps!.slice(Object.keys(inputValues).length)
        //     helpsArrayWeights=helpsArrayWeights!.slice(Object.keys(inputWeightValues).length)

        //     for(let i=0;i<Object.keys(inputValuesSecond).length;i++)
        //         arrReps.push({field:`${helpsArrayReps![i]}`,score:inputValuesSecond[`${i}`]})
        //     for(let i=0; i<Object.keys(inputWeightValuesSecond).length;i++)
        //         arrWeight.push({field:`${helpsArrayWeights![i]}`,score:inputWeightValuesSecond[`${i}`]})
        //     for(let i=0;i<arrReps.length;i++){
        //           arr.push(arrReps[i])
        //           arr.push(arrWeight[i])
        //     }
        // }
        // else if(pickedDay?.length===3){
        //     for(let i=0;i<Object.keys(inputValues).length;i++)
        //         arrReps.push({field:`${helpsArrayReps![i]}`,score:inputValues[`${i}`]})
        //     for(let i=0; i<Object.keys(inputWeightValues).length;i++)
        //         arrWeight.push({field:`${helpsArrayWeights![i]}`,score:inputWeightValues[`${i}`]})
            
            
        //     helpsArrayReps=helpsArrayReps!.slice(Object.keys(inputValues).length)
        //     helpsArrayWeights=helpsArrayWeights!.slice(Object.keys(inputWeightValues).length)

        //     for(let i=0;i<Object.keys(inputValuesSecond).length;i++)
        //         arrReps.push({field:`${helpsArrayReps![i]}`,score:inputValuesSecond[`${i}`]})
        //     for(let i=0; i<Object.keys(inputWeightValuesSecond).length;i++)
        //         arrWeight.push({field:`${helpsArrayWeights![i]}`,score:inputWeightValuesSecond[`${i}`]})

        //     helpsArrayReps= helpsArrayReps?.slice(Object.keys(inputValuesSecond).length)
        //     helpsArrayWeights=helpsArrayWeights?.slice(Object.keys(inputWeightValuesSecond).length)


            
        //     for(let i=0;i<Object.keys(inputValuesThird).length;i++)
        //         arrReps.push({field:`${helpsArrayReps![i]}`,score:inputValuesThird[`${i}`]})
        //     for(let i=0; i<Object.keys(inputWeightValuesThird).length;i++)
        //         arrWeight.push({field:`${helpsArrayWeights![i]}`,score:inputWeightValuesThird[`${i}`]})
        //     helpsArrayReps = helpsArrayReps?.slice(Object.keys(inputValuesThird).length)
        //     helpsArrayWeights = helpsArrayWeights?.slice(Object.keys(inputWeightValuesThird).length)

        //     for(let i=0;i<arrReps.length;i++){
        //       arr.push(arrReps[i])
        //       arr.push(arrWeight[i])
        //     }
            
              
        //  }
        function processInputValues(values:any, weights:any, repsArray:any, weightArray:any) {
          for (let i = 0; i < Object.keys(values).length; i++) {
            repsArray.push({ field: `${helpsArrayReps![i]}`, score: values[i] });
            weightArray.push({ field: `${helpsArrayWeights![i]}`, score: weights[i] });
          }
          helpsArrayReps = helpsArrayReps!.slice(Object.keys(values).length);
          helpsArrayWeights = helpsArrayWeights!.slice(Object.keys(weights).length);
        }
        
        if(pickedDay?.length===1){
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight)
        }
        else if(pickedDay?.length===2){
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight)
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 3) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight)
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 4) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 5) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight, );
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight,);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight,);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight,);
        }
        else if (pickedDay?.length === 6) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight);
          processInputValues(inputValuesSixth, inputWeightValuesSixth, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 7) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight);
          processInputValues(inputValuesSixth, inputWeightValuesSixth, arrReps, arrWeight);
          processInputValues(inputValuesSeventh, inputWeightValuesSeventh, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 8) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight);
          processInputValues(inputValuesSixth, inputWeightValuesSixth, arrReps, arrWeight);
          processInputValues(inputValuesSeventh, inputWeightValuesSeventh, arrReps, arrWeight);
          processInputValues(inputValuesEighth, inputWeightValuesEighth, arrReps, arrWeight);
        }    
        else if (pickedDay?.length === 9) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight);
          processInputValues(inputValuesSixth, inputWeightValuesSixth, arrReps, arrWeight);
          processInputValues(inputValuesSeventh, inputWeightValuesSeventh, arrReps, arrWeight);
          processInputValues(inputValuesEighth, inputWeightValuesEighth, arrReps, arrWeight);
          processInputValues(inputValuesNinth, inputWeightValuesNinth, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 10) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight);
          processInputValues(inputValuesSixth, inputWeightValuesSixth, arrReps, arrWeight);
          processInputValues(inputValuesSeventh, inputWeightValuesSeventh, arrReps, arrWeight);
          processInputValues(inputValuesEighth, inputWeightValuesEighth, arrReps, arrWeight);
          processInputValues(inputValuesNinth, inputWeightValuesNinth, arrReps, arrWeight);
          processInputValues(inputValuesTenth, inputWeightValuesTenth, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 11) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight);
          processInputValues(inputValuesSixth, inputWeightValuesSixth, arrReps, arrWeight);
          processInputValues(inputValuesSeventh, inputWeightValuesSeventh, arrReps, arrWeight);
          processInputValues(inputValuesEighth, inputWeightValuesEighth, arrReps, arrWeight);
          processInputValues(inputValuesNinth, inputWeightValuesNinth, arrReps, arrWeight);
          processInputValues(inputValuesTenth, inputWeightValuesTenth, arrReps, arrWeight);
          processInputValues(inputValuesEleventh, inputWeightValuesEleventh, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 12) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight);
          processInputValues(inputValuesSixth, inputWeightValuesSixth, arrReps, arrWeight);
          processInputValues(inputValuesSeventh, inputWeightValuesSeventh, arrReps, arrWeight);
          processInputValues(inputValuesEighth, inputWeightValuesEighth, arrReps, arrWeight);
          processInputValues(inputValuesNinth, inputWeightValuesNinth, arrReps, arrWeight);
          processInputValues(inputValuesTenth, inputWeightValuesTenth, arrReps, arrWeight);
          processInputValues(inputValuesEleventh, inputWeightValuesEleventh, arrReps, arrWeight);
          processInputValues(inputValuesTwelfth, inputWeightValuesTwelfth, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 13) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight);
          processInputValues(inputValuesSixth, inputWeightValuesSixth, arrReps, arrWeight);
          processInputValues(inputValuesSeventh, inputWeightValuesSeventh, arrReps, arrWeight);
          processInputValues(inputValuesEighth, inputWeightValuesEighth, arrReps, arrWeight);
          processInputValues(inputValuesNinth, inputWeightValuesNinth, arrReps, arrWeight);
          processInputValues(inputValuesTenth, inputWeightValuesTenth, arrReps, arrWeight);
          processInputValues(inputValuesEleventh, inputWeightValuesEleventh, arrReps, arrWeight);
          processInputValues(inputValuesTwelfth, inputWeightValuesTwelfth, arrReps, arrWeight);
          processInputValues(inputValuesThirteenth, inputWeightValuesThirteenth, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 14) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight);
          processInputValues(inputValuesSixth, inputWeightValuesSixth, arrReps, arrWeight);
          processInputValues(inputValuesSeventh, inputWeightValuesSeventh, arrReps, arrWeight);
          processInputValues(inputValuesEighth, inputWeightValuesEighth, arrReps, arrWeight);
          processInputValues(inputValuesNinth, inputWeightValuesNinth, arrReps, arrWeight);
          processInputValues(inputValuesTenth, inputWeightValuesTenth, arrReps, arrWeight);
          processInputValues(inputValuesEleventh, inputWeightValuesEleventh, arrReps, arrWeight);
          processInputValues(inputValuesTwelfth, inputWeightValuesTwelfth, arrReps, arrWeight);
          processInputValues(inputValuesThirteenth, inputWeightValuesThirteenth, arrReps, arrWeight);
          processInputValues(inputValuesFourteenth, inputWeightValuesFourteenth, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 15) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight);
          processInputValues(inputValuesSixth, inputWeightValuesSixth, arrReps, arrWeight);
          processInputValues(inputValuesSeventh, inputWeightValuesSeventh, arrReps, arrWeight);
          processInputValues(inputValuesEighth, inputWeightValuesEighth, arrReps, arrWeight);
          processInputValues(inputValuesNinth, inputWeightValuesNinth, arrReps, arrWeight);
          processInputValues(inputValuesTenth, inputWeightValuesTenth, arrReps, arrWeight);
          processInputValues(inputValuesEleventh, inputWeightValuesEleventh, arrReps, arrWeight);
          processInputValues(inputValuesTwelfth, inputWeightValuesTwelfth, arrReps, arrWeight);
          processInputValues(inputValuesThirteenth, inputWeightValuesThirteenth, arrReps, arrWeight);
          processInputValues(inputValuesFourteenth, inputWeightValuesFourteenth, arrReps, arrWeight);
          processInputValues(inputValuesFifteenth, inputWeightValuesFifteenth, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 16) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight);
          processInputValues(inputValuesSixth, inputWeightValuesSixth, arrReps, arrWeight);
          processInputValues(inputValuesSeventh, inputWeightValuesSeventh, arrReps, arrWeight);
          processInputValues(inputValuesEighth, inputWeightValuesEighth, arrReps, arrWeight);
          processInputValues(inputValuesNinth, inputWeightValuesNinth, arrReps, arrWeight);
          processInputValues(inputValuesTenth, inputWeightValuesTenth, arrReps, arrWeight);
          processInputValues(inputValuesEleventh, inputWeightValuesEleventh, arrReps, arrWeight);
          processInputValues(inputValuesTwelfth, inputWeightValuesTwelfth, arrReps, arrWeight);
          processInputValues(inputValuesThirteenth, inputWeightValuesThirteenth, arrReps, arrWeight);
          processInputValues(inputValuesFourteenth, inputWeightValuesFourteenth, arrReps, arrWeight);
          processInputValues(inputValuesFifteenth, inputWeightValuesFifteenth, arrReps, arrWeight);
          processInputValues(inputValuesSixteenth, inputWeightValuesSixteenth, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 17) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight);
          processInputValues(inputValuesSixth, inputWeightValuesSixth, arrReps, arrWeight);
          processInputValues(inputValuesSeventh, inputWeightValuesSeventh, arrReps, arrWeight);
          processInputValues(inputValuesEighth, inputWeightValuesEighth, arrReps, arrWeight);
          processInputValues(inputValuesNinth, inputWeightValuesNinth, arrReps, arrWeight);
          processInputValues(inputValuesTenth, inputWeightValuesTenth, arrReps, arrWeight);
          processInputValues(inputValuesEleventh, inputWeightValuesEleventh, arrReps, arrWeight);
          processInputValues(inputValuesTwelfth, inputWeightValuesTwelfth, arrReps, arrWeight);
          processInputValues(inputValuesThirteenth, inputWeightValuesThirteenth, arrReps, arrWeight);
          processInputValues(inputValuesFourteenth, inputWeightValuesFourteenth, arrReps, arrWeight);
          processInputValues(inputValuesFifteenth, inputWeightValuesFifteenth, arrReps, arrWeight);
          processInputValues(inputValuesSixteenth, inputWeightValuesSixteenth, arrReps, arrWeight);
          processInputValues(inputValuesSeventeenth, inputWeightValuesSeventeenth, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 18) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight);
          processInputValues(inputValuesSixth, inputWeightValuesSixth, arrReps, arrWeight);
          processInputValues(inputValuesSeventh, inputWeightValuesSeventh, arrReps, arrWeight);
          processInputValues(inputValuesEighth, inputWeightValuesEighth, arrReps, arrWeight);
          processInputValues(inputValuesNinth, inputWeightValuesNinth, arrReps, arrWeight);
          processInputValues(inputValuesTenth, inputWeightValuesTenth, arrReps, arrWeight);
          processInputValues(inputValuesEleventh, inputWeightValuesEleventh, arrReps, arrWeight);
          processInputValues(inputValuesTwelfth, inputWeightValuesTwelfth, arrReps, arrWeight);
          processInputValues(inputValuesThirteenth, inputWeightValuesThirteenth, arrReps, arrWeight);
          processInputValues(inputValuesFourteenth, inputWeightValuesFourteenth, arrReps, arrWeight);
          processInputValues(inputValuesFifteenth, inputWeightValuesFifteenth, arrReps, arrWeight);
          processInputValues(inputValuesSixteenth, inputWeightValuesSixteenth, arrReps, arrWeight);
          processInputValues(inputValuesSeventeenth, inputWeightValuesSeventeenth, arrReps, arrWeight);
          processInputValues(inputValuesEighteenth, inputWeightValuesEighteenth, arrReps, arrWeight);
        }
        else if (pickedDay?.length === 19) {
          processInputValues(inputValues, inputWeightValues, arrReps, arrWeight);
          processInputValues(inputValuesSecond, inputWeightValuesSecond, arrReps, arrWeight);
          processInputValues(inputValuesThird, inputWeightValuesThird, arrReps, arrWeight);
          processInputValues(inputValuesFourth, inputWeightValuesFourth, arrReps, arrWeight);
          processInputValues(inputValuesFifth, inputWeightValuesFifth, arrReps, arrWeight);
          processInputValues(inputValuesSixth, inputWeightValuesSixth, arrReps, arrWeight);
          processInputValues(inputValuesSeventh, inputWeightValuesSeventh, arrReps, arrWeight);
          processInputValues(inputValuesEighth, inputWeightValuesEighth, arrReps, arrWeight);
          processInputValues(inputValuesNinth, inputWeightValuesNinth, arrReps, arrWeight);
          processInputValues(inputValuesTenth, inputWeightValuesTenth, arrReps, arrWeight);
          processInputValues(inputValuesEleventh, inputWeightValuesEleventh, arrReps, arrWeight);
          processInputValues(inputValuesTwelfth, inputWeightValuesTwelfth, arrReps, arrWeight);
          processInputValues(inputValuesThirteenth, inputWeightValuesThirteenth, arrReps, arrWeight);
          processInputValues(inputValuesFourteenth, inputWeightValuesFourteenth, arrReps, arrWeight);
          processInputValues(inputValuesFifteenth, inputWeightValuesFifteenth, arrReps, arrWeight);
          processInputValues(inputValuesSixteenth, inputWeightValuesSixteenth, arrReps, arrWeight);
          processInputValues(inputValuesSeventeenth, inputWeightValuesSeventeenth, arrReps, arrWeight);
          processInputValues(inputValuesEighteenth, inputWeightValuesEighteenth, arrReps, arrWeight);
          processInputValues(inputValuesNineteenth, inputWeightValuesNineteenth, arrReps, arrWeight);
        }
        for (let i = 0; i < arrReps.length; i++) {
          arr.push(arrReps[i]);
          arr.push(arrWeight[i]);
        }
        console.log(arr)

        
        
      };
    const addYourTrainingToDataBase=async(day:string,training:Array<ExerciseTraining>):Promise<void>=>{
        const id = await AsyncStorage.getItem('id') 
        const response:addTrainingFetchType = await fetch(`${process.env.REACT_APP_BACKEND}/api/${id}/addTraining`,{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                day: day,
                training:training,
                createdAt:new Date().getTime(),
            })
        }).then(res=>res.json()).catch(err=>err).then(res=>res)
        if(response.msg="Training added"){
            setChooseDay(<View></View>)
            setDaySection(<View></View>)
            setShowExercise(false)
            setIsPopUpShowed(true)
            popUpTurnOn()
            
        }
    }
    const popUpTurnOn:VoidFunction=():void=>{

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
                    {!isPopUpShowed?
                    <View style={AddTrainingStyles.popUp}>
                      <Icon style={{fontSize:100}} name="check" />
                    </View>:''}
                    {daySection}
                    {showExercise?
                    <View style={AddTrainingStyles.buttonsSection}>
                            <TouchableOpacity onPress={submitYourTraining} style={AddTrainingStyles.buttonAtAddTrainingConfig}><Text style={{fontFamily:'Teko_400Regular',textAlign:'center',fontSize:25}}>ADD TRAINING</Text></TouchableOpacity>
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
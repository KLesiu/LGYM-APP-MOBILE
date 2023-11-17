import { Text,Image,View,ImageBackground,TouchableOpacity, ScrollView,Alert } from "react-native";
import { TrainingPlanStyles } from "./styles/TrainingPlanStyles";
import backgroundLogo from './img/backgroundLGYMApp500.png'
import {useState,useEffect} from 'react'
import { useFonts,Teko_700Bold,Teko_400Regular } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import Data from "./types/DataPlansArrays";
import Exercise from "./types/Exercise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ErrorMsg from "./types/ErrorMsg";
import SuccessMsg from "./types/SuccessMsg";
const TrainingPlan:React.FC=()=>{
    const [yourPlan,setYourPlan]=useState<JSX.Element>(
    <View style={TrainingPlanStyles.withoutPlanContainer}>
        <Text style={{fontFamily:'Teko_700Bold',fontSize:40}}>Training Plan</Text>
        <Text style={{fontFamily:'Teko_700Bold',...TrainingPlanStyles.withoutPlanText,width:'100%'}}>You dont have any plans</Text>
        <TouchableOpacity style={TrainingPlanStyles.withoutPlanButton}>
            <Text style={{fontFamily:'Caveat_400Regular',...TrainingPlanStyles.withoutPlanButtonText}}>Create your plan now!</Text>
        </TouchableOpacity>
    </View>)
     const [isPlanSet,setIsPlanSet]=useState<boolean>(false)
     const [planConfigSection,setplanConfigSection]=useState<boolean>(false)
     const [isPopUpDeleteShowed,setIsPopUpDeleteShowed]=useState<boolean>(false)
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
      getUserPlan()
    },[])
    const getUserPlan = async():Promise<void>=>{
        const id = await AsyncStorage.getItem('id')
        const response:{data:Data|string}  = await fetch(`${process.env.REACT_APP_BACKEND}/api/${id}/getPlan`).then(res=>res.json()).catch(err=>err).then(res=>res)
        if(response.data === 'Didnt find'){
            setIsPlanSet(false)
            setYourPlan(<View style={TrainingPlanStyles.withoutPlanContainer}>
              <Text style={{fontFamily:'Teko_700Bold',fontSize:40}}>Training Plan</Text>
              <Text style={{fontFamily:'Teko_700Bold',...TrainingPlanStyles.withoutPlanText,width:'100%'}}>You dont have any plans</Text>
              <TouchableOpacity style={TrainingPlanStyles.withoutPlanButton}>
                  <Text style={{fontFamily:'Caveat_400Regular',...TrainingPlanStyles.withoutPlanButtonText}}>Create your plan now!</Text>
              </TouchableOpacity>
          </View>)
            
        } 
        else{
            
            const data = response.data
            if(typeof data !== 'string'){
                
                const planA = data.planA.length > 0? data.planA.map((element:Exercise,index:number)=>(
                    <View style={TrainingPlanStyles.exerciseContainer} key={index}>
                      <Text style={{fontFamily:'Teko_400Regular',width:'60%',fontSize:20}}>{element.name}</Text>
                      <Text style={{fontFamily:'Teko_400Regular',fontSize:21}}>{element.series} x {element.reps}</Text>
                    </View>
                )): ''
                const planB= data.planB.length >0? data.planB.map((element:Exercise,index:number)=>(
                    <View style={TrainingPlanStyles.exerciseContainer} key={index}>
                      <Text style={{fontFamily:'Teko_400Regular',width:'60%',fontSize:20}} >{element.name}</Text>
                      <Text style={{fontFamily:'Teko_400Regular',fontSize:21}} >{element.series} x {element.reps}</Text>
                    </View>
                )):''
                const planC= data.planC.length >0? data.planC.map((element:Exercise,index:number)=>(
                    <View style={TrainingPlanStyles.exerciseContainer} key={index}>
                      <Text style={{fontFamily:'Teko_400Regular',width:'60%',fontSize:20}} >{element.name}</Text>
                      <Text style={{fontFamily:'Teko_400Regular',fontSize:21}} >{element.series} x {element.reps}</Text>
                    </View>
                )):''
                const planD= data.planD.length >0? data.planD.map((element:Exercise,index:number)=>(
                    <View style={TrainingPlanStyles.exerciseContainer} key={index}>
                      <Text style={{fontFamily:'Teko_400Regular',width:'60%',fontSize:20}} >{element.name}</Text>
                      <Text style={{fontFamily:'Teko_400Regular',fontSize:21}} >{element.series} x {element.reps}</Text>
                    </View>
                )):''
                const planE= data.planE.length >0? data.planE.map((element:Exercise,index:number)=>(
                    <View style={TrainingPlanStyles.exerciseContainer} key={index}>
                      <Text style={{fontFamily:'Teko_400Regular',width:'60%',fontSize:20}} >{element.name}</Text>
                      <Text style={{fontFamily:'Teko_400Regular',fontSize:21}} >{element.series} x {element.reps}</Text>
                   </View>
                )):''
                const planF= data.planF.length >0? data.planF.map((element:Exercise,index:number)=>(
                    <View style={TrainingPlanStyles.exerciseContainer} key={index}>
                      <Text style={{fontFamily:'Teko_400Regular',width:'60%',fontSize:20}} >{element.name}</Text>
                      <Text style={{fontFamily:'Teko_400Regular',fontSize:21}} >{element.series} x {element.reps}</Text>
                    </View>
                )):''
                const planG= data.planG.length >0? data.planG.map((element:Exercise,index:number)=>(
                    <View style={TrainingPlanStyles.exerciseContainer} key={index}>
                      <Text style={{fontFamily:'Teko_400Regular',width:'60%',fontSize:20}} >{element.name}</Text>
                      <Text style={{fontFamily:'Teko_400Regular',fontSize:21}} >{element.series} x {element.reps}</Text>
                    </View>
                )):''
                setYourPlan(()=>{
                    return(
                        <View style={TrainingPlanStyles.planSection}>
                          <Text style={{fontFamily:'Teko_700Bold',fontSize:30,width:'100%',textAlign:'center'}}>Training Plan</Text>
                          <TouchableOpacity onPress={()=>setIsPopUpDeleteShowed(true)} style={TrainingPlanStyles.deleteButton}>
                            <Icon style={TrainingPlanStyles.deleteIcon} name="delete" />
                          </TouchableOpacity>
                          <ScrollView>
                          {planA?
                            <View style={TrainingPlanStyles.containerForAllDailyExercises}>
                              <Text style={{fontFamily:'Teko_700Bold',fontSize:25}}>Plan A</Text>
                              {planA}
                            </View>
                              :''
                          }
                          {planB?
                            <View style={TrainingPlanStyles.containerForAllDailyExercises}>
                              <Text style={{fontFamily:'Teko_700Bold',fontSize:25}}>Plan B</Text>
                              {planB}
                            </View>
                            :''  
                          }
                          {planC?
                            <View style={TrainingPlanStyles.containerForAllDailyExercises}>
                              <Text style={{fontFamily:'Teko_700Bold',fontSize:25}}>Plan C</Text>
                              {planC}
                            </View>
                            :''  
                          }
                          {planD?
                            <View style={TrainingPlanStyles.containerForAllDailyExercises}>
                              <Text style={{fontFamily:'Teko_700Bold',fontSize:25}}>Plan D</Text>
                              {planD}
                            </View>
                            :''  
                          }
                          {planE?
                            <View style={TrainingPlanStyles.containerForAllDailyExercises}>
                              <Text style={{fontFamily:'Teko_700Bold',fontSize:25}}>Plan E</Text>
                              {planE}
                            </View>
                            :''  
                          }
                          {planF?
                            <View style={TrainingPlanStyles.containerForAllDailyExercises}>
                              <Text style={{fontFamily:'Teko_700Bold',fontSize:25}}>Plan F</Text>
                              {planF}
                            </View>
                            :''  
                          }
                          {planG?
                            <View style={TrainingPlanStyles.containerForAllDailyExercises}>
                              <Text style={{fontFamily:'Teko_700Bold',fontSize:25}}>Plan G</Text>
                              {planG}
                            </View>
                            :''  
                          }
                            </ScrollView>
                        </View>
                       
                    )
                })
                
                await AsyncStorage.setItem('plan','completed')
                setIsPlanSet(true)
                
            }
            
            

            
        
        }
    }
    const deletePlan=async():Promise<void>=>{
      const id = await AsyncStorage.getItem('id')
      const response:ErrorMsg | SuccessMsg = await fetch(`${process.env.REACT_APP_BACKEND}/api/${id}/deletePlan`,{
          method:'DELETE'
      }).then(res=>res.json()).catch(err=>err).then(res=>res)
      if(response.msg==='Deleted'){
        setYourPlan(<View style={TrainingPlanStyles.withoutPlanContainer}>
          <Text style={{fontFamily:'Teko_700Bold',fontSize:40}}>Training Plan</Text>
          <Text style={{fontFamily:'Teko_700Bold',...TrainingPlanStyles.withoutPlanText,width:'100%'}}>You dont have any plans</Text>
          <TouchableOpacity style={TrainingPlanStyles.withoutPlanButton}>
              <Text style={{fontFamily:'Caveat_400Regular',...TrainingPlanStyles.withoutPlanButtonText}}>Create your plan now!</Text>
          </TouchableOpacity>
      </View>)
        setIsPlanSet(false)
        await AsyncStorage.removeItem('plan')
      }
      
      
  }


    if(!fontsLoaded){
        return <View><Text>Loading...</Text></View>
    }
    return(
      <ImageBackground style={TrainingPlanStyles.backgroundIMG} source={backgroundLogo}>
          <View style={TrainingPlanStyles.sectionPlan} >
                {!isPlanSet?<>{yourPlan}</>:<>
                  {yourPlan}
                   </>}
                {isPopUpDeleteShowed?<View>
                  <Text style={{fontFamily:'Caveat_400Regular'}}>Are you sure?</Text>
                  <TouchableOpacity>
                    <Text>YES</Text>
                    </TouchableOpacity>
                  <TouchableOpacity>
                    <Text>NO</Text>
                  </TouchableOpacity>
                </View>:''}

                
          </View>
        </ImageBackground>
    )
}
export default TrainingPlan
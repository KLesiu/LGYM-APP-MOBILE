import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import { TrainingPlanStyles } from "./styles/TrainingPlanStyles";
import backgroundLogo from './img/backgroundLGYMApp500.png'
import {useState,useEffect} from 'react'
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
const TrainingPlan:React.FC=()=>{
    const [yourPlan,setYourPlan]=useState<JSX.Element>(<View style={TrainingPlanStyles.withoutPlanContainer}>
        <Text style={{fontFamily:'Teko_700Bold',fontSize:40}}>Training Plan</Text>
        <Text style={{fontFamily:'Teko_700Bold',...TrainingPlanStyles.withoutPlanText,width:'100%'}}>You dont have any plans</Text>
        <TouchableOpacity style={TrainingPlanStyles.withoutPlanButton}>
            <Text style={{fontFamily:'Caveat_400Regular',...TrainingPlanStyles.withoutPlanButtonText}}>Create your plan now!</Text>
        </TouchableOpacity>
    </View>)
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
      if(!fontsLoaded){
        return <View><Text>Loading...</Text></View>
    }
    return(
      <ImageBackground style={TrainingPlanStyles.backgroundIMG} source={backgroundLogo}>
          <View style={TrainingPlanStyles.sectionPlan} >
              
                  {yourPlan}
              
              
          </View>
        </ImageBackground>
    )
}
export default TrainingPlan
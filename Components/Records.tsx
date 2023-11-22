import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import backgroundLogo from './img/backgroundLGYMApp500.png'
import { RecordsStyles } from "./styles/RecordsStyles";
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import { useEffect,useState } from "react";
import deadLiftIcon from './img/dlIcon.png'
import benchPressIcon from './img/benchpressIcon.png'
import squatIcon from './img/squatIcon.png'
import RecordsPopUp from "./RecordsPopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewLoading from "./ViewLoading";
const Records:React.FC=()=>{
    const [deadLift,setDeadLift]=useState<number>()
    const [squat,setSquat]=useState<number>()
    const [benchPress,setBenchPress]=useState<number>()
    const [total,setTotal]=useState<number>()
    const [popUp,setPopUp]=useState<boolean>(false)
    const [viewLoading,setViewLoading]=useState<boolean>(true)
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
        getDataFromStorage()

    },[popUp])
    
    
    const chagePopUpValue:VoidFunction=():void=>{
        setPopUp(false)
    }
    const getDataFromStorage=async():Promise<void>=>{
        const dl =  await AsyncStorage.getItem('dl') 
        const sq = await AsyncStorage.getItem('sq') 
        const bp = await AsyncStorage.getItem('bp') 
        setDeadLift(dl?parseFloat(dl!):0)
        setBenchPress(bp?parseFloat(bp!):0)
        setSquat(sq?parseFloat(sq!):0)
        setTotal(parseFloat(dl!)+parseFloat(sq!)+parseFloat(bp!))
        setViewLoading(false)
      }
      if(!fontsLoaded){
        return <ViewLoading/>
    }
    return(
        <ImageBackground source={backgroundLogo} style={RecordsStyles.background}>
            <View style={RecordsStyles.recordsContainer}>
                <Text style={{fontFamily:'Teko_700Bold',...RecordsStyles.titleh2}}>Records in powerlifting:</Text>
                <View style={RecordsStyles.titleOfLift}>
                    <Image style={RecordsStyles.icon} source={deadLiftIcon}/>
                    <Text style={{fontFamily:'Teko_700Bold',...RecordsStyles.lift}}>Dead Lift:</Text>
                </View>
                <Text style={{fontFamily:'Teko_700Bold',...RecordsStyles.span}}>{benchPress || 0} kg</Text>
                <View style={RecordsStyles.titleOfLift}>
                    <Image style={RecordsStyles.icon} source={squatIcon} />
                    <Text style={{fontFamily:'Teko_700Bold',...RecordsStyles.lift}}>Squat:</Text>
                </View>
                <Text style={{fontFamily:'Teko_700Bold',...RecordsStyles.span}}>{squat || 0} kg</Text>
                <View style={RecordsStyles.titleOfLift}>
                    <Image  style={RecordsStyles.icon} source={benchPressIcon} />
                    <Text style={{fontFamily:'Teko_700Bold',...RecordsStyles.lift}} >Bench Press:</Text>
                </View>
                <Text style={{fontFamily:'Teko_700Bold',...RecordsStyles.span}}>{benchPress || 0} kg</Text>
                <Text style={{fontFamily:'Teko_700Bold',...RecordsStyles.total}}>Your total is: {total || 0} kg</Text>
                <TouchableOpacity onPress={()=>setPopUp(true)} style={RecordsStyles.buttonUpdateRecords}><Text  style={{fontFamily:'Teko_700Bold',...RecordsStyles.buttonText}}>Update Records</Text></TouchableOpacity>
                {popUp?<RecordsPopUp offPopUp={chagePopUpValue}/>:''}
                {viewLoading?<ViewLoading />:''}
            </View>
        </ImageBackground>
    )
}
export default Records
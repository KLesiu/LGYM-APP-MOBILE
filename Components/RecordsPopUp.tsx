import { Text,Image,View,ImageBackground,TouchableOpacity,TextInput } from "react-native";
import RecordsPopUpProps from "./props/RecordsPopUpProps";
import ErrorMsg from "./types/ErrorMsg";
import {useState,useEffect} from 'react';
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import { RecordsPopUpStyles } from "./styles/RecordsPopUpStyles";
const RecordsPopUp:React.FC<RecordsPopUpProps>=(props)=>{
    const [error,setError]= useState<ErrorMsg>()
    const [benchPressValue,setBenchPressValue]=useState<string>()
    const [deadLiftValue,setDeadLiftValue]=useState<string>()
    const [squatValue,setSquatValue]=useState<string>()
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
    const setRecords = async():Promise<void>=>{
    
    }

    return(
        <View style={RecordsPopUpStyles.recordsPopUpContainer}>
            <Text style={{fontFamily:'Teko_700Bold',...RecordsPopUpStyles.h2}}>Set Your Records!</Text>
            <Text style={{fontFamily:'Teko_700Bold',...RecordsPopUpStyles.label}}>DeadLift:</Text>
            <TextInput onChangeText={(text:string|'')=>setDeadLiftValue(text)} style={RecordsPopUpStyles.input}/>
            <Text style={{fontFamily:'Teko_700Bold',...RecordsPopUpStyles.label}}>Squat:</Text>
            <TextInput onChangeText={(text:string|'')=>setSquatValue(text)} style={RecordsPopUpStyles.input}/>
            <Text style={{fontFamily:'Teko_700Bold',...RecordsPopUpStyles.label}}>BenchPress:</Text>
            <TextInput onChangeText={(text:string|'')=>setBenchPressValue(text)} style={RecordsPopUpStyles.input}/>
            <TouchableOpacity style={RecordsPopUpStyles.buttonUpdateRecordsPopUp}>
                <Text style={{fontFamily:'Teko_700Bold',fontSize:30}}>Update!</Text>
            </TouchableOpacity>
            <Text style={{fontFamily:'Teko_700Bold'}}>{error?error.msg:''}</Text>
        </View>
    )
}
export default RecordsPopUp
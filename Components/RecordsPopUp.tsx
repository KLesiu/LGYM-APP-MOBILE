import { Text,Image,View,ImageBackground,TouchableOpacity,TextInput } from "react-native";
import RecordsPopUpProps from "./props/RecordsPopUpProps";
import ErrorMsg from "./types/ErrorMsg";
import {useState,useEffect} from 'react';
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import { RecordsPopUpStyles } from "./styles/RecordsPopUpStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
        const dlValue = parseFloat(deadLiftValue!)
        const sqValue = parseFloat(squatValue!)
        const bpValue = parseFloat(benchPressValue!)
        const id = await AsyncStorage.getItem('id')
        const response:string = await fetch(`${process.env.REACT_APP_BACKEND}/api/userRecords`,{
            method:"POST",
            headers:{
                'content-type': "application/json"
            },
            body:JSON.stringify({
                id: id,
                sq: sqValue || 0,
                dl: dlValue || 0,
                bp: bpValue || 0
                      
            })

        }).then(res=>res.json()).catch(err=>err).then(res=>res.msg)
        if(response === 'Updated'){
            await AsyncStorage.setItem('dl',`${dlValue}`)
            await AsyncStorage.setItem('sq',`${sqValue}`)
            await AsyncStorage.setItem('bp',`${bpValue}`)
            props.offPopUp()
        } 
    
    }

    return(
        <View style={RecordsPopUpStyles.recordsPopUpContainer}>
            <Text style={{fontFamily:'Teko_700Bold',...RecordsPopUpStyles.h2}}>Set Your Records!</Text>
            <Text style={{fontFamily:'Teko_700Bold',...RecordsPopUpStyles.label}}>DeadLift:</Text>
            <TextInput placeholder="number or float (for example 1 or 1.0)" onChangeText={(text:string|'')=>setDeadLiftValue(text)} style={RecordsPopUpStyles.input}/>
            <Text style={{fontFamily:'Teko_700Bold',...RecordsPopUpStyles.label}}>Squat:</Text>
            <TextInput placeholder="number or float (for example 1 or 1.0)" onChangeText={(text:string|'')=>setSquatValue(text)} style={RecordsPopUpStyles.input}/>
            <Text style={{fontFamily:'Teko_700Bold',...RecordsPopUpStyles.label}}>BenchPress:</Text>
            <TextInput placeholder="number or float (for example 1 or 1.0)" onChangeText={(text:string|'')=>setBenchPressValue(text)} style={RecordsPopUpStyles.input}/>
            <TouchableOpacity onPress={setRecords} style={RecordsPopUpStyles.buttonUpdateRecordsPopUp}>
                <Text style={{fontFamily:'Teko_700Bold',fontSize:30}}>Update!</Text>
            </TouchableOpacity>
            <Text style={{fontFamily:'Teko_700Bold'}}>{error?error.msg:''}</Text>
        </View>
    )
}
export default RecordsPopUp
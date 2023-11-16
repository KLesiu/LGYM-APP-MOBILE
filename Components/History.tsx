import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import backgroundLogo from './img/backgroundLGYMApp500.png'
import { HistoryStyles } from "./styles/HistoryStyles";
import {useState,useEffect} from 'react'
import Session from "./types/Session";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'

const History:React.FC=()=>{
    const [sessions,setSessions]=useState<Session[]>([])
    const [currentSessionsNumber,setcurrentSessionsNumber]=useState<number>(3)
    const [currentSessions,setCurrentSessions]=useState<Session[]>([])
    const [currentHistoryTrainingSession,setCurrentHistoryTrainingSession]=useState<JSX.Element>()
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
        <ImageBackground style={HistoryStyles.background} source={backgroundLogo}>
            <View style={HistoryStyles.historyContainer}>
                <Text style={{fontFamily:'Teko_700Bold',...HistoryStyles.h1}}>Training History</Text>
                {currentSessions.length>0?currentSessions.map(ele=>
                   <View>
                        <Text>Training symbol {ele.symbol}</Text>
                        <Text>Date: <Text>{ele.date.slice(0,25)}</Text></Text>
                        <Text>Series: {ele.exercises.length}</Text>
                        <Text>Id: <Text>{ele.id}</Text></Text>
                        <TouchableOpacity>
                            <Icon name="book"/>
                        </TouchableOpacity>
                   </View> 
                ):
                <View style={HistoryStyles.withoutTrainingContainer}>
                    <Text style={{fontFamily:'Teko_700Bold',...HistoryStyles.withoutTrainingText}}>You dont have training history!</Text>    
                </View>
                }
            </View>
        </ImageBackground>
        
    )
}
export default History
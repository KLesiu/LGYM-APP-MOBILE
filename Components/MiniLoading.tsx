import { Text,View} from "react-native";
import { MiniLoadingStyles } from "./styles/MiniLoadingStyles";
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect} from 'react';

const MiniLoading:React.FC=()=>{
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
        return <View></View>
    }
    return(
        <View style={MiniLoadingStyles.miniLoadingDiv}>
            <Text style={{fontFamily:'Teko_700Bold',...MiniLoadingStyles.text}}>Loading...</Text>
        </View>
    )
}
export default MiniLoading
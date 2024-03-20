import { Text,View} from "react-native";
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect} from 'react';
import ViewLoading from "./ViewLoading";

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
        return <ViewLoading/>
    }
    return(
        <View className="w-full flex flex-row items-center justify-center mt-5">
            <Text className="text-xl text-white" style={{fontFamily:'Teko_700Bold'}}>Loading...</Text>
        </View>
    )
}
export default MiniLoading
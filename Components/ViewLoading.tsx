import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect, useState } from 'react';
import { ViewLoadingStyles } from "./styles/ViewLoadingStyles";
const ViewLoading:React.FC = ()=>{
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
        return <View style={ViewLoadingStyles.viewLoadingDiv}>
            <Text style={{fontSize:20,color:'white'}}>Loading fonts...</Text>
        </View>
    }
    return(
        <View style={ViewLoadingStyles.viewLoadingDiv}>
            <Text style={{fontFamily:'Teko_700Bold',fontSize:30,color:'white'}}>Loading...</Text>
        </View>
    )
}
export default ViewLoading
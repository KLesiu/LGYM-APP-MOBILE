import { View,Image,Text } from "react-native"
import Notification from './img/icons/notification.png'
import logo300 from './img/logo300.png'
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
    useFonts,
    Teko_700Bold,
    Teko_400Regular,
    Teko_300Light,
    
  } from "@expo-google-fonts/teko";
import { OpenSans_400Regular,OpenSans_700Bold } from "@expo-google-fonts/open-sans"
import * as SplashScreen from "expo-splash-screen";

const Header:React.FC =()=>{
    const [name,setName]= useState<string>()
    const [fontsLoaded] = useFonts({
        Teko_700Bold,
        Teko_400Regular,
        Teko_300Light,
        OpenSans_400Regular,
        OpenSans_700Bold
      });
      useEffect(() => {
        const loadAsyncResources = async () => {
          try {
            SplashScreen.preventAutoHideAsync();
            await fontsLoaded;
            SplashScreen.hideAsync();
          } catch (error) {
            console.error("Błąd ładowania zasobów:", error);
          }
        };
    
        loadAsyncResources();
      }, [fontsLoaded]);
    const getName = async()=>{
        setName(await AsyncStorage.getItem("username") as string)
    }
    useEffect(()=>{
        getName()
    },[])
    return(
        <View className="bg-[#131313] h-20 px-8 py-4 flex flex-row justify-between items-center">
            <View className="flex flex-row  justify-around">
                <View className="flex flex-col">
                    <Text className=" leading-4 text-sm text-white" style={{
                      fontFamily: "OpenSans_400Regular",
                    }}>Welcome back</Text>
                    <Text  className="text-base leading-6  text-white" style={{
                      fontFamily: "OpenSans_700Bold",
                    }}>{name}</Text>
                </View>
            </View>
            <Image className="w-6 h-6" source={Notification} />
        </View>
    )
}
export default Header
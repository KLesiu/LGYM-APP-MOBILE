import { View,Image,Text } from "react-native"
import Notification from './img/icons/notification.png'
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const Header:React.FC =()=>{
    const [name,setName]= useState<string>('')
    const getName = async()=>{
        setName(await AsyncStorage.getItem("username") as string)
    }
    useEffect(()=>{
        getName()
    },[])
    return(
        <View className="bg-[#131313] h-28 p-4 flex flex-row justify-between items-center">
            <View className="flex flex-row items-center">
                <View className="flex items-center justify-center w-10 h-10 rounded-full bg-[#94e798] ">
                    <Text className="text-[#131313] text-xl font-bold" style={{fontFamily:'OpenSans_700Bold'}}>{name[0]}</Text>
                </View>
                <View className="flex flex-col ml-4">
                    <Text className=" leading-4 text-sm text-white" style={{
                      fontFamily: "OpenSans_400Regular",
                    }}>Welcome back</Text>
                    <Text  className="text-base leading-6  text-white" style={{
                      fontFamily: "OpenSans_700Bold",
                    }}>{name}</Text>
                </View>
            </View>
            {/* <Image className="w-6 h-6" source={Notification} /> */}
        </View>
    )
}
export default Header
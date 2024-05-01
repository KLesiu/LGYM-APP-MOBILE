import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import logoLGYM from './img/logoLGYM.png'
import backgroundLGYM from './img/backgroundLGYMApp500.png'
import {useState,useEffect} from 'react'
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./types/RootStackParamList";
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import Loading from "./Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Preload:React.FC=()=>{
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const [isLoading,setIsLoading]=useState<boolean>(true)
    useEffect(()=>{
        checkUserSession()
    },[])
    const checkUserSession = async():Promise<void>=>{
        const apiURL =`${process.env.REACT_APP_BACKEND}/api/checkToken`
        const token = await AsyncStorage.getItem('token')
        if(!token) return
        const response = await fetch(apiURL,{
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization":`Bearer ${token} `
            },
        }).then(res=>res.json())
        if(!response.isValid) return
        await AsyncStorage.setItem('username',response.user.name)
        await AsyncStorage.setItem('id',response.user._id)
        await AsyncStorage.setItem('email',response.user.email)
        await AsyncStorage.setItem('bp',`${response.user.Bp}` || '0')
        await AsyncStorage.setItem('dl',`${response.user.Dl}` || '0')
        await AsyncStorage.setItem('sq',`${response.user.Sq}` || '0')
        navigation.navigate('Home')

    }
    const handleLoginPress:VoidFunction=():void=>{
        navigation.navigate('Login')
    }
    const handleRegisterPress:VoidFunction=():void=>{
        navigation.navigate('Register')
    }
    const offLoading:VoidFunction=():void=>{
        setIsLoading(false)
    }
    return(
        <View style={{backgroundColor:'black',height:'100%'}}>
            <ImageBackground className="h-full" style={{height:'100%'}} source={backgroundLGYM}>
                        <View className="bg-[#5c5c5cb3] h-full w-full">
                            <View className="flex-1 items-center flex bg-[#000000e5] justify-center h-full gap-5">
                                <Image source={logoLGYM} className="w-[70%] h-2/5" />
                                <TouchableOpacity className="items-center bg-[#868686] rounded-xl flex text-[10px] justify-center mt-5 h-[10%] opacity-100 w-[70%] " onPress={handleLoginPress} >
                                    <Text className="text-[#e2e2e2] text-[35px] no-underline text-shadow text-shadow-black text-shadow-offset text-shadow-offset-1 text-shadow-radius text-shadow-radius-1 tracking-wider"  style={{fontFamily:'Teko_700Bold'}}>LOGIN</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="items-center bg-[#868686] rounded-xl flex text-[10px] justify-center mt-5 h-[10%] opacity-100 w-[70%] " onPress={handleRegisterPress}>
                                    <Text className="text-[#e2e2e2] text-[35px] no-underline text-shadow text-shadow-black text-shadow-offset text-shadow-offset-1 text-shadow-radius text-shadow-radius-1 tracking-wider" style={{fontFamily:'Teko_700Bold'}}>REGISTER</Text>
                                </TouchableOpacity>
                               <Text className="items-center w-[90%] text-white text-center" style={{fontFamily:'Caveat_400Regular'}}>'Strength does not come from winning. Your struggles develop your strengths. When you go through hardships and decide not to surrender, that is strength. When you make an impasse passable, that is strength. But you must have ego, the kind of ego which makes you think of yourself in terms of superlatives. You must want to be the greatest. We are all starved for compliments. So we do things that get positive feedback.' (Arnold Schwarzenegger, 1982)</Text>
                            </View>
                                
                        </View>
                </ImageBackground>
                
            {isLoading?<Loading offLoading={offLoading} />:''}
            
        </View>

    )
}
export default Preload
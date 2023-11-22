import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LoginStyles } from './styles/LoginStyles';
import logoLGYM from './img/logoLGYM.png'
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import ErrorMsg from './types/ErrorMsg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import { RootStackParamList } from "./types/RootStackParamList";
import MiniLoading from './MiniLoading';



const Login:React.FC=()=>{
    const [errors, setErrors] = useState<ErrorMsg[]>([]);
    const [loading, setLoading] = useState(false);
    const [username,setUsername]=useState<string>()
    const [password,setPassword]=useState<string>()
    const apiURL =`${process.env.REACT_APP_BACKEND}/api/login`
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

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
    const login=async():Promise<string | void>=>{
        
        setLoading(true)
        if(!username || !password){
            setErrors([])
            setLoading(false)
            setErrors([{msg:'All fields are required!'}])
            return
        }
        try{
            const response:'Authorized'|'Unauthorized' = await fetch(apiURL,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    name:username,
                    password:password
                })
            }).then(res=>res.json()).catch(()=>'Unauthorized').then(async(res)=>{
                if(res === 'Unauthorized'){
                    setLoading(false)
                    setErrors([{msg:'We havent heard about you yet!  Please register'},{
                        msg: "Maybe you typed wrong password! Please check it"
                    }])
                    
                    return 'Unauthorized'
                }else{
                    await AsyncStorage.setItem('token',res.token)
                    await AsyncStorage.setItem('username',res.req.name)
                    await AsyncStorage.setItem('id',res.req._id)
                    await AsyncStorage.setItem('email',res.req.email)
                    await AsyncStorage.setItem('bp',`${res.req.Bp}` || '0')
                    await AsyncStorage.setItem('dl',`${res.req.Dl}` || '0')
                    await AsyncStorage.setItem('sq',`${res.req.Sq}` || '0')
                    return 'Authorized'
                }  
            })
            
            if(response==`${process.env.REACT_APP_MSG_LOGIN_AUTH}`){
                setErrors([])
                setLoading(false)
                navigation.navigate('Home')
            }

        }
        catch(err){
            console.log(err)
        }
    }
    return(
       <View style={LoginStyles.container}>
            <Image style={LoginStyles.logo} source={logoLGYM}/>
            <Text style={{fontFamily:'Teko_700Bold',...LoginStyles.label}}>Username</Text>
            <TextInput onChangeText={(text:string|'')=>setUsername(text)} style={LoginStyles.input} autoComplete="given-name" />
            <Text style={{fontFamily:'Teko_700Bold',...LoginStyles.label}}>Password</Text>
            <TextInput onChangeText={(text:string|'')=>setPassword(text)} style={LoginStyles.input} secureTextEntry={true}></TextInput>
            <TouchableOpacity onPress={login} style={LoginStyles.buttonLogin}>
                <Text style={{fontFamily:'Teko_700Bold',...LoginStyles.buttonLoginText}}>LOGIN</Text>
            </TouchableOpacity>
            {loading?<MiniLoading />:''}
            <View style={LoginStyles.errorContainer}>{errors?errors.map((ele,index:number)=><Text style={LoginStyles.errorText} key={index}>{ele.msg}</Text>):''}</View>
       </View>
    )
}
export default Login
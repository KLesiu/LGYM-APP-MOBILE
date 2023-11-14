import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import uniqd from 'uniqid'
import logoLGYM from './img/logoLGYM.png'
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import { RegisterStyles } from './styles/RegisterStyles';
import ErrorMsg from './types/ErrorMsg';
import ErrorRegister from './types/ErrorRegister';
import SuccessMsg from './types/SuccessMsg';
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import { RootStackParamList } from "./types/RootStackParamList";

const Register:React.FC=()=>{
  const [errors, setErrors] = useState<ErrorMsg[]>([]);
  const [username,setUsername]=useState<string>()
  const [password,setPassword]=useState<string>()
  const [rpassword,setRPassword]=useState<string>()
  const [email,setEmail]=useState<string>()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const apiURL =`${process.env.REACT_APP_BACKEND}/api/register`
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
  const register = async():Promise<void>=>{
    if(password !== rpassword ) return setErrors([{msg:'Both passwords need to be same'}])
    if(!username || !email || !password || !rpassword) return setErrors([{msg:'All fields are required'}])
    const response:ErrorRegister|SuccessMsg= await fetch(apiURL,{
      method:'POST',
      headers:{
        "Content-Type": "application/json"
    },
    body:JSON.stringify({
      name:username,
      password:password,
      cpassword:rpassword,
      email:email
  })
    }).then(res=>res.json()).catch(err=>err).then(res=>{
      if(res.msg === `${process.env.REACT_APP_MSG_REGISTER_CREATE}`){
        setErrors([])
        return res.msg
      }else return res
    })
    if(typeof response === 'object' && 'errors' in response){
      return setErrors(response.errors)
    }
    else{
      return navigation.navigate('Login')
    }
  }
    
    return (
        <View style={RegisterStyles.container}>
            <Image style={RegisterStyles.logo} source={logoLGYM}/>
            <Text style={{fontFamily: 'Teko_700Bold',...RegisterStyles.label}}>Username</Text>
            <TextInput onChangeText={(text)=>setUsername(text)} style={RegisterStyles.input}/>
            <Text style={{fontFamily: 'Teko_700Bold',...RegisterStyles.label}}>Email</Text>
            <TextInput onChangeText={(text)=>setEmail(text)} style={RegisterStyles.input}/>
            <Text style={{fontFamily: 'Teko_700Bold',...RegisterStyles.label}}>Password</Text>
            <TextInput secureTextEntry={true} onChangeText={(text)=>setPassword(text)} style={RegisterStyles.input}/>
            <Text style={{fontFamily: 'Teko_700Bold',...RegisterStyles.label}}>Repeat password</Text>
            <TextInput secureTextEntry={true} onChangeText={(text)=>setRPassword(text)} style={RegisterStyles.input}/>
            <TouchableOpacity onPress={register} style={RegisterStyles.buttonRegister}>
                <Text style={{fontFamily:'Teko_700Bold',...RegisterStyles.buttonRegisterText}}>REGISTER</Text>
            </TouchableOpacity>
            <View style={RegisterStyles.errorContainer}>{errors?errors.map((ele,index:number)=><Text style={RegisterStyles.errorText}  key={index}>{ele.msg}</Text>):''}</View>
        </View>
    )
}
export default Register
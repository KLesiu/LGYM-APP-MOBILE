import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import uniqd from 'uniqid'
import { LoginStyles } from './styles/LoginStyles';
import logoLGYM from './img/logoLGYM.png'
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'



const Login:React.FC=()=>{
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    
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
       <View style={LoginStyles.container}>
            <Image style={LoginStyles.logo} source={logoLGYM}/>
            <Text style={LoginStyles.label}>Username</Text>
            <TextInput style={LoginStyles.input} autoComplete="given-name" />
            <Text style={LoginStyles.label}>Password</Text>
            <TextInput style={LoginStyles.input} secureTextEntry={true}></TextInput>
            <TouchableOpacity style={LoginStyles.buttonLogin}>
                <Text style={{fontFamily:'Teko_700Bold',...LoginStyles.buttonLoginText}}>LOGIN</Text>
            </TouchableOpacity>
       </View>
    )
}
export default Login
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import uniqd from 'uniqid'
import logoLGYM from './img/logoLGYM.png'
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import { RegisterStyles } from './styles/RegisterStyles';


const Register:React.FC=()=>{
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
    
    return (
        <View style={RegisterStyles.container}>
            <Image style={RegisterStyles.logo} source={logoLGYM}/>
            <Text style={RegisterStyles.label}>Username</Text>
            <TextInput style={RegisterStyles.input}/>
            <Text style={RegisterStyles.label}>Email</Text>
            <TextInput style={RegisterStyles.input}/>
            <Text style={RegisterStyles.label}>Password</Text>
            <TextInput style={RegisterStyles.input}/>
            <Text style={RegisterStyles.label}>Repeat password</Text>
            <TextInput style={RegisterStyles.input}/>
            <TouchableOpacity style={RegisterStyles.buttonRegister}>
                <Text style={{fontFamily:'Teko_700Bold',...RegisterStyles.buttonRegisterText}}>REGISTER</Text>
            </TouchableOpacity>
        </View>
    )
}
export default Register
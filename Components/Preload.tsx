import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import logoLGYM from './img/logoLGYM.png'
import backgroundLGYM from './img/backgroundLGYMApp500.png'
import { PreloadStyles } from "./styles/PreloadStyles";
import {useState,useEffect} from 'react'
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./types/RootStackParamList";
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import Loading from "./Loading";

const Preload:React.FC=()=>{
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const [isLoading,setIsLoading]=useState<boolean>(true)
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

    const handleLoginPress:VoidFunction=():void=>{
        navigation.navigate('Login')
    }
    const handleRegisterPress:VoidFunction=():void=>{
        navigation.navigate('Register')
    }
    const offLoading=()=>{
        setIsLoading(false)
    }
    if(!fontsLoaded){
        return <View><Text>Loading fonts...</Text></View>
    }
    return(
        <View style={{backgroundColor:'black'}}>
            <ImageBackground source={backgroundLGYM}>
                        <View style={PreloadStyles.preLoadDiv}>
                            <View style={PreloadStyles.preLoadContainer}>
                                <Image source={logoLGYM} style={PreloadStyles.logoLGYMAPP}/>
                                <TouchableOpacity onPress={handleLoginPress}  style={PreloadStyles.login}>
                                    <Text  style={{fontFamily:'Teko_700Bold',...PreloadStyles.loginText}}>LOGIN</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleRegisterPress} style={PreloadStyles.register}>
                                    <Text style={{fontFamily:'Teko_700Bold',...PreloadStyles.registerText}}>REGISTER</Text>
                                </TouchableOpacity>
                               <Text style={{fontFamily:'Caveat_400Regular',...PreloadStyles.quote}}>'Strength does not come from winning. Your struggles develop your strengths. When you go through hardships and decide not to surrender, that is strength. When you make an impasse passable, that is strength. But you must have ego, the kind of ego which makes you think of yourself in terms of superlatives. You must want to be the greatest. We are all starved for compliments. So we do things that get positive feedback.' (Arnold Schwarzenegger, 1982)</Text>
                            </View>
                                
                        </View>
                </ImageBackground>
                
            {isLoading?<Loading offLoading={offLoading} />:''}
            
        </View>

    )
}
export default Preload
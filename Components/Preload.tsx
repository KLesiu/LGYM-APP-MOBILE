import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import logoLGYM from './img/logoLGYM.png'
import backgroundLGYM from './img/backgroundLGYMApp500.png'
import { PreloadStyles } from "./styles/PreloadStyles";
import Login from "./Login";
import {useState,useEffect} from 'react'


const Preload=()=>{
    const [quote,setQuote]=useState<boolean>(false)
    useEffect(()=>{
        setTimeout(()=>setQuote(true),10000)
    },[])
    return(
        <View>
            <ImageBackground source={backgroundLGYM}>
                        <View style={PreloadStyles.preLoadDiv}>
                            <View style={PreloadStyles.preLoadContainer}>
                                <Image source={logoLGYM} style={PreloadStyles.logoLGYMAPP}/>
                                <TouchableOpacity style={PreloadStyles.login}>
                                    <Text style={PreloadStyles.loginText}>LOGIN</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={PreloadStyles.register}>
                                    <Text style={PreloadStyles.registerText}>REGISTER</Text>
                                </TouchableOpacity>
                                {quote?<Text>'Strength does not come from winning. Your struggles develop your strengths. When you go through hardships and decide not to surrender, that is strength. When you make an impasse passable, that is strength. But you must have ego, the kind of ego which makes you think of yourself in terms of superlatives. You must want to be the greatest. We are all starved for compliments. So we do things that get positive feedback.' (Arnold Schwarzenegger, 1982)</Text>:''}
                            </View>
                                
                        </View>
                </ImageBackground>
                
            
            
        </View>

    )
}
export default Preload
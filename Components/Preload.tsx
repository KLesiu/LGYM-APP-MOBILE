import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import logoLGYM from './img/logoLGYM.png'
import backgroundLGYM from './img/backgroundLGYMApp500.png'
import { PreloadStyles } from "./styles/PreloadStyles";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./Login";
const Stack = createNativeStackNavigator();

const Preload=()=>{
    return(
        <View>
            
                <ImageBackground source={backgroundLGYM}>
                        <View style={PreloadStyles.preLoadDiv}>
                            <View style={PreloadStyles.preLoadContainer}>
                                <Image source={logoLGYM} style={PreloadStyles.logoLGYMAPP}/>
                                <TouchableOpacity>
                                    <Text>LOGIN</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text>REGISTER</Text>
                                </TouchableOpacity>
                                    
                            </View>
                                
                        </View>
                </ImageBackground>
                
            
            
        </View>

    )
}
export default Preload
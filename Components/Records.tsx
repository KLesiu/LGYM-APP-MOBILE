import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import backgroundLogo from './img/backgroundLGYMApp500.png'
import { RecordsStyles } from "./styles/RecordsStyles";
const Records:React.FC=()=>{
    return(
        <ImageBackground source={backgroundLogo} style={RecordsStyles.background}>
            <View style={RecordsStyles.recordsContainer}></View>
        </ImageBackground>
    )
}
export default Records
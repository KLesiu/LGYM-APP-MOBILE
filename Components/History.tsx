import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import backgroundLogo from './img/backgroundLGYMApp500.png'
import { HistoryStyles } from "./styles/HistoryStyles";

const History:React.FC=()=>{
    return(
        <ImageBackground style={HistoryStyles.background} source={backgroundLogo}>
            <View style={HistoryStyles.historyContainer}>

            </View>
        </ImageBackground>
        
    )
}
export default History
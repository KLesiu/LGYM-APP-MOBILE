import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import backgroundLogo from './img/backgroundLGYMApp500.png'
import { AddTrainingStyles } from "./styles/AddTrainingStyles";
const AddTraining:React.FC=()=>{
    return(
        <ImageBackground source={backgroundLogo} style={AddTrainingStyles.background}>
            <View style={AddTrainingStyles.addTrainingContainer}></View>
        </ImageBackground>
    )
}
export default AddTraining
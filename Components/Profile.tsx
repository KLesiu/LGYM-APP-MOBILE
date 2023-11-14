import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import backgroundLogo from './img/backgroundLGYMApp500.png'
import { ProfileStyles } from "./styles/ProfileStyles";

const Profile:React.FC=()=>{
    return(
        <ImageBackground source={backgroundLogo} style={ProfileStyles.background}>
            <View style={ProfileStyles.profileContainer}></View>
        </ImageBackground>
    )
}
export default Profile
import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import { TrainingPlanStyles } from "./styles/TrainingPlanStyles";
import backgroundLogo from './img/backgroundLGYMApp500.png'
import {useState} from 'react'
const TrainingPlan:React.FC=()=>{
    const [yourPlan,setYourPlan]=useState<JSX.Element>(<View style={TrainingPlanStyles.withoutPlanContainer}>
        <Text>You dont have any plan</Text>
    </View>)
    return(
        <View style={TrainingPlanStyles.sectionPlan} >
            <ImageBackground style={TrainingPlanStyles.backgroundIMG} source={backgroundLogo}>
                {yourPlan}
            </ImageBackground>
            
        </View>
    )
}
export default TrainingPlan
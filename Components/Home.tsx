import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect,useState} from 'react'
import TrainingPlan from "./TrainingPlan";
import History from "./History";
import AddTraining from "./AddTraining";
import Records from "./Records";
import Profile from "./Profile";
import { HomeStyles } from "./styles/HomeStyles";
import logo300 from './img/logo300.png'
import Menu from "./Menu";

const Home:React.FC=()=>{
    const [view,setView]=useState<JSX.Element>(<TrainingPlan/>)
    const changeView=(view:JSX.Element)=>{
        setView(view)
    }
    return(
        <View style={HomeStyles.main}>
            <View style={HomeStyles.holderForLogo}>
                <Image style={HomeStyles.logoOfHome} source={logo300}/>
            </View>
            {view}
            <Menu viewChange={changeView}/>
        </View>
    )
}
export default Home
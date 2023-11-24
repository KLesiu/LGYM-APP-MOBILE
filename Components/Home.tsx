import {Image,View } from "react-native";

import {useState} from 'react'
import TrainingPlan from "./TrainingPlan";
import { HomeStyles } from "./styles/HomeStyles";
import logo300 from './img/logo300.png'
import Menu from "./Menu";
import Loading from "./Loading";

const Home:React.FC=()=>{
    const [view,setView]=useState<JSX.Element>(<TrainingPlan/>)
    const [isLoading,setIsLoading]=useState<boolean>(true)
    const changeView=(view:JSX.Element)=>{
        setView(view)
    }
    const offLoading=()=>{
        setIsLoading(false)
    }
    return(
        <View style={HomeStyles.main}>
            <View style={HomeStyles.holderForLogo}>
                <Image style={HomeStyles.logoOfHome} source={logo300}/>
            </View>
            {view}
            <Menu viewChange={changeView}/>
            {isLoading?<Loading offLoading={offLoading} />:''}
        </View>
    )
}
export default Home
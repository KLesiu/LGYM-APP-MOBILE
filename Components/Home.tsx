import {Image,View } from "react-native";

import {useState} from 'react'
import TrainingPlan from "./TrainingPlan";
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
        <View className="bg-[#e0e0e0] flex flex-col justify-between relative h-full" >
            <View className="bg-[#2c2c2c7c] flex justify-center w-full h-[10%]">
                <Image className="w-[15%] h-[90%] mx-[42.5%]" source={logo300}/>
            </View>
            {view}
            <Menu viewChange={changeView}/>
            {isLoading?<Loading offLoading={offLoading} />:''}
        </View>
    )
}
export default Home
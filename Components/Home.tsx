import {Image,View } from "react-native";

import {useState} from 'react'
import TrainingPlan from "./TrainingPlan";
import logo300 from './img/logo300.png'
import Menu from "./Menu";
import Loading from "./Loading";
import Header from "./Header";
import Profile from "./Profile";

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
        <View className="bg-[#131313] flex flex-col justify-between relative h-full" >
            {view.type.name === 'Profile'?'':<Header />}
            {view}
            <Menu viewChange={changeView}/>
            {isLoading?<Loading offLoading={offLoading} />:''}
        </View>
    )
}
export default Home
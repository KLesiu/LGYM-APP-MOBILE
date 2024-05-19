import {View } from "react-native";
import {useEffect, useState} from 'react'
import Menu from "./Menu";
import Loading from "./Loading";
import Header from "./Header";
import Start from "./Start";

const Home:React.FC=()=>{
    const [view,setView]=useState<JSX.Element>(<View></View>)
    const [isLoading,setIsLoading]=useState<boolean>(true)
    useEffect(()=>{
        changeView(<Start viewChange={changeView} />)
    },[])
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
import {View } from "react-native";
import {useState} from 'react'
import Menu from "./Menu";
import Loading from "./Loading";
import Header from "./Header";

const Home:React.FC=()=>{
    const [view,setView]=useState<JSX.Element>(<View></View>)
    const [isLoading,setIsLoading]=useState<boolean>(true)
    const changeView=(view:JSX.Element)=>{
        setView(view)
    }
    const offLoading=()=>{
        setIsLoading(false)
    }
    return(
        <View className="bg-[#131313] flex flex-col justify-between relative h-full " >
            {view.type.name === 'Profile'?'':<Header />}
            {view}
            <Menu viewChange={changeView}/>
            {isLoading?<Loading offLoading={offLoading} />:''}
        </View>
    )
}
export default Home
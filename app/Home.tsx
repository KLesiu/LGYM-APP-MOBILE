import {View } from "react-native";
import {useState} from 'react'
import Menu from "./components/layout/Menu";
import Header from "./components//layout/Header";
import Loading from "./components/elements/Loading";
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
        <View className="bg-bgColor flex flex-col justify-between relative h-full " >
            {view.type.name === 'Profile'?'':<Header />}
            {view}
            <Menu viewChange={changeView}/>
            {isLoading?<Loading offLoading={offLoading} />:''}
        </View>
    )
}
export default Home
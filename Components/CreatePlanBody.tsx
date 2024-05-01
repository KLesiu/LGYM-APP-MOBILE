import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { View,Text, Pressable } from "react-native"
import CreateDaySection from "./CreateDaySection"

const CreatePlanBody:React.FC = ()=>{
    const [days,setDays]=useState<number>()
    const [showDaySection,setShowDaySection]=useState<boolean>(false)
    const [currentDay,setCurrentDay]=useState<string>('')
    useEffect(()=>{
        getPlanConfig()
    },[])
    const getPlanConfig = async():Promise<void>=>{
        const id = await AsyncStorage.getItem("id")
        const response:{count:number} =  await fetch(
            `${process.env.REACT_APP_BACKEND}/api/${id}/configPlan`).then(res=>res.json()).catch(err=>console.log(err))
        setDays(response.count)
        }
    const configCurrentyDay = (day:string)=>{
        setCurrentDay(day)
        setShowDaySection(true)
    }
    const generateDaysSections = (numberOfDays:number)=>{
        const trainingDays:string[]=["A","B","C","D","E","F","G"]
        const helpSections:JSX.Element[]=[]
        for(let i=0;i<numberOfDays;i++){
            helpSections.push(<Pressable className="h-20 w-[45%] flex justify-center items-center m-2 rounded-lg border-2 border-[#4CD964]" onPress={()=>configCurrentyDay(trainingDays[i])}>
                <Text className="text-white text-xl text-center">{trainingDays[i]}</Text>
            </Pressable>)

        }
        return helpSections
    }
    return(
        <View  className="absolute h-full w-full flex flex-col  justify-around  bg-black items-center top-0 z-30 p-4 ">
            <Text className="text-2xl text-white">Plan creator!</Text>
            <View className="w-full p-4 h-80 flex flex-row flex-wrap justify-around">
            {days?generateDaysSections(days):''}
            </View>
            <Text className="text-sm text-white">Choose for which day you want to set exercises!</Text>
            {showDaySection ? <CreateDaySection day={currentDay} /> : ''}
        </View>
    )
}
export default CreatePlanBody
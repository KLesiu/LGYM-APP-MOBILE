import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { View,Text, Pressable } from "react-native"
import CreateDaySection from "./CreateDaySection"
import {CompletedDaysInPlan} from './types/Session'
import CreatePlanBodyProps from "./props/CreatePlanBodyProps"
import Exercise from "./types/Exercise"
const CreatePlanBody:React.FC<CreatePlanBodyProps> = (props)=>{
    const [days,setDays]=useState<number>()
    const [showDaySection,setShowDaySection]=useState<boolean>(false)
    const [currentDay,setCurrentDay]=useState<string>('')
    const [completedDays,setCompletedDays]=useState<CompletedDaysInPlan>({count:0,completed:[]})
    const [error,setError]=useState<string>('')
    const trainingDays:string[]=["A","B","C","D","E","F","G"]
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
    const hideConfigCurrentDay= async(day:string)=>{
        setShowDaySection(false)
        const checkDay:Exercise[] = JSON.parse(await AsyncStorage.getItem(day) as string)
        let helperDays:string[]=[]
        let count=0;
        if(checkDay.length < 1){
            helperDays = completedDays.completed.filter(item=>item !== day)
            count = completedDays.count === 0 ? 0 : -1
        }
        else if(completedDays.completed.includes(day)) return
        else{
            helperDays = completedDays.completed
            helperDays.push(day)
            count=1
        }

        const actualStateOfCompletedDays:CompletedDaysInPlan={
            count:completedDays.count+count,
            completed: helperDays
        }
        setCompletedDays(actualStateOfCompletedDays)
        
    }
    const setPlan = async()=>{
        const id = await AsyncStorage.getItem("id")
        const daysToSend = []
        for(let i =0;i<days!;i++){
            const exercises:any[] = JSON.parse(await AsyncStorage.getItem(trainingDays[i]) as string)
            if(exercises.length ===0){
                return setError('All days must be completed!')}
            daysToSend.push({trainingDay:`plan${trainingDays[i]}`,exercises: JSON.parse(await AsyncStorage.getItem(trainingDays[i]) as string)})
        }
        const response:{msg:string} =  await fetch(
            `${process.env.REACT_APP_BACKEND}/api/${id}/setPlan`,{
                method:'POST',
                headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    days: {
                        days:daysToSend
                    }
                    
                  }),
            }).then(res=>res.json()).catch(err=>err)
        if(response.msg==='Updated'){
            props.hideShowPlanSetPopUp()
        }else{
            setError('Error! Try again')
        }
    }
    const generateDaysSections = (numberOfDays:number)=>{
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
            <Text className="text-2xl text-white">Plan creator</Text>
            <View className="w-full p-4 h-80 flex flex-row flex-wrap justify-around">
            {days?generateDaysSections(days):''}
            </View>
            <Pressable disabled={completedDays.count !== days} onPress={setPlan} className="bg-[#4CD964] w-40 h-12 flex items-center justify-center rounded-lg"><Text style={{fontFamily:'OpenSans_400Regular'}} className="text-white text-2xl">DONE</Text></Pressable>
            <Text className="text-sm text-gray-300">Choose for which day you want to set exercises!</Text>
            {showDaySection ? <CreateDaySection day={currentDay} hideConfigCurrentDay={hideConfigCurrentDay} /> : ''}
            <Text className="text-sm text-white">Completed sections: {completedDays.completed.map(ele=><Text>{ele}, </Text>)}</Text>
            <Text className="text-sm text-white">Completed: {completedDays.count}/{days}</Text>
            {error? <Text className="text-red-400 text-sm">{error}</Text>:''}
        </View>
    )
}
export default CreatePlanBody
import { useEffect, useState } from "react"
import AddMeasurementsPopUpProps from "./props/AddMeasurementsPopUpProps"
import { View,Text, TextInput, ScrollView, Pressable } from "react-native"
import { MeasurementForm } from "./types/Measurements"
import { isIntValidator,isFloatValidator } from "./helpers/numberValidator"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Message } from "./enums/Message"
import SuccessMsg from "./types/SuccessMsg"
import ErrorMsg from "./types/ErrorMsg"

const AddMeasurementsPopUp:React.FC<AddMeasurementsPopUpProps>= (props)=>{
    const [elementsForm,setElementsForm]= useState<JSX.Element[]>()
    const [measurements,setMeasurements]=useState<MeasurementForm>()
    useEffect(()=>{
        if(measurements) return
        setMeasurements(props.measurements)
    },[props.measurements])
    useEffect(()=>{
        if(measurements) renderForm(measurements)
    },[measurements])
    const changeFormValue = (key:string,value:string)=>{
        if(!isFloatValidator(value) || !isIntValidator(value)) return
        const measurementState = measurements as MeasurementForm
        measurementState[key as keyof MeasurementForm]= parseFloat(value)
        setMeasurements(measurementState)
    }
    const renderForm = (measurementsObject:MeasurementForm)=>{
        const keys = Object.keys(measurementsObject)
        const values = Object.values(measurementsObject)
        setElementsForm(keys.map((ele:string,index:number)=>{
            return(
                <View className="flex flex-row py-2 pl-6 justify-between items-center m-0">
                <Text
                  style={{ fontFamily: "OpenSans_300Light" }}
                  className="text-gray-200/80 font-light leading-4 text-sm"
                >
                  {ele}
                </Text>
                <View className="bg-[#1E1E1E73] w-36 h-16 py-4 px-6 rounded-lg flex justify-center items-center m-0">
                  <TextInput
                   keyboardType = 'numeric'
                   placeholder={`${values[index]}`}
                    style={{ fontFamily: "OpenSans_400Regular" }}
                    className="text-gray-200/80 font-base leading-4 px-2 w-32 flex text-center justify-center text-md"
                    onChangeText={(text:string)=>changeFormValue(ele,text)}
                  />
                </View>
              </View>
            )
        }))
    }
    const sendForm = async()=>{
        if(!measurements) return
        const id = await AsyncStorage.getItem("id")
        const response:SuccessMsg | ErrorMsg = await fetch(
            `${process.env.REACT_APP_BACKEND}/api/measurements/${id}/addNew`,{
                method:'POST',
                headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    weight:measurements.weight,
                    neck:measurements.neck,
                    chest:measurements.chest,
                    biceps:measurements.biceps,
                    waist:measurements.waist,
                    abdomen:measurements.abdomen,
                    hips:measurements.hips,
                    thigh:measurements.thigh,
                    calf:measurements.calf

                  }),
            }
          ).then(res=>res.json()).catch(err=>err)
          if(response.msg===Message.Created){
            props.hideForm()
          }
        
    }
    return(
        <View className="absolute h-full w-full flex flex-col justify-center  bg-black items-center top-0 z-30 p-4 ">
            <ScrollView className="w-full h-3/4 p-2">
            {elementsForm?elementsForm:''}
            </ScrollView>
            <Pressable onPress={sendForm} className="w-full rounded-lg py-4 px-6 gap-1 m-0  bg-[#4CD964] flex justify-center items-center">
            <Text className="text-xl text-black" style={{fontFamily:'OpenSans_700Bold'}}>UPDATE</Text>
            </Pressable>
            
        </View>
    )
}
export default AddMeasurementsPopUp
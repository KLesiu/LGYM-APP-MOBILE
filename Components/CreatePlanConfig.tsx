import {useState } from "react";
import { View, Text ,TextInput,  Pressable} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isIntValidator } from "./helpers/numberValidator";
import CreatePlanConfigProps from "./props/CreatePlanConfigProps";
import ResponseMessage from "./interfaces/ResponseMessage";
import { Message } from "./enums/Message";
const CreatePlanConfig: React.FC<CreatePlanConfigProps> = (props) => {
  const [planName,setPlanName]=useState<string>('')
  const [numberOfDays,setNumberOfDays]=useState<string>('')
  const [error,setError]=useState<string>()
  
  const sendConfig = async ():Promise<void>=>{
    if(!planName || !numberOfDays) return setError("All fields are required")
    const id = await  AsyncStorage.getItem("id")
    const response: ResponseMessage = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/${id}/createPlan`
      ,{
        method:'POST',
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trainingDays: numberOfDays,
            name:planName
          }),
        
      }).then(res=>res.json()).catch(err=>console.log(err))
    if(response.msg === Message.Created
    ){
       return props.reloadSection()
    }else{
      return setError(response.msg)
    }
  }
  const validator = (input:string):void=>{
    if(!input)return setNumberOfDays(input)
    const result = isIntValidator(input)
    if(result) setNumberOfDays(input)
  }
  
  return (
    <View className="absolute h-full w-full flex flex-col justify-center  bg-[#121212] items-center top-0 z-30 p-4 ">
      <Text
        className="text-3xl text-white text-center border-b-2 border-[#94e798] p-4 w-full"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        PLAN CONFIG
      </Text>
      <View className="flex h-2/3 w-4/5 items-center flex-col justify-around ">
        <View>
        <View className="flex justify-flex items-center w-full ">
          <Text style={{fontFamily:'OpenSans_700Bold'}} className="text-white text-xl">Plan name:</Text>
          <TextInput style={{fontFamily:'OpenSans_400Regular'}} className="bg-white h-8 w-72 text-[#121212] " onChangeText={(text:string)=>setPlanName(text)} value={planName}/>
        </View>
        <View className="flex justify-flex items-center w-full ">
          <Text  style={{fontFamily:'OpenSans_700Bold'}} className=" px-4 text-white text-center text-lg" >How many days per week do you want to train?</Text>
          <TextInput style={{fontFamily:'OpenSans_400Regular'}} className="bg-white h-8 w-72 text-[#121212] " keyboardType = 'numeric' onChangeText={validator} value={numberOfDays}/>
        </View>
        </View>
        <Pressable onPress={sendConfig} className="bg-[#94e798] w-40 h-12 flex items-center justify-center rounded-lg">
            <Text className="text-xl" style={{fontFamily:'OpenSans_700Bold'}}>Next</Text>
        </Pressable>
      </View>
        {error? <Text style={{fontFamily:'OpenSans_300Light'}} className="text-red-500 text-lg">{error}</Text> : ''}
    </View>
  );
};

export default CreatePlanConfig;

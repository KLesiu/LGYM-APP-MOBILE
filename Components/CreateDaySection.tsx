import { useState } from "react";
import { TextInput, View,Text, Pressable } from "react-native"
import Exercise from "./types/Exercise"
import CreateDaySectionProps from "./props/CreateDaySectionProps";
import { isValidExerciseArray } from "./helpers/planValidator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { removeEmptyElements } from "./helpers/arrayValidator";

const CreateDaySection:React.FC<CreateDaySectionProps> =(props)=>{
    const [text, setText] = useState<string>('');
    const [error,setError]=useState<string>()

  
    const parseTextArea = async(text:string):Promise<void> => {
      let lines = text.split('\n');
      lines = removeEmptyElements(lines)
      const newExercises:Exercise[] = lines.map(line => {
      const parts = line.split(' ');
      const name = parts.slice(0, parts.length - 1).join(' '); 
      const [seriesReps] = parts.slice(-1);
      const [seriesStr, reps] = seriesReps.split('x');
      const series = parseInt(seriesStr);
      return { name, series, reps };
    });
    if(!isValidExerciseArray(newExercises)){
      return setError('Wrong syntax, please fix it!')
    }
    await AsyncStorage.setItem(props.day,JSON.stringify(newExercises).toString())
    props.hideConfigCurrentDay(props.day)
      
    };
    return(
        <View className="flex z-50 flex-col justify-around items-center absolute top-0 left-0 w-full h-full p-4 bg-black">
        <Text style={{fontFamily:'OpenSans_700Bold'}} className="text-2xl text-white">Set your exercises to day {props.day} </Text>
        <TextInput
        className="h-40 bg-white text-black w-full"
        multiline
        placeholder="Dead Lift 3x8-12
        Squat 4x9
        "
        value={text}
        onChangeText={(text:string)=>setText(text)}
      />
      <Pressable onPress={()=>parseTextArea(text)} className="bg-[#4CD964] w-40 h-12 flex items-center justify-center rounded-lg"><Text style={{fontFamily:'OpenSans_400Regular'}} className="text-white text-2xl">DONE</Text></Pressable>
      {error?<Text style={{fontFamily:'OpenSans_300Light'}} className="text-red-500 text-lg">{error}</Text>:''}
        </View>
    )
}

export default CreateDaySection
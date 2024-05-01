import { useState } from "react";
import { TextInput, View,Text, Pressable } from "react-native"
import Exercise from "./types/Exercise"
import CreateDaySectionProps from "./props/CreateDaySectionProps";

const CreateDaySection:React.FC<CreateDaySectionProps> =(props)=>{
    const [text, setText] = useState('');
    const [exercises, setExercises] = useState<Exercise[]>([]);
  
    const parseTextArea = () => {
      const lines = text.split('\n');
      const newExercises:Exercise[] = lines.map(line => {
        const [name, seriesReps] = line.split(' ');
        const [seriesStr, reps] = seriesReps.split('x');
        const series = parseInt(seriesStr);
        return { name, series, reps };
      });
      setExercises(newExercises);
    };
    return(
        <View className="flex z-50 absolute top-0 left-0 w-full h-full p-4 bg-black">
        <Text style={{fontFamily:'OpenSans_700Bold'}} className="text-2xl text-white">Set your exercises to day {props.day} </Text>
        <TextInput
        className="h-40 bg-white text-black w-full"
        multiline
        placeholder="Dead Lift 3x8-12
        Squat 4x9
        "
        value={text}
        onChangeText={setText}
      />
      <Pressable className="bg-[#4CD964] w-40 h-12 flex items-center justify-center rounded-lg"><Text style={{fontFamily:'OpenSans_400Regular'}} className="text-white text-2xl">DONE</Text></Pressable>
        </View>
    )
}

export default CreateDaySection
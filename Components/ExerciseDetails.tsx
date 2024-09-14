import { View } from "react-native"
import { ExerciseForm } from "./interfaces/Exercise"
import CreateExercise from "./CreateExercise"

const ExerciseDetails: React.FC<{exercise:ExerciseForm}> = (props) => {

return(
    <View  className="absolute h-full w-[95%] flex flex-col  bg-black  top-0 z-30 p-4">
        <CreateExercise form={props.exercise}/>
    </View>
)
}

export default ExerciseDetails
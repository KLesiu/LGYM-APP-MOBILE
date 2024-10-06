import { View } from "react-native"
import { ExerciseForm } from "./interfaces/Exercise"
import CreateExercise from "./CreateExercise"

const ExerciseDetails: React.FC<{exercise:ExerciseForm,hideDetails:()=>Promise<void>}> = (props) => {

return(
    <View  className="absolute h-full w-full flex flex-col  bg-black  top-0 z-30 p-4">
        <CreateExercise closeForm={props.hideDetails} form={props.exercise}/>
    </View>
)
}

export default ExerciseDetails
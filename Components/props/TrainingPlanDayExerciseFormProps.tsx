import { DropdownItem } from "../Autocomplete";
import { BodyParts } from "../enums/BodyParts";


export default interface TrainingPlanDayExerciseFormProps {
    cancel: () => void;
    addExerciseToPlanDay: (exerciseId:string,series:number,reps:string) => Promise<void>;
    bodyPart: BodyParts | undefined;
}
import { DropdownItem } from "../Autocomplete"
import { BodyParts } from "../enums/BodyParts"
export interface ExerciseForm{
    _id?:string,
    name:string,
    user?:string,
    bodyPart:BodyParts,
    description:string,
    image:string
}

export interface ExerciseForPlanDay{
    series:number,
    reps:string,
    exercise:DropdownItem
}

export interface ExerciseTrainingHistoryDetails{
    _id: string;
    name: string;
    bodyPart: BodyParts;
}



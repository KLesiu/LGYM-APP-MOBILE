import ExerciseTraining from "./ExerciseTraining"
type Training={
    user:string,
    type:string,
    exercises:Array<ExerciseTraining>,
    createdAt:string
    _id:string
}
export type LastTrainingModel = {
    name:string,
    prevReps:ExerciseTraining[]
    prevWeights:ExerciseTraining[]
    reps:string,
    series:number
}
export type TrainingsDates = {
    dates: Date[]
}

export type MarkedDates = {
    date:Date | string
    dots: {color:string,selectedColor?:string}[]
}



export default Training
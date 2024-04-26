import  ExerciseTraining  from "./ExerciseTraining";
type Session={
    symbol:string,
    date:string,
    exercises:Array<ExerciseTraining>,
    notes?: string,
    id?:string
}
export type ExerciseTrainingSession={
    exercises: ExerciseTraining[],
    name:string
}
export type ScaledExerciseTraining={
    name:string
}
export type ExerciseTrainingScaledSession = {
    exercises: ScaledExerciseTraining[],
    name:string 
}
export default Session
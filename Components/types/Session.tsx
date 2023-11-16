import  ExerciseTraining  from "./ExerciseTraining";
type Session={
    symbol:string,
    date:string,
    exercises:Array<ExerciseTraining>,
    notes?: string,
    id?:string
}
export default Session
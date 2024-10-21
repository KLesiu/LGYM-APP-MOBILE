import { LastExerciseScores } from "../interfaces/Exercise";
import { TrainingSessionScores } from "../interfaces/Training";

export default interface TrainingPlanDayProps{
    hideChooseDaySection:()=>void,
    hideDaySection:()=>void,
    hideAndDeleteTrainingSession:()=>void,
    addTraining:(exercises: TrainingSessionScores[],lastExercisesScores:LastExerciseScores[] | undefined)=>Promise<void>,
    dayId:string
}
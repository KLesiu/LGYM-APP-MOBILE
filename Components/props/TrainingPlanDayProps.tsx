import { TrainingSessionScores } from "../interfaces/Training";

export default interface TrainingPlanDayProps{
    hideChooseDaySection:()=>void,
    hideDaySection:()=>void,
    hideAndDeleteTrainingSession:()=>void,
    addTraining:(exercises: TrainingSessionScores[])=>Promise<void>,
    dayId:string
}
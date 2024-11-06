import FieldScore from "./FieldScore"
import { ExerciseScoresForm,ExerciseScoresTrainingForm } from "./ExercisesScores"
import { ExerciseForm } from "./Exercise";
import { ExerciseTrainingHistoryDetails } from "./Exercise";
import { Message } from "../../enums/Message";
import { Rank } from "./User";
interface TrainingForm{
    type:string,
    createdAt:Date,
    exercises:ExerciseScoresTrainingForm[]
}

interface TrainingSessionScores{
    exercise: ExerciseForm;
    series: number;
    reps: number;
    weight: number;
}

interface LastTrainingInfo{
    _id:string,
    type:string,
    createdAt:Date,
    planDay:{
        name:string
    }
}
interface TrainingByDate extends LastTrainingInfo{
    exercises: {exerciseScoreId:string}[]
}

interface TrainingByDateDetails extends LastTrainingInfo{
    exercises:{
        exerciseScoreId:string,
        scoresDetails:ExerciseScoresTrainingForm[]
        exerciseDetails:ExerciseTrainingHistoryDetails
    }[]
   
}







interface TrainingHistoryQuery{
    startDt:Date,
    endDt:Date
}


interface TrainingSummary{
    progress:{
        bestProgress:{
            exercise:string,
            series:number,
            repsScore:number,
            weightScore:number
        },
        worseRegress:{
            exercise:string,
            series:number,
            repsScore:number,
            weightScore:number
        }
    },
    gainElo:number,
    userOldElo:number,
    profileRank:Rank,
    nextRank:Rank | null,
    msg: Message


}





export {TrainingForm,LastTrainingInfo,TrainingHistoryQuery,TrainingByDate,TrainingByDateDetails,TrainingSessionScores,TrainingSummary}





export interface AddTrainingBody{
    day:string,
    training:FieldScore[],
    createdAt:string
}
export interface TrainingHistory{
    trainingHistory: TrainingSession[]
}
export interface Training{
    training?:TrainingSession
    prevSession?:TrainingSession
}
export interface TrainingSession{
    _id: string,
    user:string,
    day:string,
    exercises: FieldScore[],
    createdAt:string,
    plan:string
}

export interface RankInfo{
    rank:string,
    elo:number,
    nextRank:string,
    nextRankElo:number,
    startRankElo:number
}

export interface TrainingsDates{
    dates: Date[]
}



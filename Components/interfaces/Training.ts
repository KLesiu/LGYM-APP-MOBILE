import FieldScore from "./FieldScore"
import { ExerciseScoresForm,ExerciseScoresTrainingForm } from "./ExercisesScores"
import { ExerciseForm } from "./Exercise";

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


export {TrainingForm,TrainingSessionScores,LastTrainingInfo}





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



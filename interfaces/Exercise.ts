import { DropdownItem } from "./Dropdown";
import { ExerciseResponseDto, EnumLookupDto } from "../api/generated/model";
import { BodyParts } from "../enums/BodyParts";

interface ExerciseForm {
    _id?: string | null;
    name?: string | null;
    user?: string | null;
    bodyPart?: EnumLookupDto | null;
    description?: string | null;
    image?: string | null;
}

interface ExerciseToCopy {
    _id?: string;
    name: string;
    user: string;
    bodyPart: EnumLookupDto;
    description?: string;
    image?: string;
}

interface ExerciseForPlanDay{
    series:number,
    reps:string,
    exercise:DropdownItem
}

interface ExerciseTrainingHistoryDetails{
    _id: string;
    name: string;
    bodyPart: BodyParts;
}

interface LastExerciseScores{
   exerciseId:string,
   name:string,
   seriesScores:SeriesScore[] 
}

interface LastExerciseScoresWithGym{
    exerciseId:string,
    exerciseName:string,
    seriesScores:SeriesScoreWithGym[] 
}

interface Score {
    reps: number;
    weight: number;
    unit: string;
    _id: string;
  }
  
  interface ScoreWithGym extends Score {
    gymName: string;
  }
  
  interface SeriesScore {
    series: number;
    score: Score | null;
  }
  
  interface SeriesScoreWithGym extends SeriesScore {
    score: ScoreWithGym; 
  }


  interface ExerciseHistoryDetails{
    trainings: ExerciseTrainingHistoryItem[]

  }

  interface ExerciseTrainingHistoryItem{
    _id:string,
    date:Date,
    gymName:string,
    trainingName:string,
    seriesScores: SeriesScore[]
  }

export {ExerciseForm,ExerciseTrainingHistoryDetails,ExerciseForPlanDay,LastExerciseScores,SeriesScore,LastExerciseScoresWithGym,SeriesScoreWithGym,ExerciseTrainingHistoryItem,ExerciseHistoryDetails,ExerciseToCopy}


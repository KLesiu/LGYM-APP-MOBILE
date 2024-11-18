import { WeightUnits } from "../enums/Units";

interface ExerciseScoresTrainingForm{
    _id?: string;
    weight: number;
    unit:WeightUnits;
    reps: number;
    exercise: string;
    series: number;
}

interface ExerciseScoresForm extends ExerciseScoresTrainingForm{
    _id?: string;
    user: string;
    training: string;
    date:Date
}

export {ExerciseScoresTrainingForm,ExerciseScoresForm}
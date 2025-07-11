import { ExerciseForm } from "./Exercise";
interface PlanDayForm {
  _id?: string;
  name: string;
  exercises?: {
    series: number;
    reps: string;
    exercise: ExerciseForm | null;
  }[];
}

interface PlanDayBaseInfoVm{
  _id:string,
  name:string,
  lastTrainingDate?:Date,
  totalNumberOfSeries:number,
  totalNumberOfExercises:number
}

interface PlanDayVm {
  _id: string;
  name: string;
  exercises:PlanDayExercisesFormVm[] ;
}


interface PlanDayExercisesFormVm{
  series: number;
  reps: string;
  exercise: ExerciseForm;
}

interface PlanDayExercise{
  series:number,
  reps:string,
  exerciseId:string,
  exerciseName:string,
}



interface PlanDayChoose{
  _id: string;
  name: string;
}

interface PlanDayExercise{
  series: number;
  reps: string;
  exercise:string;
  _id:string;
}


export {PlanDayExercise, PlanDayForm, PlanDayVm,PlanDayChoose,PlanDayBaseInfoVm,PlanDayExercisesFormVm};
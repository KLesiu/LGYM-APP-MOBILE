import { ExerciseForm } from "../interfaces/Exercise";

export default interface CreateExerciseProps{
    closeForm?: ()=>void,
    form?: ExerciseForm
}
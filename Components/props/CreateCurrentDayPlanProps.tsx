import Exercise from "../types/Exercise"
export default interface CreateCurrentDayProps{

    day:string
    setCurrentPlanDay:any
    planA: Array<Exercise> | null
    planB: Array<Exercise> | null
    planC: Array<Exercise> | null
    planD: Array<Exercise> | null
    planE: Array<Exercise> | null
    planF: Array<Exercise> | null
    planG: Array<Exercise> | null
    setPlanA: React.Dispatch<React.SetStateAction<Exercise[] | undefined>>
    setPlanB:React.Dispatch<React.SetStateAction<Exercise[] | undefined>>,
    setPlanC:React.Dispatch<React.SetStateAction<Exercise[] | undefined>>,
    setPlanD:React.Dispatch<React.SetStateAction<Exercise[] | undefined>>,
    setPlanE:React.Dispatch<React.SetStateAction<Exercise[] | undefined>>,
    setPlanF:React.Dispatch<React.SetStateAction<Exercise[] | undefined>>,
    setPlanG:React.Dispatch<React.SetStateAction<Exercise[] | undefined>>
}
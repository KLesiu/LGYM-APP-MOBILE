import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {  PlanDayExercisesFormVm, PlanDayVm } from "../../../../../interfaces/PlanDay";
import { TrainingSessionScores } from "../../../../../interfaces/Training";
import { LastExerciseScores } from "../../../../../interfaces/Exercise";
import { GymForm } from "../../../../../interfaces/Gym";

interface TrainingPlanDayContextType {
    setPlanDay: (planDay: PlanDayVm) => void;
    planDay: PlanDayVm | undefined;
    setTrainingSessionScores: (
      scores: Array<TrainingSessionScores>) => void;
    trainingSessionScores: Array<TrainingSessionScores>;
    lastExerciseScores: LastExerciseScores[] | undefined;
    setLastExerciseScores: (scores: LastExerciseScores[]) => void;
    currentExercise: PlanDayExercisesFormVm | undefined;
    setCurrentExercise: (exercise: PlanDayExercisesFormVm) => void;
    gym: GymForm | undefined;
    planDayName:string,
    gymName:string,
    exercisesInPlanList:PlanDayExercisesFormVm[] | undefined
}

const TrainingPlanDayContext = createContext<TrainingPlanDayContextType | null>(
  null
);

export const useTrainingPlanDay = () => {
  const context = useContext(TrainingPlanDayContext);
  if (!context) {
    throw new Error(
      "useTrainingPlanDay must be used within TrainingPlanDayProvider"
    );
  }
  return context;
};

interface TrainingPlanDayProviderProps {
  children: React.ReactNode;
  gym: GymForm | undefined;
}

const TrainingPlanDayProvider: React.FC<TrainingPlanDayProviderProps> = ({
  children,gym
}) => {
  const [planDay, setPlanDay] = useState<PlanDayVm>();
  const [trainingSessionScores, setTrainingSessionScores] = useState<
    Array<TrainingSessionScores>
  >([]);
  const [lastExerciseScores, setLastExerciseScores] =
    useState<LastExerciseScores[]>();
  const [currentExercise, setCurrentExercise] = useState<PlanDayExercisesFormVm>();

  useEffect(() => {
    if (planDay && planDay.exercises) {
      const initialScores = planDay.exercises.flatMap((exercise) => {
        return Array.from({ length: exercise.series }).map((_, seriesIndex) => {
          const existingScore = trainingSessionScores.find(
            (score) =>
              score.exercise._id === exercise.exercise?._id &&
              score.series === seriesIndex + 1
          );
          return (
            existingScore || {
              exercise: exercise.exercise,
              series: seriesIndex + 1,
              reps: 0,
              weight: 0,
            }
          );
        });
      });
      setTrainingSessionScores(initialScores);
    }
  }, [planDay]);

  const planDayName = useMemo(()=>planDay?.name ?? "",[planDay?.name])
  const gymName = useMemo(()=>gym?.name ?? "",[gym?.name])
  const exercisesInPlanList = useMemo(()=>planDay?.exercises,[planDay])

  return (
    <TrainingPlanDayContext.Provider value={{exercisesInPlanList,currentExercise,setCurrentExercise,setPlanDay,gym,gymName,planDayName, planDay,setLastExerciseScores,lastExerciseScores,trainingSessionScores,setTrainingSessionScores}}>
      {children}
    </TrainingPlanDayContext.Provider>
  );
};

export default TrainingPlanDayProvider;

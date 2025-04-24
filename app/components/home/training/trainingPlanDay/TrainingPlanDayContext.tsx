import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  PlanDayExercisesFormVm,
  PlanDayVm,
} from "../../../../../interfaces/PlanDay";
import { TrainingSessionScores } from "../../../../../interfaces/Training";
import { GymForm } from "../../../../../interfaces/Gym";
import { LastExerciseScoresWithGym } from "../../../../../interfaces/Exercise";

interface TrainingPlanDayContextType {
  setPlanDay: (planDay: PlanDayVm) => void;
  planDay: PlanDayVm | undefined;
  setTrainingSessionScores: (scores: Array<TrainingSessionScores>) => void;
  trainingSessionScores: Array<TrainingSessionScores>;
  currentExercise: PlanDayExercisesFormVm | undefined;
  setCurrentExercise: (exercise: PlanDayExercisesFormVm) => void;
  gym: GymForm | undefined;
  planDayName: string;
  exercisesInPlanList: PlanDayExercisesFormVm[] | undefined;
  isGymFilterActive: boolean;
  setIsGymFilterActive: (isActive: boolean) => void;
  toggleGymFilter: () => void;
  lastExerciseScoresWithGym: LastExerciseScoresWithGym[];
  setLastExerciseScoresWithGym: (
    lastExerciseScoresWithGym: LastExerciseScoresWithGym[]
  ) => void;
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
  children,
  gym,
}) => {
  const [planDay, setPlanDay] = useState<PlanDayVm>();
  const [trainingSessionScores, setTrainingSessionScores] = useState<
    Array<TrainingSessionScores>
  >([]);
  const [currentExercise, setCurrentExercise] =
    useState<PlanDayExercisesFormVm>();
  const [isGymFilterActive, setIsGymFilterActive] = useState(true);
  const [lastExerciseScoresWithGym, setLastExerciseScoresWithGym] = useState<
    LastExerciseScoresWithGym[]
  >([]);
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

  const planDayName = useMemo(() => planDay?.name ?? "", [planDay?.name]);
  const exercisesInPlanList = useMemo(() => planDay?.exercises, [planDay]);

  const toggleGymFilter = () => {
    setIsGymFilterActive((prev) => !prev);
  };

  return (
    <TrainingPlanDayContext.Provider
      value={{
        exercisesInPlanList,
        currentExercise,
        setCurrentExercise,
        setPlanDay,
        gym,
        planDayName,
        planDay,
        trainingSessionScores,
        setTrainingSessionScores,
        toggleGymFilter,
        isGymFilterActive,
        setIsGymFilterActive,
        lastExerciseScoresWithGym,
        setLastExerciseScoresWithGym
      }}
    >
      {children}
    </TrainingPlanDayContext.Provider>
  );
};

export default TrainingPlanDayProvider;

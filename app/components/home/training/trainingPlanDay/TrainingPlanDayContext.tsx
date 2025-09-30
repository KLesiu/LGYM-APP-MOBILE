import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  PlanDayExercisesFormVm,
  PlanDayVm,
} from "../../../../../interfaces/PlanDay";
import { TrainingSessionScores } from "../../../../../interfaces/Training";
import { GymForm } from "../../../../../interfaces/Gym";
import { LastExerciseScoresWithGym } from "../../../../../interfaces/Exercise";
import { useAppContext } from "../../../../AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useInterval from "../../../../../helpers/hooks/useInterval";
import { ScrollView } from "react-native";
import React from "react";

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
  sendPlanDayToLocalStorage: (planDay: PlanDayVm) => Promise<void>;
  addNewExerciseToTrainingSessionScores: (
    exercise: PlanDayExercisesFormVm
  ) => void;
  incrementOrDecrementExerciseInTrainingSessionScores: (
   exerciseId: string,
   series: number,
  ) => void;
  scrollViewRef: React.RefObject<ScrollView | null>;
  scrollToTop: () => void;
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
  dayId: string;
}

const TrainingPlanDayProvider: React.FC<TrainingPlanDayProviderProps> = ({
  children,
  gym,
  dayId,
}) => {
  const { getAPI } = useAppContext();
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
  const [intervalDelay, setIntervalDelay] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    init();
    return () => {
      setIntervalDelay(null);
    };
  }, []);

  useInterval(() => {
    if (!intervalDelay) return;
    saveTrainingSessionScores();
  }, intervalDelay);

  const planDayName = useMemo(() => planDay?.name ?? "", [planDay?.name]);
  const exercisesInPlanList = useMemo(() => planDay?.exercises, [planDay]);

  const createScoresForExercise = (exercise: PlanDayExercisesFormVm) => {
    return Array(exercise.series)
      .fill(null)
      .map((_, i) => ({
        exercise: exercise.exercise,
        series: i + 1,
        reps: "",
        weight: "",
      }));
  };

  const init = async () => {
    const response = (await initExercisePlanDay()) as PlanDayVm;
    const storedScores =
      (await loadTrainingSessionScores()) as TrainingSessionScores[];

    if (response?.exercises) {
      const initialScores = response.exercises.flatMap((exercise) => {
        return createScoresForExercise(exercise).map((defaultScore) => {
          const existingScore = storedScores.find(
            (score) =>
              score.exercise._id === defaultScore.exercise._id &&
              score.series === defaultScore.series
          );
          return existingScore || defaultScore;
        });
      });

      setTrainingSessionScores(initialScores);
    }
    setIntervalDelay(1000);
  };

  const addNewExerciseToTrainingSessionScores = (
    exercise: PlanDayExercisesFormVm
  ) => {
    if (!exercise.series || !exercise.exercise) return;

    const newScores = createScoresForExercise(exercise);

    setTrainingSessionScores((prevScores) => {
      const filteredScores =
        prevScores?.filter(
          (score) => score.exercise._id !== exercise.exercise?._id
        ) ?? [];

      return [...filteredScores, ...newScores];
    });
  };

  const incrementOrDecrementExerciseInTrainingSessionScores = (
    exerciseId:string,
    seriesChange: number,
  ) => {

    const currentTrainingSessionScoresWithThisExericse =
      trainingSessionScores.filter(
        (score) => score.exercise._id === exerciseId
      );
      if(seriesChange < 0){
        currentTrainingSessionScoresWithThisExericse.pop()
      }else{
        currentTrainingSessionScoresWithThisExericse.push({
          exercise: currentTrainingSessionScoresWithThisExericse[0].exercise,
          series: currentTrainingSessionScoresWithThisExericse.length +1,
          reps: '',
          weight: ''
        })
      }

      const newTrainingSessionScores = trainingSessionScores.filter(x=>x.exercise._id !== exerciseId)
      setTrainingSessionScores([
        ...newTrainingSessionScores,
        ...currentTrainingSessionScoresWithThisExericse
      ]);
  };

  const toggleGymFilter = () => {
    setIsGymFilterActive((prev) => !prev);
  };

  const scrollToTop = () => {
  scrollViewRef.current?.scrollTo({ y: 0, animated: true });
};


  /// Load training session scores from local storage
  const loadTrainingSessionScores = async () => {
    const savedScores = await AsyncStorage.getItem("trainingSessionScores");
    const parsedScores = savedScores ? JSON.parse(savedScores) : [];
    if (parsedScores && parsedScores.length) {
      setTrainingSessionScores(parsedScores);
    }
    return parsedScores ?? [];
  };

  /// Get information about plan day from API
  const getInformationAboutPlanDay = async () => {
    let planDayFromApi: PlanDayVm | undefined;
    await getAPI(
      `/planDay/${dayId}/getPlanDay`,
      async (result: PlanDayVm) => {
        planDayFromApi = result;
        setPlanDay(result);
        setCurrentExercise(result.exercises[0]);
        await sendPlanDayToLocalStorage(result);
      },
      undefined,
      false
    );
    return planDayFromApi;
  };

  /// Save training session scores to local storage
  const saveTrainingSessionScores = async () => {
    await AsyncStorage.setItem(
      "trainingSessionScores",
      JSON.stringify(trainingSessionScores)
    );
  };

  /// Save plan day to local storage
  const sendPlanDayToLocalStorage = async (planDay: PlanDayVm) => {
    await AsyncStorage.setItem("planDay", JSON.stringify(planDay));
    await AsyncStorage.setItem("gym", JSON.stringify(gym));
  };

  /// Get information about plan day from local storage or API
  const initExercisePlanDay = async () => {
    const planDayFromStorage = await getPlanDayFromLocalStorage();
    if (planDayFromStorage && Object.keys(planDayFromStorage).length)
      return planDayFromStorage;
    const response = await getInformationAboutPlanDay();
    return response;
  };

  /// Get plan day from local storage
  const getPlanDayFromLocalStorage = async (): Promise<any> => {
    const planDay = await AsyncStorage.getItem("planDay");
    if (
      !planDay ||
      !JSON.parse(planDay) ||
      !Object.keys(JSON.parse(planDay)).length
    )
      return false;
    const result = JSON.parse(planDay);
    setPlanDay(result);
    setCurrentExercise(result.exercises[0]);
    return result;
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
        setLastExerciseScoresWithGym,
        sendPlanDayToLocalStorage,
        addNewExerciseToTrainingSessionScores,
        incrementOrDecrementExerciseInTrainingSessionScores,
        scrollViewRef,
        scrollToTop,

      }}
    >
      {children}
    </TrainingPlanDayContext.Provider>
  );
};

export default TrainingPlanDayProvider;

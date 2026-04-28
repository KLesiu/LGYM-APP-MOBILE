import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState, type AppStateStatus, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getGetApiPlanDayIdGetPlanDayQueryOptions } from '../../../../../api/generated/plan-day/plan-day';
import type {
  PlanDayVmDto,
  LastExerciseScoresResponseDto,
} from '../../../../../api/generated/model';
import { encryptedStorage } from '../../../../../lib/encryptedStorage';
import React from 'react';
import type {
  GymForm,
  PlanDayExercisesFormVm,
  PlanDayVm,
  TrainingSessionScores,
} from '../../../../../types/models';
import { sanitize } from '../../../../../lib/domain/errorHandler';

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
  lastExerciseScoresWithGym: LastExerciseScoresResponseDto[];
  setLastExerciseScoresWithGym: (
    lastExerciseScoresWithGym: LastExerciseScoresResponseDto[],
  ) => void;
  sendPlanDayToLocalStorage: (planDay: PlanDayVm) => Promise<void>;
  addNewExerciseToTrainingSessionScores: (
    exercise: PlanDayExercisesFormVm,
    insertAtIndex?: number,
  ) => void;
  incrementOrDecrementExerciseInTrainingSessionScores: (exerciseId: string, series: number) => void;
  scrollViewRef: React.RefObject<ScrollView | null>;
  scrollToTop: () => void;
  isError: boolean;
}

const TrainingPlanDayContext = createContext<TrainingPlanDayContextType | null>(null);

export const useTrainingPlanDay = () => {
  const context = useContext(TrainingPlanDayContext);
  if (!context) {
    throw new Error('useTrainingPlanDay must be used within TrainingPlanDayProvider');
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
  const queryClient = useQueryClient();
  const [planDay, setPlanDay] = useState<PlanDayVm>();
  const [trainingSessionScores, setTrainingSessionScores] = useState<Array<TrainingSessionScores>>(
    [],
  );
  const [currentExercise, setCurrentExercise] = useState<PlanDayExercisesFormVm>();
  const [isGymFilterActive, setIsGymFilterActive] = useState(true);
  const [lastExerciseScoresWithGym, setLastExerciseScoresWithGym] = useState<
    LastExerciseScoresResponseDto[]
  >([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trainingSessionScoresRef = useRef<Array<TrainingSessionScores>>([]);
  const [isError, setIsError] = useState(false);

  const createScoresForExercise = useCallback((exercise: PlanDayExercisesFormVm) => {
    return Array(exercise.series)
      .fill(null)
      .map((_, i) => ({
        exercise: exercise.exercise,
        series: i + 1,
        reps: '',
        weight: '',
      }));
  }, []);

  const loadTrainingSessionScores = useCallback(async () => {
    const savedScores = await encryptedStorage.getItem('trainingSessionScores');
    const parsedScores = savedScores ? JSON.parse(savedScores) : [];
    if (parsedScores?.length) {
      setTrainingSessionScores(parsedScores);
    }
    return parsedScores ?? [];
  }, []);

  const saveTrainingSessionScores = useCallback(async (scores: Array<TrainingSessionScores>) => {
    await encryptedStorage.setItem('trainingSessionScores', JSON.stringify(scores));
  }, []);

  const flushTrainingSessionScores = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    await saveTrainingSessionScores(trainingSessionScoresRef.current);
  }, [saveTrainingSessionScores]);

  const sendPlanDayToLocalStorage = useCallback(
    async (nextPlanDay: PlanDayVm) => {
      await encryptedStorage.setItem('planDay', JSON.stringify(nextPlanDay));
      await encryptedStorage.setItem('gym', JSON.stringify(gym));
    },
    [gym],
  );

  const getPlanDayFromLocalStorage = useCallback(async (): Promise<PlanDayVm | false> => {
    const storedPlanDay = await encryptedStorage.getItem('planDay');
    if (!storedPlanDay) return false;

    const parsedPlanDay = JSON.parse(storedPlanDay) as PlanDayVm;
    if (!parsedPlanDay || !Object.keys(parsedPlanDay).length) return false;

    setPlanDay(parsedPlanDay);
    setCurrentExercise(parsedPlanDay.exercises[0]);
    return parsedPlanDay;
  }, []);

  const getInformationAboutPlanDay = useCallback(async () => {
    let planDayFromApi: PlanDayVm | undefined;
    try {
      const result = await queryClient.fetchQuery(getGetApiPlanDayIdGetPlanDayQueryOptions(dayId));
      if (result?.data) {
        const dto = result.data as PlanDayVmDto;
        const data: PlanDayVm = {
          _id: dto._id || '',
          name: dto.name || '',
          exercises:
            dto.exercises?.map((e) => ({
              series: e.series || 0,
              reps: e.reps || '',
              exercise: {
                _id: e.exercise?._id || '',
                name: e.exercise?.name || '',
                user: e.exercise?.user || '',
                bodyPart: e.exercise?.bodyPart || undefined,
                description: e.exercise?.description || '',
                image: e.exercise?.image || '',
              },
            })) || [],
        };
        planDayFromApi = data;
        setPlanDay(data);
        setCurrentExercise(data.exercises[0]);
        await sendPlanDayToLocalStorage(data);
      }
    } catch (e) {
      const sanitizedError = sanitize(e);
      if (__DEV__ && sanitizedError.devDetails) {
        console.warn('[TrainingPlanDayContext] failed to load plan day', sanitizedError.devDetails);
      }
      setIsError(true);
    }
    return planDayFromApi;
  }, [dayId, queryClient, sendPlanDayToLocalStorage]);

  const initExercisePlanDay = useCallback(async () => {
    const planDayFromStorage = await getPlanDayFromLocalStorage();
    if (planDayFromStorage && Object.keys(planDayFromStorage).length) return planDayFromStorage;
    return await getInformationAboutPlanDay();
  }, [getInformationAboutPlanDay, getPlanDayFromLocalStorage]);

  const init = useCallback(async () => {
    setIsError(false);
    const response = (await initExercisePlanDay()) as PlanDayVm;
    const storedScores = (await loadTrainingSessionScores()) as TrainingSessionScores[];

      if (response?.exercises) {
        const initialScores = response.exercises.flatMap((exercise) =>
          createScoresForExercise(exercise).map((defaultScore) => {
          const existingScore = storedScores.find(
            (score) =>
              score.exercise._id === defaultScore.exercise._id &&
              score.series === defaultScore.series,
          );
          return existingScore || defaultScore;
        }),
      );

      setTrainingSessionScores(initialScores);
    }
  }, [createScoresForExercise, initExercisePlanDay, loadTrainingSessionScores]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    trainingSessionScoresRef.current = trainingSessionScores;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      void saveTrainingSessionScores(trainingSessionScoresRef.current);
      saveTimeoutRef.current = null;
    }, 5_000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [saveTrainingSessionScores, trainingSessionScores]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        void flushTrainingSessionScores();
      };
    }, [flushTrainingSessionScores]),
  );

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState !== 'background') return;
      void flushTrainingSessionScores();
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [flushTrainingSessionScores]);

  const planDayName = useMemo(() => planDay?.name ?? '', [planDay?.name]);
  const exercisesInPlanList = useMemo(() => planDay?.exercises, [planDay]);

  const addNewExerciseToTrainingSessionScores = useCallback(
    (exercise: PlanDayExercisesFormVm, insertAtIndex?: number) => {
      if (!exercise.series || !exercise.exercise) return;

      const newScores = createScoresForExercise(exercise);

      setTrainingSessionScores((prevScores) => {
        const filteredScores =
          prevScores?.filter((score) => score.exercise._id !== exercise.exercise?._id) ?? [];

        const nextScores = [...filteredScores];
        const hasValidInsertIndex = typeof insertAtIndex === 'number' && insertAtIndex >= 0;

        if (hasValidInsertIndex) {
          const safeInsertIndex = Math.min(insertAtIndex, nextScores.length);
          nextScores.splice(safeInsertIndex, 0, ...newScores);
          return nextScores;
        }

        nextScores.push(...newScores);
        return nextScores;
      });
    },
    [createScoresForExercise],
  );

  const incrementOrDecrementExerciseInTrainingSessionScores = useCallback(
    (exerciseId: string, seriesChange: number) => {
      setTrainingSessionScores((prevScores) => {
      const currentScoresForExercise = prevScores.filter((score) => score.exercise._id === exerciseId);

      if (!currentScoresForExercise.length) {
        return prevScores;
      }

      if (seriesChange < 0 && currentScoresForExercise.length <= 1) {
        return prevScores;
      }

      const firstExerciseScoreIndex = prevScores.findIndex(
        (score) => score.exercise._id === exerciseId,
      );

      const updatedScoresForExercise =
        seriesChange < 0
          ? currentScoresForExercise.slice(0, -1)
          : [
              ...currentScoresForExercise,
              {
                exercise: currentScoresForExercise[0]!.exercise,
                series: currentScoresForExercise.length + 1,
                reps: '',
                weight: '',
              },
            ];

      const scoresWithoutCurrentExercise = prevScores.filter(
        (score) => score.exercise._id !== exerciseId,
      );

      if (firstExerciseScoreIndex === -1 || !updatedScoresForExercise.length) {
        return scoresWithoutCurrentExercise;
      }

      const nextScores = [...scoresWithoutCurrentExercise];
      const safeInsertIndex = Math.min(firstExerciseScoreIndex, nextScores.length);

      nextScores.splice(safeInsertIndex, 0, ...updatedScoresForExercise);
      return nextScores;
      });
    },
    [],
  );

  const toggleGymFilter = useCallback(() => {
    setIsGymFilterActive((prev) => !prev);
  }, []);

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  return (
    <TrainingPlanDayContext.Provider
      value={useMemo(
        () => ({
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
          isError,
        }),
        [
          addNewExerciseToTrainingSessionScores,
          currentExercise,
          exercisesInPlanList,
          gym,
          incrementOrDecrementExerciseInTrainingSessionScores,
          isError,
          isGymFilterActive,
          lastExerciseScoresWithGym,
          planDay,
          planDayName,
          scrollToTop,
          sendPlanDayToLocalStorage,
          toggleGymFilter,
          trainingSessionScores,
        ],
      )}
    >
      {children}
    </TrainingPlanDayContext.Provider>
  );
};

export default TrainingPlanDayProvider;

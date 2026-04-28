import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { EnumLookupDto, ExerciseResponseDto } from '../../../../../../api/generated/model';
import { getGetApiExerciseIdGetExerciseQueryOptions } from '../../../../../../api/generated/exercise/exercise';
import type { BodyParts } from '../../../../../../api/generated/model';
import type { PlanDayVm } from '../../../../../../types/models';
import { useTrainingPlanDay } from '../TrainingPlanDayContext';

export const usePlanDayEditor = () => {
  const queryClient = useQueryClient();
  const {
    planDay,
    setPlanDay,
    setCurrentExercise,
    sendPlanDayToLocalStorage,
    addNewExerciseToTrainingSessionScores,
    incrementOrDecrementExerciseInTrainingSessionScores,
    trainingSessionScores,
    setTrainingSessionScores,
  } = useTrainingPlanDay();

  const [isTrainingPlanDayExerciseFormShow, setIsTrainingPlanDayExerciseFormShow] =
    useState<boolean>(false);
  const [isPlanShow, setIsPlanShow] = useState<boolean>(false);
  const [bodyPart, setBodyPart] = useState<BodyParts | undefined>();
  const [exerciseWhichBeingSwitched, setExerciseWhichBeingSwitched] = useState<string | undefined>();

  const getExercise = useCallback(
    async (id: string) => {
      const exercise = await queryClient.fetchQuery(getGetApiExerciseIdGetExerciseQueryOptions(id));
      const dto = exercise.data as ExerciseResponseDto;
      return {
        _id: dto._id || '',
        name: dto.name || '',
        user: dto.user || '',
        ...(dto.bodyPart ? { bodyPart: dto.bodyPart } : {}),
        description: dto.description || '',
        image: dto.image || '',
      };
    },
    [queryClient],
  );

  const deleteExerciseFromPlanDay = useCallback(
    async (exerciseId: string | undefined) => {
      if (!exerciseId) return;
      const newPlanDayExercises = planDay?.exercises.filter(
        (exercise) => exercise.exercise._id !== exerciseId,
      );
      if (!newPlanDayExercises || !newPlanDayExercises.length || !planDay) return;
      const newPlanDay = { ...planDay, exercises: newPlanDayExercises };
      await sendPlanDayToLocalStorage(newPlanDay);
      setPlanDay(newPlanDay);
      setCurrentExercise(newPlanDay.exercises[0]!);
      const newTrainingSessionScores = trainingSessionScores.filter(
        (exercise) => exercise.exercise._id !== exerciseId,
      );
      setTrainingSessionScores(newTrainingSessionScores);
      return newPlanDay;
    },
    [planDay, sendPlanDayToLocalStorage, setCurrentExercise, setPlanDay, setTrainingSessionScores, trainingSessionScores],
  );

  const addExerciseToPlanDay = useCallback(
    async (newPlanDay: PlanDayVm) => {
      setPlanDay(newPlanDay);
      await sendPlanDayToLocalStorage(newPlanDay);
    },
    [sendPlanDayToLocalStorage, setPlanDay],
  );

  const showExerciseFormByBodyPart = useCallback(
    (nextBodyPart: EnumLookupDto | undefined, exerciseToSwitchId: string) => {
      if (!exerciseToSwitchId) return;
      setExerciseWhichBeingSwitched(exerciseToSwitchId);
      setBodyPart(nextBodyPart?.name as BodyParts | undefined);
      setIsTrainingPlanDayExerciseFormShow(true);
    },
    [],
  );

  const showExerciseForm = useCallback(() => {
    setBodyPart(undefined);
    setExerciseWhichBeingSwitched(undefined);
    setIsTrainingPlanDayExerciseFormShow(true);
  }, []);

  const hideExerciseForm = useCallback(() => {
    setIsTrainingPlanDayExerciseFormShow(false);
  }, []);

  const togglePlanShow = useCallback(() => {
    setIsPlanShow((value) => !value);
  }, []);

  const incrementOrDecrementExercise = useCallback(
    async (exerciseId: string, seriesChange: number) => {
      if (!planDay?.exercises?.length) {
        return;
      }

      const targetExercise = planDay.exercises.find((exercise) => exercise.exercise._id === exerciseId);

      if (!targetExercise) {
        return;
      }

      const nextSeries = targetExercise.series + seriesChange;
      if (nextSeries < 1) {
        return;
      }

      const newPlanDayExercises = planDay.exercises.map((exercise) => {
        if (exercise.exercise._id === exerciseId) {
          const newCurrentExercise = {
            ...exercise,
            series: nextSeries,
          };
          setCurrentExercise(newCurrentExercise);
          return newCurrentExercise;
        }
        return exercise;
      });
      const newPlanDay = { ...planDay, exercises: newPlanDayExercises };
      await addExerciseToPlanDay(newPlanDay as PlanDayVm);

      incrementOrDecrementExerciseInTrainingSessionScores(exerciseId, seriesChange);
    },
    [addExerciseToPlanDay, incrementOrDecrementExerciseInTrainingSessionScores, planDay, setCurrentExercise],
  );

  const getExerciseToAddFromForm = useCallback(
    async (exerciseId: string, series: number, reps: string, isIncrementDecrement?: boolean) => {
      if (!planDay) return;

      const response = await getExercise(exerciseId);
      let newPlanDay: PlanDayVm = planDay;
      let exerciseIndex = -1;
      let exerciseScoreInsertIndex: number | undefined;

      if (exerciseWhichBeingSwitched || isIncrementDecrement) {
        const idExercise = isIncrementDecrement ? exerciseId : exerciseWhichBeingSwitched;

        if (idExercise) {
          const foundScoreIndex = trainingSessionScores.findIndex(
            (score) => score.exercise._id === idExercise,
          );
          if (foundScoreIndex !== -1) {
            exerciseScoreInsertIndex = foundScoreIndex;
          }
        }

        exerciseIndex = newPlanDay.exercises.findIndex((e) => e.exercise._id === idExercise);

        const responsePlanDay = await deleteExerciseFromPlanDay(idExercise);
        if (!responsePlanDay) return;

        newPlanDay = responsePlanDay;
      }

      const newPlanDayExercises = [...newPlanDay.exercises];
      const newExercise = { exercise: response, series, reps };

      if (exerciseIndex !== -1) {
        newPlanDayExercises.splice(exerciseIndex, 0, newExercise);
      } else {
        newPlanDayExercises.push(newExercise);
      }

      newPlanDay = { ...newPlanDay, exercises: newPlanDayExercises };

      if (!newPlanDay) return;
      addNewExerciseToTrainingSessionScores(newExercise, exerciseScoreInsertIndex);
      setCurrentExercise(newExercise);
      await addExerciseToPlanDay(newPlanDay);
      setIsTrainingPlanDayExerciseFormShow(false);
    },
    [
      addExerciseToPlanDay,
      addNewExerciseToTrainingSessionScores,
      deleteExerciseFromPlanDay,
      exerciseWhichBeingSwitched,
      getExercise,
      planDay,
      setCurrentExercise,
      trainingSessionScores,
    ],
  );

  return {
    isTrainingPlanDayExerciseFormShow,
    isPlanShow,
    bodyPart,
    showExerciseFormByBodyPart,
    showExerciseForm,
    hideExerciseForm,
    togglePlanShow,
    deleteExerciseFromPlanDay,
    incrementOrDecrementExercise,
    getExerciseToAddFromForm,
  };
};

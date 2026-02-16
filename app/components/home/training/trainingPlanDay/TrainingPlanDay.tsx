import { Alert, ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import TrainingPlanDayExerciseForm from "./TrainingPlanDayExerciseForm";
import { BodyParts } from "../../../../../enums/BodyParts";
import {
  TrainingForm,
  TrainingSessionScores,
} from "../../../../../interfaces/Training";
import { GymForm } from "../../../../../interfaces/Gym";
import React from "react";
import { useHomeContext } from "../../HomeContext";
import { useTrainingPlanDay } from "./TrainingPlanDayContext";
import TrainingPlanDayHeader from "./elements/TrainingPlanDayHeader";
import TrainingPlanDayFooterButtons from "./elements/TrainingPlanDayFooterButtons";
import TrainingPlanDayActionsButtons from "./elements/TrainingPlanDayActionsButtons";
import TrainingPlanDayExerciseLastScoresInfo from "./elements/TrainingPlanDayExerciseLastScoresInfo";
import TrainingPlanDayExerciseView from "./elements/TrainingPlanDayExerciseView";
import TrainingPlanDayExercisesList from "./elements/TrainingPlanDayExercisesList";
import TrainingPlanDayExerciseHeader from "./elements/TrainingPlanDayExerciseHeader";
import TrainingPlanDayHeaderButtons from "./elements/TrainingPlanDayHeaderButtons";
import CreatePlanDay from "../../plan/planDay/CreatePlanDay";
import PlanDayProvider from "../../plan/planDay/CreatePlanDayContext";
import { PlanDayVm } from "../../../../../interfaces/PlanDay";
import { WeightUnits } from "../../../../../enums/Units";
import { ExerciseScoresTrainingForm } from "../../../../../interfaces/ExercisesScores";
import { TrainingSummary } from "../../../../../interfaces/Training";
import { ExerciseForm } from "../../../../../interfaces/Exercise";
import { TrainingViewSteps } from "../../../../../enums/TrainingView";
import ViewLoading from "../../../elements/ViewLoading";
import TrainingPlanDayTimer from "./elements/TrainingPlanDayTimer";
import {
  usePostApiIdAddTraining,
} from "../../../../../api/generated/training/training";
import { getGetApiExerciseIdGetExerciseQueryOptions } from "../../../../../api/generated/exercise/exercise";
import { useQueryClient } from "@tanstack/react-query";
import { ExerciseResponseDto } from "../../../../../api/generated/model";
import { useTranslation } from "react-i18next";

interface TrainingPlanDayProps {
  hideDaySection: () => void;
  hideAndDeleteTrainingSession: () => Promise<void>;
  dayId: string;
  gym: GymForm | undefined;
  setStep: (step: number) => void;
  setTrainingSummary: (trainingSummary: TrainingSummary) => void;
}

const TrainingPlanDay: React.FC<TrainingPlanDayProps> = (props) => {
  const { t } = useTranslation();
  const { changeHeaderVisibility, userId } = useHomeContext();
  const queryClient = useQueryClient();
  
  const {
    planDay,
    setPlanDay,
    setCurrentExercise,
    gym,
    sendPlanDayToLocalStorage,
    addNewExerciseToTrainingSessionScores,
    incrementOrDecrementExerciseInTrainingSessionScores,
    trainingSessionScores,
    setTrainingSessionScores,
    scrollViewRef,
  } = useTrainingPlanDay();

  const [
    isTrainingPlanDayExerciseFormShow,
    setIsTrainingPlanDayExerciseFormShow,
  ] = useState<boolean>(false);
  const [isPlanShow, setIsPlanShow] = useState<boolean>(false);
  const [bodyPart, setBodyPart] = useState<BodyParts | undefined>();
  const [exerciseWhichBeingSwitched, setExerciseWhichBeingSwitched] = useState<
    string | undefined
  >();

  const { mutateAsync: addTrainingMutation, isPending: isAddingTraining } = usePostApiIdAddTraining();

  useEffect(() => {
    changeHeaderVisibility(false);
    return () => {
      changeHeaderVisibility(true);
    };
  }, []);

  /// Submit training and delete training session from localStorage then show summary.
  const addTraining = async (exercises: TrainingSessionScores[]) => {
    const type = props.dayId;
    const createdAt = new Date();
    const training = exercises.map((ele: TrainingSessionScores) => {
      const exerciseScoresTrainingForm: ExerciseScoresTrainingForm = {
        exercise: `${ele.exercise._id}`,
        reps: parseFloat(ele.reps),
        series: ele.series,
        weight: parseFloat(ele.weight),
        unit: WeightUnits.KILOGRAMS,
      };
      return exerciseScoresTrainingForm;
    });

    const body: TrainingForm = {
      type: type!,
      createdAt: createdAt,
      exercises: training,
      gym: gym?._id!,
    };

    try {
        const result = await addTrainingMutation({ id: userId, data: body as any });
        if (result && result.data) {
             console.log("Training result:", JSON.stringify(result.data, null, 2));
             await props.hideAndDeleteTrainingSession();
             props.setStep(TrainingViewSteps.TRAINING_SUMMARY);
             // Map DTO to interface - extract string values from enums
             const trainingSummaryData = result.data as any;
             const mapUnitValue = (unit: any): string => {
               return typeof unit === 'string' ? unit : (unit?.name || 'Unknown');
             };
             const mappedSummary: TrainingSummary = {
               ...trainingSummaryData,
               comparison: trainingSummaryData.comparison?.map((comp: any) => ({
                 ...comp,
                 seriesComparisons: comp.seriesComparisons?.map((series: any) => ({
                   ...series,
                   currentResult: series.currentResult ? {
                     ...series.currentResult,
                     unit: mapUnitValue(series.currentResult.unit)
                   } : series.currentResult,
                   previousResult: series.previousResult ? {
                     ...series.previousResult,
                     unit: mapUnitValue(series.previousResult.unit)
                   } : series.previousResult
                 }))
               })) || [],
               profileRank: {
                 name: typeof trainingSummaryData.profileRank === 'string' 
                   ? trainingSummaryData.profileRank 
                   : trainingSummaryData.profileRank?.name || 'Unknown',
                 needElo: trainingSummaryData.profileRank?.needElo || 0
               },
               nextRank: trainingSummaryData.nextRank ? {
                 name: typeof trainingSummaryData.nextRank === 'string' 
                   ? trainingSummaryData.nextRank 
                   : trainingSummaryData.nextRank?.name || 'Unknown',
                 needElo: trainingSummaryData.nextRank?.needElo || 0
               } : null
             };
             props.setTrainingSummary(mappedSummary);
        }
    } catch (e) {
        console.error(e);
        Alert.alert(t('training.error'), t('training.failedToAdd'));
    }
  };

  /// Delete exercise from plan day
  const deleteExerciseFromPlanDay = async (exerciseId: string | undefined) => {
    if (!exerciseId) return;
    const newPlanDayExercises = planDay?.exercises.filter(
      (exercise) => exercise.exercise._id !== exerciseId
    );
    if (!newPlanDayExercises || !newPlanDayExercises.length || !planDay) return;
    const newPlanDay = { ...planDay, exercises: newPlanDayExercises };
    await sendPlanDayToLocalStorage(newPlanDay);
    setPlanDay(newPlanDay);
    setCurrentExercise(newPlanDay.exercises[0]);
    const newTrainingSessionScores = trainingSessionScores.filter(
      (exercise) => exercise.exercise._id !== exerciseId
    );
    setTrainingSessionScores(newTrainingSessionScores);
    return newPlanDay;
  };

  /// Show exercise form for adding a new exercise with a specific body part
  const showExerciseFormByBodyPart = (
    bodyPart: BodyParts,
    exerciseToSwitchId: string
  ) => {
    if (!exerciseToSwitchId) return;
    setExerciseWhichBeingSwitched(exerciseToSwitchId);
    setBodyPart(bodyPart);
    setIsTrainingPlanDayExerciseFormShow(true);
  };

  /// Show exercise form for adding a new exercise
  const showExerciseForm = () => {
    setBodyPart(undefined);
    setExerciseWhichBeingSwitched(undefined);
    setIsTrainingPlanDayExerciseFormShow(true);
  };

  /// Hide exercise form
  const hideExerciseForm = () => {
    setIsTrainingPlanDayExerciseFormShow(false);
  };

  const getExercise = async (id: string): Promise<ExerciseForm> => {
    const exercise = await queryClient.fetchQuery(
        getGetApiExerciseIdGetExerciseQueryOptions(id)
    );
    const dto = exercise.data as ExerciseResponseDto;
    return {
      _id: dto._id || "",
      name: dto.name || "",
      user: dto.user || "",
      bodyPart: (dto.bodyPart?.name as BodyParts) || BodyParts.Chest,
      description: dto.description || "",
      image: dto.image || "",
    };
  };

  const incrementOrDecrementExercise = async (
    exerciseId: string,
    seriesChange: number
  ) => {
    const newPlanDayExercises = planDay?.exercises.map((exercise) => {
      if (exercise.exercise._id === exerciseId) {
        const newCurrentExercise = {
          ...exercise,
          series: exercise.series + seriesChange,
        };
        setCurrentExercise(newCurrentExercise);
        return newCurrentExercise;
      }
      return exercise;
    });
    const newPlanDay = { ...planDay, exercises: newPlanDayExercises };
    await addExerciseToPlanDay(newPlanDay as PlanDayVm);

    incrementOrDecrementExerciseInTrainingSessionScores(
      exerciseId,
      seriesChange
    );
  };

  const getExerciseToAddFromForm = async (
    exerciseId: string,
    series: number,
    reps: string,
    isIncrementDecrement?: boolean
  ) => {
    if (!planDay) return;

    const response = await getExercise(exerciseId);
    let newPlanDay: PlanDayVm = planDay;
    let exerciseIndex = -1;

    if (exerciseWhichBeingSwitched || isIncrementDecrement) {
      const idExercise = isIncrementDecrement
        ? exerciseId
        : exerciseWhichBeingSwitched;

      exerciseIndex = newPlanDay.exercises.findIndex(
        (e) => e.exercise._id === idExercise
      );

      const response = await deleteExerciseFromPlanDay(idExercise);
      if (!response) return;

      newPlanDay = response;
    }

    let newPlanDayExercises = [...newPlanDay.exercises];

    const newExercise = { exercise: response, series, reps };

    if (exerciseIndex !== -1) {
      newPlanDayExercises.splice(exerciseIndex, 0, newExercise);
    } else {
      newPlanDayExercises.push(newExercise);
    }

    newPlanDay = { ...newPlanDay, exercises: newPlanDayExercises };

    if (!newPlanDay) return;
    addNewExerciseToTrainingSessionScores(newExercise);
    setCurrentExercise(newExercise);
    await addExerciseToPlanDay(newPlanDay);
    setIsTrainingPlanDayExerciseFormShow(false);
  };

  const addExerciseToPlanDay = async (newPlanDay: PlanDayVm) => {
    setPlanDay(newPlanDay);
    await sendPlanDayToLocalStorage(newPlanDay);
  };

  const parseScoresIfValid = (
    scores: TrainingSessionScores[]
  ): TrainingSessionScores[] | null => {
    const parsedScores = scores.map((score) => {
      const repsWithDot = score.reps.toString().replace(",", ".");
      const weightWithDot = score.weight.toString().replace(",", ".");

      const parsedReps = parseFloat(repsWithDot);
      const parsedWeight = parseFloat(weightWithDot);

      if (isNaN(parsedReps) || isNaN(parsedWeight)) {
        return null;
      }

      return {
        ...score,
        reps: parsedReps.toString(),
        weight: parsedWeight.toString(),
      };
    });

    return parsedScores.includes(null)
      ? null
      : (parsedScores as TrainingSessionScores[]);
  };

  const sendTraining = async (exercises: TrainingSessionScores[]) => {
    const result = parseScoresIfValid(exercises);
    if (!result)
      return Alert.alert(
        t('training.invalidScores'),
        t('training.invalidScoresMessage')
      );
    await addTraining(result);
  };

  const togglePlanShow = () => {
    setIsPlanShow(!isPlanShow);
  };

  return (
    <View className="absolute w-full h-full text-textColor bg-bgColor flex flex-col">
      {planDay && Object.keys(planDay).length ? (
        <View
          style={{ gap: 8 }}
          className=" h-full flex flex-col justify-between pb-4"
        >
          <TrainingPlanDayHeader hideDaySection={props.hideDaySection} />

          <ScrollView
            ref={scrollViewRef}
            className="flex flex-col"
            contentContainerStyle={{
              display: "flex",
              gap: 16,
            }}
          >
            <TrainingPlanDayExerciseHeader />
            <View className="flex flex-row px-5" style={{gap: 8}}>
              <TrainingPlanDayHeaderButtons
                showExerciseForm={showExerciseForm}
              />
              <TrainingPlanDayTimer />
            </View>

            <TrainingPlanDayActionsButtons
              getExerciseToAddFromForm={getExerciseToAddFromForm}
              incrementOrDecrementExercise={incrementOrDecrementExercise}
              deleteExerciseFromPlan={deleteExerciseFromPlanDay}
              showExerciseFormByBodyPart={showExerciseFormByBodyPart}
              togglePlanShow={togglePlanShow}
            />
            <TrainingPlanDayExerciseLastScoresInfo />
            <TrainingPlanDayExerciseView />
            <TrainingPlanDayExercisesList
              deleteExerciseFromPlan={deleteExerciseFromPlanDay}
            />
          </ScrollView>
          <TrainingPlanDayFooterButtons
            sendTraining={sendTraining}
            hideAndDeleteTrainingSession={props.hideAndDeleteTrainingSession}
          />
        </View>
      ) : (
        <ViewLoading />
      )}
      {isTrainingPlanDayExerciseFormShow && (
        <TrainingPlanDayExerciseForm
          cancel={hideExerciseForm}
          addExerciseToPlanDay={getExerciseToAddFromForm}
          bodyPart={bodyPart}
        />
      )}
      {isPlanShow && (
        <PlanDayProvider closeForm={togglePlanShow}>
          <CreatePlanDay isPreview={true} planDayId={planDay?._id} />
        </PlanDayProvider>
      )}
    </View>
  );
};

export default TrainingPlanDay;
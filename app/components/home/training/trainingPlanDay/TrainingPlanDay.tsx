import { View } from "react-native";
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
import { useAppContext } from "../../../../AppContext";
import { ExerciseForm } from "../../../../../interfaces/Exercise";
import { TrainingViewSteps } from "../../../../../enums/TrainingView";

interface TrainingPlanDayProps {
  hideDaySection: () => void;
  hideAndDeleteTrainingSession: () => Promise<void>;
  dayId: string;
  gym: GymForm | undefined;
  setStep: (step: number) => void;
  setTrainingSummary: (trainingSummary: TrainingSummary) => void;
}

const TrainingPlanDay: React.FC<TrainingPlanDayProps> = (props) => {
  const {  changeHeaderVisibility, userId } = useHomeContext();
  const { getAPI, postAPI } = useAppContext();
  const {
    planDay,
    setPlanDay,
    setCurrentExercise,
    gym,
    lastExerciseScoresWithGym,
    sendPlanDayToLocalStorage
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
        reps: ele.reps,
        series: ele.series,
        weight: ele.weight,
        unit: WeightUnits.KILOGRAMS,
      };
      return exerciseScoresTrainingForm;
    });

    const body: TrainingForm = {
      type: type!,
      createdAt: createdAt,
      exercises: training,
      gym: gym?._id!,
      lastExercisesScores: lastExerciseScoresWithGym,
    };
    await postAPI(
      `/${userId}/addTraining`,
      async (result: TrainingSummary) => {
        await props.hideAndDeleteTrainingSession();
        props.setStep(TrainingViewSteps.TRAINING_SUMMARY);
        props.setTrainingSummary(result);
      },
      body
    );
  };



 



  /// Delete exercise from plan day
  const deleteExerciseFromPlanDay = async (
    exerciseId: string | undefined,
    isIncrementDecrement = false
  ) => {
    if (!exerciseId) return;
    const newPlanDayExercises = planDay?.exercises.filter(
      (exercise) => exercise.exercise._id !== exerciseId
    );
    if (!newPlanDayExercises || !newPlanDayExercises.length || !planDay) return;
    const newPlanDay = { ...planDay, exercises: newPlanDayExercises };
    await sendPlanDayToLocalStorage(newPlanDay);
    setPlanDay(newPlanDay);
    if (!isIncrementDecrement) setCurrentExercise(newPlanDay.exercises[0]);
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

  const getExercise = async (id: string) => {
    let result: ExerciseForm = {} as ExerciseForm;
    await getAPI(
      `/exercise/${id}/getExercise`,
      (exercise: ExerciseForm) => (result = exercise),
      undefined,
      false
    );
    return result;
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

      const response = await deleteExerciseFromPlanDay(idExercise, true);
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
        reps: parsedReps,
        weight: parsedWeight,
      };
    });

    return parsedScores.includes(null)
      ? null
      : (parsedScores as TrainingSessionScores[]);
  };

  const sendTraining = async (exercises: TrainingSessionScores[]) => {
    const result = parseScoresIfValid(exercises);
    if (!result) return;
    await addTraining(result);
  };

  const togglePlanShow = () => {
    setIsPlanShow(!isPlanShow);
  };

  return (
    <View className="absolute w-full h-full text-white bg-bgColor flex flex-col">
      {planDay && Object.keys(planDay).length ? (
        <View
          style={{ gap: 8 }}
          className=" h-full flex flex-col justify-between pb-4"
        >
          <View
            className="flex flex-col items-center flex-1"
            style={{ gap: 16 }}
          >
            <View style={{ gap: 16 }} className="flex flex-col w-full ">
              <TrainingPlanDayHeader hideDaySection={props.hideDaySection} />
              <TrainingPlanDayExerciseHeader />
              <TrainingPlanDayHeaderButtons
                showExerciseForm={showExerciseForm}
              />
            </View>
            <TrainingPlanDayActionsButtons
              getExerciseToAddFromForm={getExerciseToAddFromForm}
              deleteExerciseFromPlan={deleteExerciseFromPlanDay}
              showExerciseFormByBodyPart={showExerciseFormByBodyPart}
              togglePlanShow={togglePlanShow}
            />
            <TrainingPlanDayExerciseLastScoresInfo />
            <TrainingPlanDayExerciseView />
            <TrainingPlanDayExercisesList
              deleteExerciseFromPlan={deleteExerciseFromPlanDay}
            />
          </View>
          <TrainingPlanDayFooterButtons
            sendTraining={sendTraining}
            hideAndDeleteTrainingSession={props.hideAndDeleteTrainingSession}
          />
        </View>
      ) : (
        <></>
      )}
      {isTrainingPlanDayExerciseFormShow ? (
        <TrainingPlanDayExerciseForm
          cancel={hideExerciseForm}
          addExerciseToPlanDay={getExerciseToAddFromForm}
          bodyPart={bodyPart}
        />
      ) : (
        <></>
      )}
      {isPlanShow ? (
        <PlanDayProvider closeForm={togglePlanShow}>
          <CreatePlanDay isPreview={true} planDayId={planDay?._id} />
        </PlanDayProvider>
      ) : (
        <></>
      )}
    </View>
  );
};

export default TrainingPlanDay;

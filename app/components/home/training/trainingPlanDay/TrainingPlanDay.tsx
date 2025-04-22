import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { LastExerciseScores } from "../../../../../interfaces/Exercise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrainingPlanDayExerciseForm from "./TrainingPlanDayExerciseForm";
import { BodyParts } from "../../../../../enums/BodyParts";
import { TrainingSessionScores } from "../../../../../interfaces/Training";
import useInterval from "../../../../../helpers/hooks/useInterval";
import ViewLoading from "../../../elements/ViewLoading";
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

interface TrainingPlanDayProps {
  hideDaySection: () => void;
  hideAndDeleteTrainingSession: () => void;
  addTraining: (exercises: TrainingSessionScores[]) => Promise<void>;
  dayId: string;
  gym: GymForm | undefined;
}

const TrainingPlanDay: React.FC<TrainingPlanDayProps> = (props) => {
  const { apiURL, changeHeaderVisibility, userId } = useHomeContext();
  const {
    planDay,
    setPlanDay,
    trainingSessionScores,
    setTrainingSessionScores,
    setCurrentExercise,
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

  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const [intervalDelay, setIntervalDelay] = useState<number | null>(null);

  useInterval(() => {
    saveTrainingSessionScores();
  }, intervalDelay);

  useEffect(() => {
    init();
    return () => {
      setIntervalDelay(null);
      changeHeaderVisibility(true);
    };
  }, []);

  /// Initialize the component
  const init = async () => {
    setViewLoading(true);
    await initExercisePlanDay();
    await loadTrainingSessionScores();
    changeHeaderVisibility(false);
    setViewLoading(false);
    setIntervalDelay(1000);
  };

  /// Get information about plan day from local storage or API
  const initExercisePlanDay = async () => {
    const isPlanDayFromStorage = await getPlanDayFromLocalStorage();
    if (isPlanDayFromStorage) return;
    await getInformationAboutPlanDay();
  };

  /// Load training session scores from local storage
  const loadTrainingSessionScores = async () => {
    const savedScores = await AsyncStorage.getItem("trainingSessionScores");
    const parsedScores = savedScores ? JSON.parse(savedScores) : [];
    if (parsedScores && parsedScores.length) {
      setTrainingSessionScores(parsedScores);
    }
  };

  /// Save training session scores to local storage
  const saveTrainingSessionScores = async () => {
    await AsyncStorage.setItem(
      "trainingSessionScores",
      JSON.stringify(trainingSessionScores)
    );
  };

  /// Get information about plan day from API
  const getInformationAboutPlanDay = async () => {
    const response = await fetch(
      `${apiURL}/api/planDay/${props.dayId}/getPlanDay`
    );
    const result = (await response.json()) as PlanDayVm;

    setPlanDay(result);
    setCurrentExercise(result.exercises[0]);
    await sendPlanDayToLocalStorage(result);
  };

  /// Save plan day to local storage
  const sendPlanDayToLocalStorage = async (planDay: PlanDayVm) => {
    await AsyncStorage.setItem("planDay", JSON.stringify(planDay));
    await AsyncStorage.setItem("gym", JSON.stringify(props.gym));
  };

  /// Get plan day from local storage
  const getPlanDayFromLocalStorage = async (): Promise<boolean> => {
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
    return true;
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
    const response = await fetch(`${apiURL}/api/exercise/${id}/getExercise`);
    const exercise = await response.json();
    return exercise;
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
    if (isIncrementDecrement) setCurrentExercise(newExercise);
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

  const sendTraining = (exercises: TrainingSessionScores[]) => {
    const result = parseScoresIfValid(exercises);
    if (!result) return;
    props.addTraining(result);
  };

  const togglePlanShow = () => {
    setIsPlanShow(!isPlanShow);
  };

  return (
    <View className="absolute w-full h-full text-white bg-bgColor flex flex-col">
      {planDay && Object.keys(planDay).length ? (
        <View style={{gap:8}} className=" h-full flex flex-col justify-between pb-4">
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
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </View>
  );
};

export default TrainingPlanDay;

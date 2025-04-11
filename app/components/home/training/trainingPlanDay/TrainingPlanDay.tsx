import { View, Text } from "react-native";
import { LastScoresPlanDayVm } from "../../../../../interfaces/PlanDay";
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
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../../elements/CustomButton";
import { useHomeContext } from "../../HomeContext";
import { useTrainingPlanDay } from "./TrainingPlanDayContext";
import TrainingPlanDayHeader from "./elements/TrainingPlanDayHeader";
import TrainingPlanDayFooterButtons from "./elements/TrainingPlanDayFooterButtons";
import TrainingPlanDayActionsButtons from "./elements/TrainingPlanDayActionsButtons";
import TrainingPlanDayExerciseLastScoresInfo from "./elements/TrainingPlanDayExerciseLastScoresInfo";
import TrainingPlanDayExerciseView from "./elements/TrainingPlanDayExerciseView";
import TrainingPlanDayExercisesList from "./elements/TrainingPlanDayExercisesList";

interface TrainingPlanDayProps {
  hideDaySection: () => void;
  hideAndDeleteTrainingSession: () => void;
  addTraining: (
    exercises: TrainingSessionScores[],
    lastExercisesScores: LastExerciseScores[] | undefined
  ) => Promise<void>;
  dayId: string;
  gym: GymForm | undefined;
}

const TrainingPlanDay: React.FC<TrainingPlanDayProps> = (props) => {
  const { apiURL, changeHeaderVisibility, userId } = useHomeContext();
  const {
    planDay,
    setPlanDay,
    trainingSessionScores,
    setLastExerciseScores,
    setTrainingSessionScores,
    lastExerciseScores,
    setCurrentExercise,
  } = useTrainingPlanDay();
  const [
    isTrainingPlanDayExerciseFormShow,
    setIsTrainingPlanDayExerciseFormShow,
  ] = useState<boolean>(false);
  const [bodyPart, setBodyPart] = useState<BodyParts | undefined>();
  const [exerciseWhichBeingSwitched, setExerciseWhichBeingSwitched] = useState<
    string | undefined
  >();

  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const [startInterval, setStartInterval] = useState<boolean>(false);

  useInterval(() => {
    if (!startInterval) return;
    saveTrainingSessionScores();
  }, 1000);

  useEffect(() => {
    init();
  }, []);

  /// Initialize the component
  const init = async () => {
    setViewLoading(true);
    await initExercisePlanDay();
    await loadTrainingSessionScores();
    changeHeaderVisibility(false);
    setViewLoading(false);
    setStartInterval(true);
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

  /// Get last exercise scores from API
  const getLastExerciseScores = async (
    plan: LastScoresPlanDayVm
  ): Promise<LastExerciseScores[] | void> => {
    const response = await fetch(
      `${apiURL}/api/exercise/${userId}/getLastExerciseScores`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plan),
      }
    );
    const result = await response.json();
    setLastExerciseScores(result);
    return result;
  };

  /// Get information about plan day from API
  const getInformationAboutPlanDay = async () => {
    const response = await fetch(
      `${apiURL}/api/planDay/${props.dayId}/getPlanDay`
    );
    const result = await response.json();
    const planDayInfo: LastScoresPlanDayVm = {
      ...result,
      gym: props.gym,
    };

    setPlanDay(planDayInfo);
    setCurrentExercise(planDayInfo.exercises[0]);
    await getLastExerciseScores(planDayInfo);
    await sendPlanDayToLocalStorage(planDayInfo);
  };

  /// Save plan day to local storage
  const sendPlanDayToLocalStorage = async (planDay: LastScoresPlanDayVm) => {
    await AsyncStorage.setItem("planDay", JSON.stringify(planDay));
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
    const planDayInfo = {
      ...result,
      gym: props.gym,
    } as LastScoresPlanDayVm;
    setPlanDay(planDayInfo);
    setCurrentExercise(planDayInfo.exercises[0]);
    await getLastExerciseScores(planDayInfo);
    return true;
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


  /// Increment the series number of an current exercise
  const incrementSeriesNumber = async (
    exercise: string,
    series: number,
    reps: string
  ) => {
    await getExerciseToAddFromForm(exercise, series + 1, reps, true);
  };
  
  /// Decrement the series number of an current exercise
  const decrementSeriesNumber = async (
    exercise: string,
    series: number,
    reps: string
  ) => {
    await getExerciseToAddFromForm(exercise, series - 1, reps, true);
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
    let newPlanDay: LastScoresPlanDayVm = planDay;
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

    await addExerciseToPlanDay(newPlanDay);
    await getLastExerciseScores(newPlanDay);
    setIsTrainingPlanDayExerciseFormShow(false);
  };

  const addExerciseToPlanDay = async (newPlanDay: LastScoresPlanDayVm) => {
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
    props.addTraining(result, lastExerciseScores);
  };

  return (
    <View className="absolute w-full h-full text-white bg-bgColor flex flex-col">
      {planDay && Object.keys(planDay).length ? (
        <View style={{ gap: 16 }} className="flex flex-col items-center h-full">
          <View style={{ gap: 16 }} className="flex flex-col w-full ">
            <TrainingPlanDayHeader hideDaySection={props.hideDaySection} />
            <View className="flex flex-col px-5">
              <Text
                className="text-3xl text-white  font-bold "
                style={{
                  fontFamily: "OpenSans_700Bold",
                }}
              >
                Pull ups
              </Text>
              <Text
                className="text-base text-white "
                style={{
                  fontFamily: "OpenSans_400Regular",
                }}
              >
                3x10-15
              </Text>
            </View>
            <View className="flex flex-row justify-between px-5">
              <CustomButton
                onPress={showExerciseForm}
                buttonStyleSize={ButtonSize.regular}
                buttonStyleType={ButtonStyle.success}
                textSize="text-base"
                text="Add Exercise"
              />
            </View>
          </View>
          <TrainingPlanDayActionsButtons />
          <TrainingPlanDayExerciseLastScoresInfo />
          <TrainingPlanDayExerciseView />
          <TrainingPlanDayExercisesList />
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
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </View>
  );
};

export default TrainingPlanDay;

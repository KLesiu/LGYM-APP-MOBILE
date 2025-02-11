import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Switch as SwitchComp,
} from "react-native";
import { LastScoresPlanDayVm, PlanDayVm } from "../../../interfaces/PlanDay";
import { useEffect, useState } from "react";
import {
  ExerciseForm,
  LastExerciseScores,
} from "./../../../interfaces/Exercise";
import SwitchIcon from "./../../../img/icons/switch.png";
import RemoveIcon from "./../../../img/icons/remove.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrainingPlanDayExerciseForm from "./TrainingPlanDayExerciseForm";
import { BodyParts } from "../../../enums/BodyParts";
import { TrainingSessionScores } from "../../../interfaces/Training";
import useInterval from "../../../helpers/hooks/useInterval";
import ViewLoading from "../../elements/ViewLoading";
import { Message } from "../../../enums/Message";
import gym from "./../../../img/icons/gym.png";
import { GymForm } from "../../../interfaces/Gym";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";

interface TrainingPlanDayProps {
  hideChooseDaySection: () => void;
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
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [planDay, setPlanDay] = useState<LastScoresPlanDayVm>();
  const [
    isTrainingPlanDayExerciseFormShow,
    setIsTrainingPlanDayExerciseFormShow,
  ] = useState<boolean>(false);
  const [bodyPart, setBodyPart] = useState<BodyParts | undefined>();
  const [exerciseWhichBeingSwitched, setExerciseWhichBeingSwitched] = useState<
    string | undefined
  >();
  const [trainingSessionScores, setTrainingSessionScores] = useState<
    Array<TrainingSessionScores>
  >([]);
  const [lastExerciseScores, setLastExerciseScores] =
    useState<LastExerciseScores[]>();
  const [isEnabled, setIsEnabled] = useState(false);

  const [error, setError] = useState<string>("");

  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const [startInterval, setStartInterval] = useState<boolean>(false);
  useInterval(() => {
    if (!startInterval) return;
    saveTrainingSessionScores();
  }, 1000);
  useEffect(() => {
    const init = async () => {
      setViewLoading(true);
      await initExercisePlanDay();
      await loadTrainingSessionScores();
      setViewLoading(false);
      setStartInterval(true);
    };
    init();
  }, []);
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

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const loadTrainingSessionScores = async () => {
    const savedScores = await AsyncStorage.getItem("trainingSessionScores");
    const parsedScores = savedScores ? JSON.parse(savedScores) : [];

    if (parsedScores && parsedScores.length) {
      setTrainingSessionScores(parsedScores);
    }
  };
  const initExercisePlanDay = async () => {
    props.hideChooseDaySection();
    const isPlanDayFromStorage = await getPlanDayFromLocalStorage();

    if (isPlanDayFromStorage) return;
    await getInformationAboutPlanDay();
  };
  const getLastExerciseScores = async (
    plan: LastScoresPlanDayVm
  ): Promise<LastExerciseScores[] | void> => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
      `${apiURL}/api/exercise/${id}/getLastExerciseScores`,
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
    await getLastExerciseScores(planDayInfo);
    await sendPlanDayToLocalStorage(planDayInfo);
  };
  const sendPlanDayToLocalStorage = async (planDay: LastScoresPlanDayVm) => {
    await AsyncStorage.setItem("planDay", JSON.stringify(planDay));
  };
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
    };
    setPlanDay(planDayInfo);
    await getLastExerciseScores(planDayInfo);
    return true;
  };
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
  const showExerciseFormByBodyPart = (
    bodyPart: BodyParts,
    exerciseToSwitchId: string
  ) => {
    if (!exerciseToSwitchId) return;
    setExerciseWhichBeingSwitched(exerciseToSwitchId);
    setBodyPart(bodyPart);
    setIsTrainingPlanDayExerciseFormShow(true);
  };
  const showExerciseForm = () => {
    setBodyPart(undefined);
    setExerciseWhichBeingSwitched(undefined);
    setIsTrainingPlanDayExerciseFormShow(true);
  };
  const hideExerciseForm = () => {
    setIsTrainingPlanDayExerciseFormShow(false);
  };

  const incrementSeriesNumber = async (
    exercise: string,
    series: number,
    reps: string
  ) => {
    await getExerciseToAddFromForm(exercise, series + 1, reps, true);
  };
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
    if (!result) return setError(Message.InputsMustBeNumbers);
    props.addTraining(result, lastExerciseScores);
  };
  const updateExerciseScore = async (
    exercise: ExerciseForm,
    series: number,
    value: string,
    isWeight: boolean
  ) => {
    const updatedScores = trainingSessionScores.map((score) => {
      setError("");
      if (score.exercise._id === exercise._id && score.series === series) {
        if (isWeight) {
          return {
            ...score,
            weight: value,
          };
        }
        return {
          ...score,
          reps: value,
        };
      }
      return score;
    });

    //@ts-ignore
    setTrainingSessionScores(updatedScores);
  };
  const saveTrainingSessionScores = async () => {
    await AsyncStorage.setItem(
      "trainingSessionScores",
      JSON.stringify(trainingSessionScores)
    );
  };
  const renderExerciseItem = (item: {
    series: number;
    reps: string;
    exercise: ExerciseForm;
  }) => {
    const findLastScores = lastExerciseScores?.find(
      (score) => score.exerciseId === item.exercise._id
    );
    const stringScores = findLastScores?.seriesScores.map(
      (score) => `${score.score?.reps ?? 0}x${score.score?.weight ?? 0}`
    );
    return (
      <View
        style={{ borderRadius: 8 }}
        key={item.exercise._id}
        className="flex flex-col w-full   bg-[#282828] p-4  "
      >
        <View className="flex flex-row justify-between">
          <View className="flex flex-row" style={{ gap: 8 }}>
            <Text
              className="text-base text-white font-bold max-w-[150px]"
              style={{
                fontFamily: "OpenSans_700Bold",
              }}
            >
              {item.exercise.name}
            </Text>
            <Text
              className="text-base text-white font-bold max-w-[150px]"
              style={{
                fontFamily: "OpenSans_400Regular",
              }}
            >
              {item.series}x{item.reps}
            </Text>
          </View>
          <View style={{ gap: 16 }} className="flex flex-row">
            <Pressable
              onPress={() =>
                incrementSeriesNumber(
                  `${item.exercise._id}`,
                  item.series,
                  item.reps
                )
              }
            >
              <Icon name="plus" size={20} color="#94e798" />
            </Pressable>
            <Pressable
              onPress={() =>
                decrementSeriesNumber(
                  `${item.exercise._id}`,
                  item.series,
                  item.reps
                )
              }
            >
              <Icon name="minus" size={20} color="#94e798" />
            </Pressable>
            <Pressable
              onPress={() =>
                showExerciseFormByBodyPart(
                  item.exercise.bodyPart,
                  `${item.exercise._id}`
                )
              }
            >
              <Image className="w-6 h-6" source={SwitchIcon} />
            </Pressable>
            <Pressable
              onPress={() => deleteExerciseFromPlanDay(item.exercise._id)}
            >
              <Image className="w-6 h-6" source={RemoveIcon} />
            </Pressable>
          </View>
        </View>

        <View style={{ gap: 16 }} className="flex w-full flex-col">
          <Text
            className="text-gray-300 text-[10px] pb-1 border-b-[1px] mb-1 border-white"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Last scores: {stringScores?.join(", ")} (kg)
          </Text>
          <View style={{ gap: 8 }} className="flex flex-col">
            {Array.from({ length: item.series }).map((_, index) => {
              const savedScore = trainingSessionScores.find(
                (score) =>
                  score.exercise._id === item.exercise._id &&
                  score.series === index + 1
              );
              return (
                <View className="flex w-full flex-col" key={index}>
                  <View
                    style={{ gap: 4 }}
                    className="flex w-full flex-row justify-between"
                  >
                    <View
                      style={{ gap: 8 }}
                      className="flex flex-row  items-center"
                    >
                      <Text
                        className="text-white text-sm font-light"
                        style={{ fontFamily: "OpenSans_300Light" }}
                      >
                        Reps:
                      </Text>
                      <TextInput
                        onChangeText={(value) =>
                          updateExerciseScore(
                            item.exercise,
                            index + 1,
                            value,
                            false
                          )
                        }
                        value={savedScore ? `${savedScore.reps}` : ""}
                        keyboardType="numeric"
                        style={{ borderRadius: 8 }}
                        className="text-sm  border-[#575757] w-20  border-[1px] text-white p-1"
                      />
                    </View>
                    <View
                      style={{ gap: 8 }}
                      className="flex flex-row items-center   "
                    >
                      <Text
                        className="text-white text-sm font-light"
                        style={{ fontFamily: "OpenSans_300Light" }}
                      >
                        Weight:
                      </Text>
                      <TextInput
                        onChangeText={(value) =>
                          updateExerciseScore(
                            item.exercise,
                            index + 1,
                            value,
                            true
                          )
                        }
                        style={{ borderRadius: 8 }}
                        value={savedScore ? `${savedScore.weight}` : ""}
                        keyboardType="numeric"
                        className="text-sm   border-[#575757] w-20  border-[1px] text-white p-1 "
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="absolute w-full h-full text-white bg-[#121212] flex flex-col">
      {planDay && Object.keys(planDay).length ? (
        <View
          style={{ gap: 16 }}
          className="flex flex-col items-center p-4 h-full"
        >
          <View style={{ gap: 8 }} className="flex flex-col w-full px-2 ">
            <View className="flex flex-col " style={{gap:4}}>
              <Text
                className="text-2xl text-[#94e798] block  font-bold "
                style={{
                  fontFamily: "OpenSans_700Bold",
                }}
              >
                {planDay.name}
              </Text>
              <View className="flex flex-row items-center">
                <Image source={gym} className="w-4 h-4" />
                <Text
                  className="text-[11px] text-white"
                  style={{
                    fontFamily: "OpenSans_400Regular",
                  }}
                >
                  {props.gym?.name}
                </Text>
              </View>
            </View>
            <View className="flex flex-row justify-between" style={{ gap: 8 }}>
              <CustomButton
                onPress={props.hideDaySection}
                buttonStyleSize={ButtonSize.long}
                buttonStyleType={ButtonStyle.outline}
                textSize="text-sm"
                text="Back"
              />
              <CustomButton
                onPress={showExerciseForm}
                buttonStyleSize={ButtonSize.long}
                buttonStyleType={ButtonStyle.success}
                textSize="text-sm"
                text="Add Exercise"
              />
            </View>
          </View>
          <ScrollView
            className="w-full min-h-[300px] -mr-4 pr-4"
            contentContainerStyle={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {planDay.exercises.map((exercise) => renderExerciseItem(exercise))}
          </ScrollView>
          <View className="w-full flex flex-row justify-between">
            <Pressable
              onPress={props.hideAndDeleteTrainingSession}
              disabled={!isEnabled}
              style={{ borderRadius: 8 }}
              className={`flex flex-row justify-center items-center w-28 h-14 bg-[#3f3f3f] ${
                !isEnabled ? "opacity-50" : "opacity-100"
              }`}
            >
              <Text
                className="text-center text-base text-white"
                style={{
                  fontFamily: "OpenSans_400Regular",
                }}
              >
                Delete
              </Text>
            </Pressable>

            <SwitchComp onValueChange={toggleSwitch} value={isEnabled} />

            <Pressable
              onPress={() => sendTraining(trainingSessionScores)}
              disabled={!isEnabled}
              style={{ borderRadius: 8 }}
              className={` flex flex-row justify-center items-center w-28 h-14 bg-[#94e798] ${
                !isEnabled ? "opacity-50" : "opacity-100"
              }`}
            >
              <Text
                className="text-base"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                Add
              </Text>
            </Pressable>
          </View>
          <View className="flex flex-col text-center w-full">
            <Text
              className="text-red-500 text-sm"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              {error}
            </Text>
          </View>
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

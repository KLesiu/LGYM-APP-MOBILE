import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Switch as SwitchComp,
} from "react-native";
import TrainingPlanDayProps from "./props/TrainingPlanDayProps";
import { useEffect, useState } from "react";
import { PlanDayVm } from "./interfaces/PlanDay";
import { ExerciseForm, ExerciseForPlanDay } from "./interfaces/Exercise";
import Switch from "./img/icons/switch.png";
import Remove from "./img/icons/remove.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrainingPlanDayExerciseForm from "./TrainingPlanDayExerciseForm";
import { BodyParts } from "./enums/BodyParts";
import { ExerciseScoresTrainingForm } from "./interfaces/ExercisesScores";
import { TrainingSessionScores } from "./interfaces/Training";
import useInterval from "./helpers/hooks/useInterval";
import ViewLoading from "./ViewLoading";
import { Message } from "./enums/Message";

const TrainingPlanDay: React.FC<TrainingPlanDayProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [planDay, setPlanDay] = useState<PlanDayVm>();
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
  const [isEnabled, setIsEnabled] = useState(false);

  const [error, setError] = useState<string>("");

  const [viewLoading, setViewLoading] = useState<boolean>(false);
  useInterval(() => {
    saveTrainingSessionScores();
  }, 1000);
  useEffect(() => {
    const init = async () => {
      setViewLoading(true);
      await initExercisePlanDay();
      await loadTrainingSessionScores();
      setViewLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (planDay && planDay.exercises) {
      const initialScores = planDay.exercises.flatMap((exercise) => {
        return Array.from({ length: exercise.series }).map((_, seriesIndex) => {
          const existingScore = trainingSessionScores.find(
            (score) =>
              score.exercise._id === exercise.exercise._id &&
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
    if (savedScores) {
      setTrainingSessionScores(JSON.parse(savedScores));
    }
  };
  const initExercisePlanDay = async () => {
    props.hideChooseDaySection();
    const isPlanDayFromStorage = await getPlanDayFromLocalStorage();
    if (isPlanDayFromStorage) return;
    await getInformationAboutPlanDay();
  };
  const getInformationAboutPlanDay = async () => {
    const response = await fetch(
      `${apiURL}/api/planDay/${props.dayId}/getPlanDay`
    );
    if (!response.ok) return;
    const planDayInfo = await response.json();
    setPlanDay(planDayInfo);
    await sendPlanDayToLocalStorage(planDayInfo);
  };
  const sendPlanDayToLocalStorage = async (planDay: PlanDayVm) => {
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
    setPlanDay(JSON.parse(planDay));
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
  const getExercise = async (id: string) => {
    const response = await fetch(`${apiURL}/api/exercise/${id}/getExercise`);
    if (!response.ok) return;
    const exercise = await response.json();
    return exercise;
  };
  const getExerciseToAddFromForm = async (
    exerciseId: string,
    series: number,
    reps: string
  ) => {
    if (!planDay) return;
    const response = await getExercise(exerciseId);
    let newPlanDay: PlanDayVm = planDay;
    if (exerciseWhichBeingSwitched) {
      const response = await deleteExerciseFromPlanDay(
        exerciseWhichBeingSwitched
      );
      if (!response) return;
      newPlanDay = response;
    }
    const newPlanDayExercises = [
      ...newPlanDay.exercises,
      { exercise: response, series: series, reps: reps },
    ];
    newPlanDay = { ...newPlanDay, exercises: newPlanDayExercises };
    if (!newPlanDay) return;
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
      // Zamiana przecinka na kropkę w `reps` i `weight`
      const repsWithDot = score.reps.toString().replace(",", ".");
      const weightWithDot = score.weight.toString().replace(",", ".");

      // Próba sparsowania wartości
      const parsedReps = parseFloat(repsWithDot);
      const parsedWeight = parseFloat(weightWithDot);

      // Sprawdzamy, czy udało się sparsować obie wartości
      if (isNaN(parsedReps) || isNaN(parsedWeight)) {
        return null;
      }

      // Zwracamy nowy obiekt z sparsowanymi wartościami
      return {
        ...score,
        reps: parsedReps,
        weight: parsedWeight,
      };
    });

    // Sprawdzamy, czy wszystkie elementy zostały poprawnie sparsowane
    return parsedScores.includes(null)
      ? null
      : (parsedScores as TrainingSessionScores[]);
  };
  const sendTraining = (exercises: TrainingSessionScores[]) => {
    const result = parseScoresIfValid(exercises);
    if (!result) return setError(Message.InputsMustBeNumbers);
    props.addTraining(result);
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
    return (
      <View className="flex flex-col w-full  rounded-lg bg-[#282828] p-4  ">
        <View className="flex flex-row justify-between">
          <Text
            className="text-base text-white font-bold"
            style={{
              fontFamily: "OpenSans_700Bold",
            }}
          >
            {item.exercise.name}
          </Text>
          <View style={{ gap: 8 }} className="flex flex-row">
            <Pressable
              onPress={() =>
                showExerciseFormByBodyPart(
                  item.exercise.bodyPart,
                  `${item.exercise._id}`
                )
              }
            >
              <Image className="w-6 h-6" source={Switch} />
            </Pressable>
            <Pressable
              onPress={() => deleteExerciseFromPlanDay(item.exercise._id)}
            >
              <Image className="w-6 h-6" source={Remove} />
            </Pressable>
          </View>
        </View>

        <View style={{ gap: 16 }} className="flex w-full flex-col">
          <Text
            className="text-gray-300 text-[12px] pb-1 border-b-[1px] mb-1 border-white"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Last training scores:
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
                        className="text-sm rounded-lg border-[#575757] w-20  border-[1px] text-white p-1"
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
                        value={savedScore ? `${savedScore.weight}` : ""}
                        keyboardType="numeric"
                        className="text-sm rounded-lg  border-[#575757] w-20  border-[1px] text-white p-1 "
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
          style={{ gap: 8 }}
          className="flex flex-col items-center p-4 h-full"
        >
          <View style={{ gap: 4 }} className="flex flex-col w-full">
            <View className="flex flex-row  justify-between">
              <Pressable
                onPress={props.hideDaySection}
                className="rounded-md flex flex-row justify-center items-center w-20 h-8 bg-[#3f3f3f]"
              >
                <Text
                  className="text-center text-[10px] text-white"
                  style={{
                    fontFamily: "OpenSans_400Regular",
                  }}
                >
                  Back
                </Text>
              </Pressable>
              <Pressable
                onPress={showExerciseForm}
                className="rounded-md flex flex-row justify-center items-center w-28 h-8 bg-[#3f3f3f]"
              >
                <Text
                  className="text-center text-[10px] text-white"
                  style={{
                    fontFamily: "OpenSans_400Regular",
                  }}
                >
                  Add Exercise
                </Text>
              </Pressable>
            </View>
            <Text
              className="text-2xl text-white w-full text-center  font-bold "
              style={{
                fontFamily: "OpenSans_700Bold",
              }}
            >
              {planDay.name}
            </Text>
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
        className={`rounded-lg flex flex-row justify-center items-center w-28 h-14 bg-[#3f3f3f] ${!isEnabled ? 'opacity-50' : 'opacity-100'}`}
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
        className={`rounded-lg flex flex-row justify-center items-center w-28 h-14 bg-[#94e798] ${!isEnabled ? 'opacity-50' : 'opacity-100'}`}
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

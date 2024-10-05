import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
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
  useInterval(() => {saveTrainingSessionScores()
  }, 1000);
  useEffect(() => {
    const init = async () => {
      await initExercisePlanDay(); 
      await loadTrainingSessionScores();
    };
    init();
  }, []);
  
  useEffect(() => {
    if (planDay) {
      const initialScores = planDay.exercises.flatMap((exercise) => {
        return Array.from({ length: exercise.series }).map((_, seriesIndex) => {
          const existingScore = trainingSessionScores.find(
            (score) => score.exercise._id === exercise.exercise._id && score.series === seriesIndex + 1
          );
          return existingScore || {
            exercise: exercise.exercise,
            series: seriesIndex + 1,
            reps: 0,
            weight: 0,
          };
        });
      });
      setTrainingSessionScores(initialScores); 
    }
  }, [planDay]);
 
 
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
    getInformationAboutPlanDay();
  };
  const getInformationAboutPlanDay = async () => {
    const response = await fetch(
      `${apiURL}/api/planDay/${props.dayId}/getPlanDay`
    )
      .then((res) => res.json())
      .catch((err) => err);
    setPlanDay(response);
    await sendPlanDayToLocalStorage(response);
  };
  const sendPlanDayToLocalStorage = async (planDay: PlanDayVm) => {
    await AsyncStorage.setItem("planDay", JSON.stringify(planDay));
  };
  const getPlanDayFromLocalStorage = async (): Promise<boolean> => {
    const planDay = await AsyncStorage.getItem("planDay");
    if (!planDay) return false;
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
    const response = await fetch(`${apiURL}/api/exercise/${id}/getExercise`)
      .then((res) => res.json())
      .catch((err) => err);
    return response;
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
  const updateExerciseScore = async (
    exercise: ExerciseForm,
    series: number,
    value: number,
    isWeight: boolean
  ) => {
    const updatedScores = trainingSessionScores.map((score) => {
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
    setTrainingSessionScores(updatedScores);
  };
  const saveTrainingSessionScores = async()=>{
    await AsyncStorage.setItem("trainingSessionScores", JSON.stringify(trainingSessionScores));
  }
  const renderExerciseItem = (item: {
    series: number;
    reps: string;
    exercise: ExerciseForm;
  }) => {
    return (
      <View className="flex flex-col w-full  min-h-[100px] rounded-lg bg-[#282828] p-4  ">
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
  
        <View style={{ gap: 16 }} className="flex flex-col">
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
                <View className="flex flex-col" key={index}>
                  <View style={{ gap: 16 }} className="flex flex-row">
                    <View
                      style={{ gap: 8 }}
                      className="flex flex-row items-center  flex-1 "
                    >
                      <Text
                        className="text-white text-sm"
                        style={{ fontFamily: "OpenSans_400Regular" }}
                      >
                        Reps:
                      </Text>
                      <TextInput
                        onChangeText={(value) =>
                          updateExerciseScore(
                            item.exercise,
                            index + 1,
                            parseInt(value) || 0,
                            false
                          )
                        }
                        value={savedScore ? savedScore.reps.toString() : ''} 
                        keyboardType="numeric"
                        className="text-[15px] rounded border-[#575757] w-full border-[1px] text-white h-8 p-2"
                      />
                    </View>
                    <View
                      style={{ gap: 8 }}
                      className="flex flex-row items-center  flex-1 "
                    >
                      <Text
                        className="text-white text-sm"
                        style={{ fontFamily: "OpenSans_400Regular" }}
                      >
                        Weight:
                      </Text>
                      <TextInput
                        onChangeText={(value) =>
                          updateExerciseScore(
                            item.exercise,
                            index + 1,
                            parseInt(value) || 0,
                            true
                          )
                        }
                        value={savedScore ? savedScore.weight.toString() : ''} 
                        keyboardType="numeric"
                        className="text-[15px] rounded  border-[#575757] w-full border-[1px] text-white h-8 p-2 "
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
        <View style={{ gap: 16 }} className="flex flex-col items-center p-4">
          <View style={{ gap: 16 }} className="flex flex-col w-full">
            <View className="flex flex-row flex-1 justify-between">
              <Pressable
                onPress={props.hideDaySection}
                className="rounded-md flex flex-row justify-center items-center w-20 h-8 bg-[#3f3f3f]"
              >
                <Text
                  className="text-center text-sm text-white"
                  style={{
                    fontFamily: "OpenSans_400Regular",
                  }}
                >
                  BACK
                </Text>
              </Pressable>
              <Pressable
                onPress={showExerciseForm}
                className="rounded-md flex flex-row justify-center items-center w-28 h-8 bg-[#3f3f3f]"
              >
                <Text
                  className="text-center text-sm text-white"
                  style={{
                    fontFamily: "OpenSans_400Regular",
                  }}
                >
                  ADD EXERCISE
                </Text>
              </Pressable>
            </View>
            <Text
              className="text-4xl text-white w-full text-center  font-bold "
              style={{
                fontFamily: "OpenSans_700Bold",
              }}
            >
              {planDay.name}
            </Text>
          </View>

          <ScrollView
            className="smh:h-56 xsmh:h-72 mdh:h-[590px] lgh:h-[620px] w-full -mr-4 pr-4"
            contentContainerStyle={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {planDay.exercises.map((exercise) => renderExerciseItem(exercise))}
          </ScrollView>
          <View className="w-full flex flex-row justify-between">
            <Pressable onPress={()=>props.addTraining(trainingSessionScores)} className="rounded-lg flex flex-row justify-center items-center w-28 h-14 bg-[#94e798]">
              <Text
                className="text-center text-xl text-black"
                style={{
                  fontFamily: "OpenSans_400Regular",
                }}
              >
                ADD
              </Text>
            </Pressable>
            <Pressable
              onPress={props.hideAndDeleteTrainingSession}
              className="rounded-lg flex flex-row justify-center items-center w-28 h-14 bg-[#3f3f3f]"
            >
              <Text
                className="text-center text-xl text-white"
                style={{
                  fontFamily: "OpenSans_400Regular",
                }}
              >
                DELETE
              </Text>
            </Pressable>
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
    </View>
  );
};

export default TrainingPlanDay;

import { Text, View, Pressable } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ViewLoading from "../../elements/ViewLoading";
import MiniLoading from "../../elements/MiniLoading";
import TrainingPlanDay from "./trainingPlanDay/TrainingPlanDay";
import {
  TrainingSessionScores,
  TrainingSummary as TrainingSummaryInterface,
} from "./../../../../interfaces/Training";
import { ExerciseScoresTrainingForm } from "./../../../../interfaces/ExercisesScores";
import { WeightUnits } from "./../../../../enums/Units";
import { Message } from "./../../../../enums/Message";
import TrainingSummary from "./TrainingSummary";
import { LastExerciseScores } from "./../../../../interfaces/Exercise";
import CustomButton from "../../elements/CustomButton";
import TrainingGymChoose from "./TrainingGymChoose";
import { GymForm } from "./../../../../interfaces/Gym";
import React from "react";
import TrainingDayChoose from "./TrainingDayChoose";
import { PlanDayChoose } from "./../../../../interfaces/PlanDay";
import { useHomeContext } from "../HomeContext";



const AddTraining: React.FC = () => {
  const {toggleMenuButton,apiURL} = useHomeContext();
  const [isAddTrainingActive, setIsAddTrainingActive] =
    useState<boolean>(false);
  const [isGymChoiceActive, setIsGymChoiceActive] = useState<boolean>(false);
  const [gym, setGym] = useState<GymForm>();

  const [dayId, setDayId] = useState<string>();
  const [isUserHavePlan, setIsUserHavePlan] = useState<boolean>(false);
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [trainingSummary, setTrainingSummary] =
    useState<TrainingSummaryInterface>();
  const [showUpdateRankPopUp, setShowUpdateRankPopUp] =
    useState<boolean>(false);
  const [isChooseDayActive, setIsChooseDayActive] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setViewLoading(true);
    await checkIsUserHavePlan();
    await checkIsUserHaveActivePlanDayTraining();
    setViewLoading(false);
  };

  const checkIsUserHavePlan = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${apiURL}/api/${id}/checkIsUserHavePlan`);
    const result = await response.json();
    setIsUserHavePlan(result);
  };
  const checkIsUserHaveActivePlanDayTraining = async () => {
    const response = JSON.parse(`${await AsyncStorage.getItem("planDay")}`);

    if (response && Object.keys(response).length) setIsAddTrainingActive(true);
  };

  const getInformationAboutGyms = () => {
    setViewLoading(true);
    setIsGymChoiceActive(true);
    toggleMenuButton(true);
    setViewLoading(false);
  };
  const changeGym = async (gym: GymForm) => {
    setGym(gym);
    setIsGymChoiceActive(false);
    setIsChooseDayActive(true);
  };


  const resetChoosePlanDay = () => {
    setIsChooseDayActive(false);
  };

  const getCurrentPlanDayTraining = async () => {
    const response = await AsyncStorage.getItem("planDay");
    if (!response) return;
    const result = JSON.parse(response);
    setGym(result.gym);
    showDaySection(result._id);
  };
  const showDaySection = async (day: string): Promise<void> => {
    setViewLoading(true);
    setIsChooseDayActive(false);
    setIsAddTrainingActive(true);
    setDayId(day);
    setViewLoading(false);
    toggleMenuButton(true);
  };
  
  const cancelGymChoice = () => {
    setIsGymChoiceActive(false);
    toggleMenuButton(false);
  }

  const hideDaySection = () => {
    setDayId("");
    toggleMenuButton(false);
  };
  const hideAndDeleteTrainingSession = async () => {
    await AsyncStorage.removeItem("planDay");
    await AsyncStorage.removeItem("trainingSessionScores");
    setIsAddTrainingActive(false);
    hideDaySection();
  };
  const showUpdateRankPop = (): void => {
    toggleMenuButton(true);
    setShowUpdateRankPopUp(true);
  };
  const hideUpdateRankPopUp = (): void => {
    toggleMenuButton(false);
    setShowUpdateRankPopUp(false);
  };

  const addTraining = async (
    exercises: TrainingSessionScores[],
    lastExercisesScores: LastExerciseScores[] | undefined
  ) => {
    setViewLoading(true);
    const id = await AsyncStorage.getItem("id");
    const type = dayId;
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
    const response = await fetch(`${apiURL}/api/${id}/addTraining`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: type,
        createdAt: createdAt,
        exercises: training,
        lastExercisesScores: lastExercisesScores,
        gym: gym?._id,
      }),
    });
    const result: TrainingSummaryInterface = await response.json();
    if (result.msg === Message.Created) {
      await hideAndDeleteTrainingSession();
      setTrainingSummary(result);
    }
    showUpdateRankPop();
    setViewLoading(false);
  };

  return (
    <View className="bg-bgColor flex-1 w-full">
      {isUserHavePlan ? (
        <View className="relative  flex flex-col justify-center items-center h-full w-full">
          {isAddTrainingActive ? (
            <CustomButton
              onPress={getCurrentPlanDayTraining}
              customSlots={[
                <Icon
                  style={{ fontSize: 140, color: "#20BC2D" }}
                  name="play-circle"
                />,
              ]}
            />
          ) : (
            <Pressable onPress={getInformationAboutGyms}>
              <Icon
                style={{ fontSize: 140, color: "#20BC2D" }}
                name="plus-circle"
              />
            </Pressable>
          )}

          {loading ? <MiniLoading /> : <Text></Text>}
          {isGymChoiceActive ? <TrainingGymChoose goBack={cancelGymChoice} setGym={changeGym} /> : <></>}
          {isChooseDayActive? <TrainingDayChoose  showDaySection={showDaySection} /> : <></>}

          {isAddTrainingActive && dayId ? (
            <TrainingPlanDay
              hideChooseDaySection={resetChoosePlanDay}
              hideDaySection={hideDaySection}
              hideAndDeleteTrainingSession={hideAndDeleteTrainingSession}
              addTraining={addTraining}
              dayId={dayId}
              gym={gym}
            />
          ) : (
            <></>
          )}
          {showUpdateRankPopUp && trainingSummary ? (
            <TrainingSummary
              trainingSummary={trainingSummary}
              closePopUp={hideUpdateRankPopUp}
            />
          ) : (
            <></>
          )}
        </View>
      ) : (
        <View className="w-full h-full flex flex-row justify-center text-center text-2xl items-center p-4">
          <Text
            className="text-white text-xl text-center"
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            You cant add training, because you dont have plan!
          </Text>
        </View>
      )}
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </View>
  );
};
export default AddTraining;

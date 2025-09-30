import { View, Pressable, Text } from "react-native";
import TrainingDayChoose from "./trainingChoices/TrainingDayChoose";
import TrainingGymChoose from "./trainingChoices/TrainingGymChoose";
import TrainingPlanDay from "./trainingPlanDay/TrainingPlanDay";
import TrainingSummary from "./TrainingSummary";
import StartTrainingControl from "./elements/StartTrainingControl";
import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GymForm } from "../../../../interfaces/Gym";
import { TrainingSummary as TrainingSummaryInterface } from "./../../../../interfaces/Training";
import { useHomeContext } from "../HomeContext";
import TrainingPlanDayProvider from "./trainingPlanDay/TrainingPlanDayContext";
import { TrainingViewSteps } from "../../../../enums/TrainingView";
import React from "react";

interface TrainingViewProps {}

const TrainingView: React.FC<TrainingViewProps> = () => {
  const { toggleMenuButton } = useHomeContext();

  ///GYM
  const [gym, setGym] = useState<GymForm>();

  ///PLAN DAY
  const [dayId, setDayId] = useState<string>();

  ///TRAINING SUMMARY
  const [trainingSummary, setTrainingSummary] =
    useState<TrainingSummaryInterface>();

  const [step, setStep] = useState<TrainingViewSteps>();

  useEffect(() => {
    init();
  }, []);

  /// Init component
  const init = async () => {
    await checkIsUserHaveActivePlanDayTraining();
  };

  /// Check is user have active plan day training
  const checkIsUserHaveActivePlanDayTraining = async () => {
    const response = JSON.parse(`${await AsyncStorage.getItem("planDay")}`);
    if (response && Object.keys(response).length)
      await getCurrentPlanDayTraining();
    else setStep(TrainingViewSteps.None);
  };

  /// Show Gym choice popUp and hide menu button
  const getInformationAboutGyms = () => {
    setStep(TrainingViewSteps.CHOOSE_GYM);
    toggleMenuButton(true);
  };

  /// Set gym, hide gym choice popUp and show day choice popUp
  const changeGym = async (gym: GymForm) => {
    setGym(gym);
    setStep(TrainingViewSteps.CHOOSE_DAY);
  };

  /// Reset training view to default state and hide menu button
  const resetTrainingView = () => {
    setStep(TrainingViewSteps.None);
    resetWithoutStep();
  };

  /// Reset training view to default state and hide menu button but without changing step
  const resetWithoutStep = () => {
    setGym(undefined);
    setDayId("");
    setTrainingSummary(undefined);
    toggleMenuButton(false);
  };

  /// Go back from TrainingPlanDay and set step to PLAN_DAY_TO_RESUME
  const goBackFromTrainingPlanDay = () => {
    setStep(TrainingViewSteps.PLAN_DAY_TO_RESUME);
    resetWithoutStep();
  };

  /// Get active plan day from localStorage, set gym and show TrainingPlanDay.
  const getCurrentPlanDayTraining = async () => {
    const response = await AsyncStorage.getItem("planDay");
    if (!response) return;
    const result = JSON.parse(response);

    const responseGym = await AsyncStorage.getItem("gym");
    if (!responseGym) return;
    const resultGym = JSON.parse(responseGym) as GymForm;
    setGym(resultGym);
    showDaySection(result._id);
  };

  /// Show TrainingPlanDay and hide day choice popUp
  const showDaySection = async (day: string): Promise<void> => {
    setStep(TrainingViewSteps.TRAINING_PLAN_DAY);
    setDayId(day);
    toggleMenuButton(true);
  };

  /// Delete information about training session from localStorage and hide TrainingPlanDay
  const hideAndDeleteTrainingSession = async () => {
    await AsyncStorage.removeItem("planDay");
    await AsyncStorage.removeItem("trainingSessionScores");
    await AsyncStorage.removeItem("gym");
    setStep(TrainingViewSteps.None);
    resetTrainingView();
  };

  const isAddTrainingActive = useMemo(
    () => step === TrainingViewSteps.PLAN_DAY_TO_RESUME,
    [step]
  );

  const renderView = useCallback(() => {
    switch (step) {
      case TrainingViewSteps.CHOOSE_GYM:
        return (
          <TrainingGymChoose goBack={resetTrainingView} setGym={changeGym} />
        );
      case TrainingViewSteps.CHOOSE_DAY:
        return <TrainingDayChoose showDaySection={showDaySection} />;
      case TrainingViewSteps.TRAINING_PLAN_DAY:
        return (
          <TrainingPlanDayProvider gym={gym} dayId={dayId!}>
            <TrainingPlanDay
              hideDaySection={goBackFromTrainingPlanDay}
              hideAndDeleteTrainingSession={hideAndDeleteTrainingSession}
              dayId={dayId as string}
              gym={gym}
              setStep={setStep}
              setTrainingSummary={setTrainingSummary}
            />
          </TrainingPlanDayProvider>
        );
      case TrainingViewSteps.TRAINING_SUMMARY:
        return (
          <TrainingSummary
            trainingSummary={trainingSummary as TrainingSummaryInterface}
            closePopUp={resetTrainingView}
          />
        );
      default:
        return <></>;
    }
  }, [step]);

  return (
    <View className="relative  flex flex-col justify-center items-center h-full w-full">
      <StartTrainingControl
        isAddTrainingActive={isAddTrainingActive}
        getCurrentPlanDayTraining={getCurrentPlanDayTraining}
        getInformationAboutGyms={getInformationAboutGyms}
      />
      {renderView()}
    </View>
  );
};

export default TrainingView;

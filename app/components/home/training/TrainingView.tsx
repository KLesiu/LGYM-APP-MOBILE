import { View, Pressable, Text } from "react-native";
import TrainingDayChoose from "./trainingChoices/TrainingDayChoose";
import TrainingGymChoose from "./trainingChoices/TrainingGymChoose";
import TrainingPlanDay from "./trainingPlanDay/TrainingPlanDay";
import TrainingSummary from "./TrainingSummary";
import StartTrainingControl from "./elements/StartTrainingControl";
import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GymForm } from "../../../../types/models";
import { TrainingSummary as TrainingSummaryInterface } from "./../../../../types/models";
import { useHomeContext } from "../HomeContext";
import TrainingPlanDayProvider from "./trainingPlanDay/TrainingPlanDayContext";
import { TrainingViewSteps } from "../../../../enums/TrainingView";
import React from "react";
import { GymChoiceInfoDto } from "../../../../api/generated/model";

interface TrainingViewProps {}

const parseStoredValue = <T,>(value: string | null): T | null => {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const isValidStoredGym = (gym: GymForm | null): gym is GymForm => {
  return !!gym && typeof gym._id === "string" && gym._id.length > 0;
};

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
    const planDay = parseStoredValue<{ _id?: string }>(
      await AsyncStorage.getItem("planDay")
    );

    if (planDay?._id) {
      await getCurrentPlanDayTraining(planDay._id);
      return;
    }

    setStep(TrainingViewSteps.None);
  };

  /// Show Gym choice popUp and hide menu button
  const getInformationAboutGyms = () => {
    setStep(TrainingViewSteps.CHOOSE_GYM);
    toggleMenuButton(true);
  };

  /// Set gym, hide gym choice popUp and show day choice popUp
  const changeGym = async (gymData: GymChoiceInfoDto) => {
    const gymForm: GymForm = {
        name: gymData.name || "",
        address: gymData.address || undefined,
        _id: gymData._id || undefined
    };
    setGym(gymForm);
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
  const getCurrentPlanDayTraining = async (storedDayId?: string) => {
    const dayIdFromStorage =
      storedDayId ??
      parseStoredValue<{ _id?: string }>(await AsyncStorage.getItem("planDay"))
        ?._id;

    if (!dayIdFromStorage) {
      await hideAndDeleteTrainingSession();
      return;
    }

    const storedGym = parseStoredValue<GymForm>(await AsyncStorage.getItem("gym"));
    if (!isValidStoredGym(storedGym)) {
      await hideAndDeleteTrainingSession();
      return;
    }

    setGym({
      _id: storedGym._id,
      name: storedGym.name ?? "",
      address: storedGym.address ?? undefined,
    });
    showDaySection(dayIdFromStorage);
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
        return (
          <TrainingDayChoose
            goBack={getInformationAboutGyms}
            showDaySection={showDaySection}
          />
        );
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

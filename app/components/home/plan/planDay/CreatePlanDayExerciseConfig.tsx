import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import CustomButton, { ButtonStyle } from "../../../elements/CustomButton";
import ExerciseList from "./exerciseList/ExerciseList";
import { usePlanDay } from "./CreatePlanDayContext";
import { ExerciseForPlanDay } from "../../../../../types/models";
import toastService from "../../../../services/toastService";

const CreatePlanDayExerciseConfig: React.FC = () => {
  const { t } = useTranslation();
  const { exercisesList, setExercisesList, goBack, goToNext } = usePlanDay();

  const editExerciseFromList = (exercise: ExerciseForPlanDay) => {
    const newExercisesList = exercisesList.map((item) =>
      item.exercise.value === exercise.exercise.value ? exercise : item
    );

    setExercisesList(newExercisesList);
  };

  const removeExerciseFromList = (exercise: ExerciseForPlanDay) => {
    const newExercisesList = exercisesList.filter(
      (item) => item.exercise.value !== exercise.exercise.value
    );

    setExercisesList(newExercisesList);
  };

  const moveExerciseInList = (
    exercise: ExerciseForPlanDay,
    direction: "up" | "down"
  ) => {
    const currentIndex = exercisesList.findIndex(
      (item) => item.exercise.value === exercise.exercise.value
    );
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (
      currentIndex === -1 ||
      targetIndex < 0 ||
      targetIndex >= exercisesList.length
    ) {
      return;
    }

    const newExercisesList = [...exercisesList];
    [newExercisesList[currentIndex], newExercisesList[targetIndex]] = [
      newExercisesList[targetIndex],
      newExercisesList[currentIndex],
    ];

    setExercisesList(newExercisesList);
  };

  const isConfigurationValid = useMemo(
    () =>
      exercisesList.length > 0 &&
      exercisesList.every(
        (exercise) => exercise.series > 0 && exercise.reps.trim().length > 0
      ),
    [exercisesList]
  );

  const handleContinue = () => {
    if (!isConfigurationValid) {
      toastService.showValidationError(t("plans.invalidExerciseConfig"));
      return;
    }

    goToNext();
  };

  return (
    <View className="w-full flex-1">
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <View style={{ gap: 16 }}>
          <View style={{ gap: 6 }}>
            <Text
              className="text-xl smallPhone:text-base text-textColor"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              {t("plans.configureExercisesTitle")}
            </Text>
            <Text
              className="text-sm text-fifthColor"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {t("plans.configureExercisesDescription")}
            </Text>
          </View>

          <ExerciseList
            exerciseList={exercisesList}
            editExerciseFromList={editExerciseFromList}
            removeExerciseFromList={removeExerciseFromList}
            moveExercise={moveExerciseInList}
          />
        </View>
      </ScrollView>

      <View className="w-full px-5 py-4 flex flex-row justify-between" style={{ gap: 20 }}>
        <CustomButton
          buttonStyleType={ButtonStyle.outlineBlack}
          onPress={goBack}
          text={t("plans.back")}
          width="flex-1"
        />
        <CustomButton
          buttonStyleType={ButtonStyle.default}
          onPress={handleContinue}
          text={t("training.continue")}
          width="flex-1"
        />
      </View>
    </View>
  );
};

export default CreatePlanDayExerciseConfig;

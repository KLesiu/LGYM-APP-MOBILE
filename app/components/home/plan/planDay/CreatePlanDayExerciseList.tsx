import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import {
  ExerciseForm,
  ExerciseForPlanDay,
} from "./../../../../../interfaces/Exercise";
import CustomButton, { ButtonStyle } from "../../../elements/CustomButton";
import ExerciseList from "./exerciseList/ExerciseList";
import { usePlanDay } from "./CreatePlanDayContext";
import React from "react";
import Dialog from "../../../elements/Dialog";
import Exercises from "../../exercises/Exercises";
import { useTranslation } from "react-i18next";

const CreatePlanDayExerciseList: React.FC = () => {
  const { t } = useTranslation();
  const { exercisesList, setExercisesList, goBack, goToNext } = usePlanDay();

  const [isAddExercisesListVisible, setIsAddExercisesListVisible] =
    useState<boolean>(false);

  const toggleAddExercisesList = () => {
    setIsAddExercisesListVisible(!isAddExercisesListVisible);
  };

  const addExerciseToList = (exercise: ExerciseForm) => {
    const newExerciseForPlanDay: ExerciseForPlanDay = {
      exercise: {
        value: exercise._id!,
        label: exercise.name || "",
      },
      series: 1,
      reps: "Max",
    };
    if (exercisesList.some((x) => x.exercise.value === exercise._id)) {
      const newExercisesList = exercisesList.filter(
        (x) => x.exercise.value !== exercise._id
      );
      setExercisesList(newExercisesList);
      return;
    }
    setExercisesList([...exercisesList, newExerciseForPlanDay]);
  };

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

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

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

  return (
    <View className="w-full h-full">
      <ScrollView>
        <View className="flex flex-col px-5 py-2" style={{ gap: 16 }}>
          <View>
            <Text
              className="text-3xl smallPhone:text-xl text-textColor"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              {t('plans.createPlanList')}
            </Text>
          </View>
          <View className="flex justify-between flex-row w-full ">
            <CustomButton
              text={t('plans.addExercisesToList')}
              onPress={toggleAddExercisesList}
              buttonStyleType={ButtonStyle.success}
            />
          </View>
          <ExerciseList
            exerciseList={exercisesList}
            editExerciseFromList={editExerciseFromList}
            removeExerciseFromList={removeExerciseFromList}
            moveExercise={moveExerciseInList}
          />
        </View>
      </ScrollView>

      <View className="px-5 flex flex-row justify-between" style={{ gap: 20 }}>
        <CustomButton
          buttonStyleType={ButtonStyle.outlineBlack}
          onPress={goBack}
          text={t('plans.back')}
          width="flex-1"
        />
        <CustomButton
          buttonStyleType={ButtonStyle.default}
          onPress={goToNext}
          text={t('plans.next')}
          width="flex-1"
        />
      </View>
      {isAddExercisesListVisible && (
        <Dialog>
          <Exercises
            isCreatePlanDayMode={true}
            addExerciseToList={addExerciseToList}
            exercisesList={exercisesList}
            goBackToPlanDay={toggleAddExercisesList}
          />
        </Dialog>
      )}
    </View>
  );
};

export default CreatePlanDayExerciseList;

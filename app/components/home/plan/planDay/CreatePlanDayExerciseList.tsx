import { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { DropdownItem } from "./../../../../../interfaces/Dropdown";
import {
  ExerciseForm,
  ExerciseForPlanDay,
} from "./../../../../../interfaces/Exercise";
import { isIntValidator } from "./../../../../../helpers/numberValidator";
import CustomButton, { ButtonStyle } from "../../../elements/CustomButton";
import PlanNameIcon from "./../../../../../img/icons/planIcon.svg";
import AutoComplete from "../../../elements/Autocomplete";
import ExerciseList from "./exerciseList/ExerciseList";
import CreateExercise from "../../exercises/CreateExercise";
import { usePlanDay } from "./CreatePlanDayContext";
import { useHomeContext } from "../../HomeContext";
import useDeviceCategory from "../../../../../helpers/hooks/useDeviceCategory";
import { DeviceCategory } from "../../../../../enums/DeviceCategory";
import { useAppContext } from "../../../../AppContext";
import React from "react";
import Dialog from "../../../elements/Dialog";
import Exercises from "../../exercises/Exercises";

const CreatePlanDayExerciseList: React.FC = () => {
  const { exercisesList, setExercisesList, goBack, goToNext } = usePlanDay();

  const [isAddExercisesListVisible, setIsAddExercisesListVisible] =
    useState<boolean>(false);

  const { getAPI } = useAppContext();
  const { userId } = useHomeContext();

  const toggleAddExercisesList = () => {
    setIsAddExercisesListVisible(!isAddExercisesListVisible);
  };

  const addExerciseToList = (exercise: ExerciseForm) => {
    const newExerciseForPlanDay: ExerciseForPlanDay = {
      exercise: {
        value: exercise._id!,
        label: exercise.name,
      },
      series: 1,
      reps: "Max",
    };
    if(exercisesList.some(x=>x.exercise.value === exercise._id)){
      const newExercisesList = exercisesList.filter(x=>x.exercise.value !== exercise._id);
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

  return (
    <View className="w-full h-full">
      <ScrollView>
        <View className="flex flex-col px-5 py-2" style={{ gap: 16 }}>
          <View>
            <Text
              className="text-3xl smallPhone:text-xl text-textColor"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              Create plan list
            </Text>
          </View>
          <View className="flex justify-between flex-row w-full ">
            <CustomButton
              text="Add exercises to list"
              onPress={toggleAddExercisesList}
              buttonStyleType={ButtonStyle.success}
            />
          </View>
          <ExerciseList exerciseList={exercisesList} editExerciseFromList={editExerciseFromList} />
        </View>
      </ScrollView>

      <View className="px-5 flex flex-row justify-between" style={{ gap: 20 }}>
        <CustomButton
          buttonStyleType={ButtonStyle.outlineBlack}
          onPress={goBack}
          text="Back"
          width="flex-1"
        />
        <CustomButton
          buttonStyleType={ButtonStyle.default}
          onPress={goToNext}
          text="Next"
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

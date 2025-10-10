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

const CreatePlanDayExerciseList: React.FC = () => {
  const { exercisesList, setExercisesList, goBack, goToNext } = usePlanDay();

  const { getAPI } = useAppContext();
  const { userId } = useHomeContext();
  const [exercisesToSelect, setExercisesToSelect] = useState<DropdownItem[]>(
    []
  );
  const [
    isTrainingPlanDayExerciseFormShow,
    setIsTrainingPlanDayExerciseFormShow,
  ] = useState<boolean>(false);
  const [numberOfSeries, setNumberOfSeries] = useState<string>("");
  const [exerciseReps, setExerciseReps] = useState<string>("");
  const [selectedExercise, setSelectedExercise] = useState<DropdownItem>();
  const [clearQuery, setClearQuery] = useState<boolean>(false);
  const deviceCategory = useDeviceCategory();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await getAllExercises();
  };

  const addToList = useCallback((): void => {
    if (!isIntValidator(numberOfSeries)) return;
    if (!numberOfSeries || !exerciseReps || !selectedExercise) return;

    const exercise: ExerciseForPlanDay = {
      series: parseInt(numberOfSeries),
      reps: exerciseReps,
      exercise: selectedExercise,
    };

    setExercisesList([...exercisesList, exercise]);

    setNumberOfSeries("");
    setExerciseReps("");
    setSelectedExercise(undefined);

    setClearQuery(true);
  }, [numberOfSeries, exerciseReps, selectedExercise, exercisesList]);

  const clearAutoCompleteQuery = useCallback(() => {
    setClearQuery(false);
  }, []);

  const returnGap = useMemo(() => {
    switch (deviceCategory) {
      case DeviceCategory.SMALL:
        return 8;
      default:
        return 16;
    }
  }, [deviceCategory]);

  const removeExerciseFromList = useCallback(
    (item: ExerciseForPlanDay) => {
      const newList = exercisesList.filter(
        (exercise: ExerciseForPlanDay) => exercise !== item
      );
      setExercisesList(newList);
    },
    [exercisesList]
  );

  const getAllExercises = async () => {
    await getAPI(
      `/exercise/${userId}/getAllExercises`,
      (result: ExerciseForm[]) => {
        const helpExercisesToSelect = result.map((exercise: ExerciseForm) => {
          return { label: exercise.name, value: exercise._id! };
        });
        setExercisesToSelect(helpExercisesToSelect);
      },
      undefined,
      false
    );
  };

  const toggleExerciseForm = useCallback(async () => {
    setIsTrainingPlanDayExerciseFormShow(!isTrainingPlanDayExerciseFormShow);
    await getAllExercises();
  }, [isTrainingPlanDayExerciseFormShow]);

  const editExerciseFromList = useCallback(
    (item: ExerciseForPlanDay) => {
      setSelectedExercise(
        exercisesToSelect.find(
          (exercise) => exercise.value === item.exercise.value
        )
      );
      setNumberOfSeries(item.series.toString());
      setExerciseReps(item.reps);
      removeExerciseFromList(item);
    },
    [exercisesToSelect]
  );

  const validator = (input: string): void => {
    if (!input) return setNumberOfSeries(input);
    const result = isIntValidator(input);
    if (result) setNumberOfSeries(input);
  };

  return (
    <View className="w-full h-full">
      <ScrollView>
        <View className="px-5 py-2">
          <Text
            className="text-3xl smallPhone:text-xl text-textColor"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            Create plan list
          </Text>
        </View>
        <View className="px-5" style={{ gap: returnGap }}>
          <View className="flex flex-row" style={{ gap: 8 }}>
            <PlanNameIcon />
            <Text
              className="text-xl smallPhone:text-base text-textColor"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              New Exercises
            </Text>
          </View>
          <View style={{ gap: 4 }} className="flex flex-col">
            <View className="flex flex-row gap-1">
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="  text-textColor text-base smallPhone:text-sm"
              >
                Exercise name
              </Text>
              <Text className="text-redColor">*</Text>
            </View>
            <AutoComplete
              data={exercisesToSelect}
              onSelect={(item) => setSelectedExercise(item)}
              value={selectedExercise?.label || ""}
              valueId={selectedExercise?.value || ""}
              onClearQuery={clearQuery ? clearAutoCompleteQuery : undefined}
            />
          </View>
          <View className="flex flex-row justify-between" style={{ gap: 20 }}>
            <View style={{ gap: 4 }} className="flex flex-col flex-1">
              <View className="flex flex-row gap-1">
                <Text
                  style={{ fontFamily: "OpenSans_300Light" }}
                  className="  text-textColor text-base smallPhone:text-sm"
                >
                  Series:
                </Text>
                <Text className="text-redColor">*</Text>
              </View>

              <TextInput
                style={{
                  fontFamily: "OpenSans_400Regular",
                }}
                className="w-full px-2 py-4 bg-secondaryColor rounded-lg  text-textColor "
                keyboardType="numeric"
                value={numberOfSeries}
                onChangeText={validator}
              />
            </View>
            <View style={{ gap: 4 }} className="flex flex-col flex-1">
              <View className="flex flex-row gap-1">
                <Text
                  style={{ fontFamily: "OpenSans_300Light" }}
                  className="text-textColor text-base smallPhone:text-sm"
                >
                  Reps:
                </Text>
                <Text className="text-redColor">*</Text>
              </View>

              <TextInput
                style={{
                  fontFamily: "OpenSans_400Regular",
                }}
                className="w-full px-2 py-4 bg-secondaryColor rounded-lg  text-textColor "
                value={exerciseReps}
                onChangeText={(text: string) => setExerciseReps(text)}
              />
            </View>
          </View>
          <View className="flex justify-between flex-row w-full">
            <CustomButton
              text="New exercise"
              onPress={toggleExerciseForm}
              buttonStyleType={ButtonStyle.outline}
            />
            <CustomButton
              text="Add to list"
              onPress={addToList}
              buttonStyleType={ButtonStyle.success}
            />
          </View>
        </View>
        <ExerciseList
          exerciseList={exercisesList}
          removeExerciseFromList={removeExerciseFromList}
          editExerciseFromList={editExerciseFromList}
        />
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
      {isTrainingPlanDayExerciseFormShow ? (
        <CreateExercise closeForm={toggleExerciseForm} />
      ) : (
        <></>
      )}
    </View>
  );
};

export default CreatePlanDayExerciseList;

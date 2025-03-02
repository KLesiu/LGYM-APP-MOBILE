import { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { DropdownItem } from "../../../../interfaces/Dropdown";
import { ExerciseForm, ExerciseForPlanDay } from "../../../../interfaces/Exercise";
import { isIntValidator } from "../../../../helpers/numberValidator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton, { ButtonStyle } from "../../../elements/CustomButton";
import PlanNameIcon from "./../../../..//img/icons/planIcon.svg";
import AutoComplete from "../../../elements/Autocomplete";
import ExerciseList from "./exerciseList/ExerciseList";
import CreateExercise from "../../exercises/CreateExercise";
import ViewLoading from "../../../elements/ViewLoading";

interface CreatePlanDayExerciseListProps {
  goBack: () => void;
  goToNext: () => void;
  setExerciseList: (exerciseList: ExerciseForPlanDay[]) => void;
  exerciseList: ExerciseForPlanDay[];
}

const CreatePlanDayExerciseList: React.FC<CreatePlanDayExerciseListProps> = (
  props
) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
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
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await getAllExercises();
  };

  const addToList = (): void => {
    if (!isIntValidator(numberOfSeries)) return;
    if (!numberOfSeries || !exerciseReps || !selectedExercise) return;

    const exercise: ExerciseForPlanDay = {
      series: parseInt(numberOfSeries),
      reps: exerciseReps,
      exercise: selectedExercise,
    };

    props.setExerciseList([...props.exerciseList, exercise]);

    setNumberOfSeries("");
    setExerciseReps("");
    setSelectedExercise(undefined);

    setClearQuery(true);
  };
  const clearAutoCompleteQuery = () => {
    setClearQuery(false);
  };
  const removeExerciseFromList = (item: ExerciseForPlanDay) => {
    const newList = props.exerciseList.filter(
      (exercise: ExerciseForPlanDay) => exercise !== item
    );
    props.setExerciseList(newList);
  };

  const getAllExercises = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
      `${apiURL}/api/exercise/${id}/getAllExercises`
    );
    const result = await response.json();
    const helpExercisesToSelect = result.map((exercise: ExerciseForm) => {
      return { label: exercise.name, value: exercise._id };
    });
    setExercisesToSelect(helpExercisesToSelect);
  };

  const toggleExerciseForm = async () => {
    setIsTrainingPlanDayExerciseFormShow(!isTrainingPlanDayExerciseFormShow);
    await getAllExercises();
  };

  const editExerciseFromList = (item: ExerciseForPlanDay) => {
    setSelectedExercise(
      exercisesToSelect.find(
        (exercise) => exercise.value === item.exercise.value
      )
    );
    setNumberOfSeries(item.series.toString());
    setExerciseReps(item.reps);
    removeExerciseFromList(item);
  };


  const goNextSection = () => {
    props.goToNext();
  }

  return (
    <View className="w-full h-full">
      <View className="px-5 py-2">
        <Text
          className="text-3xl text-white"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Create plan list
        </Text>
      </View>
      <View className="px-5" style={{ gap: 16 }}>
        <View className="flex flex-row" style={{ gap: 8 }}>
          <PlanNameIcon />
          <Text
            className="text-xl text-white"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            New Exercises
          </Text>
        </View>
        <View style={{ gap: 4 }} className="flex flex-col">
          <Text
            style={{ fontFamily: "OpenSans_300Light" }}
            className="  text-white  text-base"
          >
            Exercise name
          </Text>
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
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="  text-white  text-base"
            >
              Series:
            </Text>
            <TextInput
              style={{
                fontFamily: "OpenSans_400Regular",
                backgroundColor: "rgb(30, 30, 30)",
                borderRadius: 8,
              }}
              className=" w-full  px-2 py-4 text-white  "
              keyboardType="numeric"
              value={numberOfSeries}
              onChangeText={(text: string) => setNumberOfSeries(text)}
            />
          </View>
          <View style={{ gap: 4 }} className="flex flex-col flex-1">
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="text-white text-base"
            >
              Reps:
            </Text>
            <TextInput
              style={{
                fontFamily: "OpenSans_400Regular",
                backgroundColor: "rgb(30, 30, 30)",
                borderRadius: 8,
              }}
              className=" w-full  px-2 py-4 text-white  "
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
        exerciseList={props.exerciseList}
        removeExerciseFromList={removeExerciseFromList}
        editExerciseFromList={editExerciseFromList}
      />
      <View className="p-5 flex flex-row justify-between" style={{ gap: 20 }}>
        <CustomButton
          buttonStyleType={ButtonStyle.outlineBlack}
          onPress={props.goBack}
          text="Back"
          width="flex-1"
        />
        <CustomButton
          buttonStyleType={ButtonStyle.default}
          onPress={goNextSection}
          text="Next"
          width="flex-1"
        />
      </View>
      {isTrainingPlanDayExerciseFormShow ? (
        <CreateExercise closeForm={toggleExerciseForm} />
      ) : (
        <></>
      )}
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </View>
  );
};

export default CreatePlanDayExerciseList;

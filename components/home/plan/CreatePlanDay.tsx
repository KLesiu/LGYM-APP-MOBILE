import { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import AutoComplete, { DropdownItem } from "./../../elements/Autocomplete";
import {
  ExerciseForm,
  ExerciseForPlanDay,
} from "./../../../interfaces/Exercise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isIntValidator } from "../../../helpers/numberValidator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Message } from "../../../enums/Message";
import ViewLoading from "../../elements/ViewLoading";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import CreateExercise from "../exercises/CreateExercise";

interface CreatePlanDayProps {
  planId: string;
  closeForm: () => void;
  planDayId?: string;
}

const CreatePlanDay: React.FC<CreatePlanDayProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [planDayName, setPlanDayName] = useState<string>("");
  const [exercisesList, setExercisesList] = useState<ExerciseForPlanDay[]>([]);
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
  const [clearQuery, setClearQuery] = useState<boolean>(false); // Nowy stan do czyszczenia query
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await getAllExercises();
    if (props.planDayId) await getPlanDay();
  };

  const getAllExercises = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${apiURL}/api/exercise/${id}/getAllExercises`)
      .then((res) => res)
      .catch((err) => err)
      .then((res) => res.json());
    const helpExercisesToSelect = response.map((exercise: ExerciseForm) => {
      return { label: exercise.name, value: exercise._id };
    });
    setExercisesToSelect(helpExercisesToSelect);
  };
  const mapExercisesListToSend = () => {
    const exercises = exercisesList.map((exercise: ExerciseForPlanDay) => {
      return {
        exercise: exercise.exercise.value,
        series: exercise.series,
        reps: exercise.reps,
      };
    });
    return exercises;
  };
  const createPlanDay = async () => {
    setViewLoading(true);
    const exercises = mapExercisesListToSend();
    const response = await fetch(
      `${apiURL}/api/planDay/${props.planId}/createPlanDay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: planDayName,
          exercises: exercises,
        }),
      }
    );
    const result = await response.json();
    if (result.msg === Message.Created)props.closeForm();
    
    setViewLoading(false);
  };
  const editPlanDay = async () => {
    setViewLoading(true);
    const exercises = mapExercisesListToSend()
    const response = await fetch(
      `${apiURL}/api/planDay/updatePlanDay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: props.planDayId,
          name: planDayName,
          exercises: exercises,
        }),
      }
    );
    const result = await response.json();
    if(result.msg === Message.Updated) props.closeForm()
    setViewLoading(false);
  };
  const removeExerciseFromList = (item: ExerciseForPlanDay) => () => {
    const newList = exercisesList.filter(
      (exercise: ExerciseForPlanDay) => exercise !== item
    );
    setExercisesList(newList);
  };
  const addToList = (): void => {
    if (!isIntValidator(numberOfSeries)) return;
    if (!numberOfSeries || !exerciseReps || !selectedExercise) return;

    const exercise: ExerciseForPlanDay = {
      series: parseInt(numberOfSeries),
      reps: exerciseReps,
      exercise: selectedExercise,
    };

    setExercisesList([...exercisesList, exercise]);

    // Resetowanie pól
    setNumberOfSeries("");
    setExerciseReps("");
    setSelectedExercise(undefined);

    // Ustawiamy clearQuery, aby AutoComplete wyczyścił query
    setClearQuery(true);
  };

  const clearAutoCompleteQuery = () => {
    // Po wyczyszczeniu query resetujemy stan, aby zapobiec ponownemu wywołaniu
    setClearQuery(false);
  };
  // Funkcja do renderowania dynamicznej listy
  const renderExerciseItem = ({ item }: { item: ExerciseForPlanDay }) => {
    const IconElement: JSX.Element = (
      <Icon style={{ color: "#de161d", fontSize: 20 }} name="delete" />
    );
    return (
      <View className="flex flex-row items-center justify-between">
        <Text
          style={{ fontFamily: "OpenSans_300Light" }}
          className="text-white text-sm"
        >
          - {`${item.exercise.label}: ${item.series}x${item.reps}`}
        </Text>
        <CustomButton
          onPress={removeExerciseFromList(item)}
          customSlots={[IconElement]}
        />
      </View>
    );
  };
  const getPlanDay = async () => {
    const response = await fetch(
      `${apiURL}/api/planDay/${props.planDayId}/getPlanDay`
    );
    const result = await response.json();
    const currentExercisesList = result.exercises.map(
      (exerciseInPlanDay: {
        series: number;
        reps: string;
        exercise: ExerciseForm;
      }) => {
        return {
          series: exerciseInPlanDay.series,
          reps: exerciseInPlanDay.reps,
          exercise: {
            label: exerciseInPlanDay.exercise.name,
            value: exerciseInPlanDay.exercise._id,
          },
        };
      }
    );
    setPlanDayName(result.name);
    setExercisesList(currentExercisesList);
  };
  const toggleExerciseForm = async () => {
    setIsTrainingPlanDayExerciseFormShow(!isTrainingPlanDayExerciseFormShow);
    await getAllExercises();
  };

  return (
    <View className="absolute h-full w-full top-0   z-30 ">
      <View
        style={{ gap: 16 }}
        className="flex flex-col bg-[#121212] h-full w-full p-4 relative"
      >
        <Text
          className="text-lg text-white border-b-[1px] border-[#94e798] py-1  w-full"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          New Plan Day
        </Text>

        <View style={{ gap: 8 }} className="flex flex-col flex-1">
          <View style={{ gap: 4 }} className="flex flex-col ">
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="  text-white  text-base"
            >
              Name:
            </Text>
            <TextInput
              style={{
                fontFamily: "OpenSans_400Regular",
                backgroundColor: "rgba(30, 30, 30, 0.45)",
                borderRadius: 8,
              }}
              className=" w-full  px-2 py-4 text-white  "
              onChangeText={(text: string) => setPlanDayName(text)}
              value={planDayName}
            />
          </View>
          <View className="flex flex-col items-end " style={{ gap: 8 }}>
            <View className="flex flex-col w-full">
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="  text-white  text-base"
              >
                Exercise:
              </Text>
              <AutoComplete
                data={exercisesToSelect}
                onSelect={(item) => setSelectedExercise(item)}
                value={selectedExercise?.label || ""}
                onClearQuery={clearQuery ? clearAutoCompleteQuery : undefined}
              />
            </View>
            <View className="flex flex-row" style={{ gap: 16 }}>
              <View style={{ gap: 8 }} className="flex flex-col flex-1">
                <Text
                  style={{ fontFamily: "OpenSans_300Light" }}
                  className="  text-white  text-base"
                >
                  Series:
                </Text>
                <TextInput
                  style={{
                    fontFamily: "OpenSans_400Regular",
                    backgroundColor: "rgba(30, 30, 30, 0.45)",
                    borderRadius: 8,
                  }}
                  className=" w-full  px-2 py-4 text-white  "
                  keyboardType="numeric"
                  value={numberOfSeries}
                  onChangeText={(text: string) => setNumberOfSeries(text)}
                />
              </View>

              <View style={{ gap: 8 }} className="flex flex-col flex-1">
                <Text
                  style={{ fontFamily: "OpenSans_300Light" }}
                  className="text-white text-base"
                >
                  Reps:
                </Text>
                <TextInput
                  style={{
                    fontFamily: "OpenSans_400Regular",
                    backgroundColor: "rgba(30, 30, 30, 0.45)",
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
                buttonStyleType={ButtonStyle.default}
              />
            </View>
          </View>

          <View className="flex flex-col h-32 ">
            {/* Lista dodanych ćwiczeń */}
            <Text
              style={{ fontFamily: "OpenSans_400Regular" }}
              className="text-white text-base"
            >
              Exercises List:
            </Text>
            <ScrollView className="h-full">
              <View className="flex flex-col " style={{ gap: 8 }}>
                {exercisesList.length > 0 ? (
                  exercisesList.map((item, index) => (
                    <View key={index}>{renderExerciseItem({ item })}</View>
                  ))
                ) : (
                  <Text
                    className="text-white"
                    style={{ fontFamily: "OpenSans_300Light" }}
                  >
                    No exercises added yet.
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
          <View
            className="flex flex-row items-end   justify-between"
            style={{ gap: 16 }}
          >
            <CustomButton
              width="flex-1"
              text="Cancel"
              onPress={props.closeForm}
              buttonStyleType={ButtonStyle.cancel}
            />
            {props.planDayId ? (
              <CustomButton
                width="flex-1"
                text="Edit"
                onPress={editPlanDay}
                buttonStyleType={ButtonStyle.success}
              />
            ) : (
              <CustomButton
                width="flex-1"
                text="Create"
                onPress={createPlanDay}
                buttonStyleType={ButtonStyle.success}
              />
            )}
          </View>
        </View>
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

export default CreatePlanDay;

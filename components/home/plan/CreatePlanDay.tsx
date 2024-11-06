import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import AutoComplete, { DropdownItem } from "./../../elements/Autocomplete";
import { ExerciseForm, ExerciseForPlanDay } from "./../../../interfaces/Exercise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isIntValidator } from "../../../helpers/numberValidator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Message } from "../../../enums/Message";
import ViewLoading from "../../elements/ViewLoading";

interface CreatePlanDayProps{
  planId: string,
  closeForm: ()=>void,
}

const CreatePlanDay: React.FC<CreatePlanDayProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [planDayName, setPlanDayName] = useState<string>("");
  const [exercisesList, setExercisesList] = useState<ExerciseForPlanDay[]>([]);
  const [exercisesToSelect, setExercisesToSelect] = useState<DropdownItem[]>(
    []
  );
  const [numberOfSeries, setNumberOfSeries] = useState<string>("");
  const [exerciseReps, setExerciseReps] = useState<string>("");
  const [selectedExercise, setSelectedExercise] = useState<DropdownItem>();
  const [clearQuery, setClearQuery] = useState<boolean>(false); // Nowy stan do czyszczenia query
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  useEffect(() => {
    getAllExercises();
  }, []);

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
  const createPlanDay = async () => {
    setViewLoading(true);
    const exercises = exercisesList.map((exercise: ExerciseForPlanDay) => {
      return {
        exercise: exercise.exercise.value,
        series: exercise.series,
        reps: exercise.reps,
      };
    });
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
    if (!response.ok) {
    }
    const result = await response.json();
    if (result.msg === Message.Created) {
      props.closeForm();
    }
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
  const renderExerciseItem = ({ item }: { item: ExerciseForPlanDay }) => (
    <View className="flex flex-row items-center justify-between">
      <Text
        style={{ fontFamily: "OpenSans_300Light" }}
        className="text-white text-sm"
      >
        - {`${item.exercise.label}: ${item.series}x${item.reps}`}
      </Text>
      <Pressable onPress={removeExerciseFromList(item)}>
        <Icon style={{ color: "#de161d", fontSize: 20 }} name="delete" />
      </Pressable>
    </View>
  );

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
            />
          </View>
          <View className="flex flex-col items-end ">
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
                onClearQuery={clearQuery ? clearAutoCompleteQuery : undefined} // Przekazujemy funkcję, jeśli clearQuery jest true
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

            <Pressable
              style={{ borderRadius: 8 }}
              className="bg-white w-40 h-12 flex items-center justify-center  mt-2"
              onPress={addToList}
            >
              <Text
                className="text-base"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                ADD TO LIST
              </Text>
            </Pressable>
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
              <View className="flex flex-col " style={{ gap: 16 }}>
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
          <View className="flex flex-row items-end   justify-between">
            <Pressable
              style={{ borderRadius: 8 }}
              onPress={props.closeForm}
              className=" flex flex-row justify-center items-center  w-40 h-12 bg-[#3f3f3f]"
            >
              <Text
                className="text-center text-base text-white"
                style={{
                  fontFamily: "OpenSans_400Regular",
                }}
              >
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={{ borderRadius: 8 }}
              className="bg-[#94e798] w-40 h-12 flex items-center justify-center "
              onPress={createPlanDay}
            >
              <Text
                className="text-base"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                Create
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </View>
  );
};

export default CreatePlanDay;

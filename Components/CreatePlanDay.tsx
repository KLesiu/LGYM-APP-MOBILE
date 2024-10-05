import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import AutoComplete, { DropdownItem } from "./Autocomplete";
import { ExerciseForm, ExerciseForPlanDay } from "./interfaces/Exercise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isIntValidator } from "./helpers/numberValidator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CreatePlanDayProps from "./props/CreatePlanDayProps";
import { Message } from "./enums/Message";

const CreatePlanDay: React.FC<CreatePlanDayProps> = (props) => {
  const API_URL = process.env.REACT_APP_BACKEND;
  const [planDayName, setPlanDayName] = useState<string>("");
  const [exercisesList, setExercisesList] = useState<ExerciseForPlanDay[]>([]);
  const [exercisesToSelect, setExercisesToSelect] = useState<DropdownItem[]>(
    []
  );
  const [numberOfSeries, setNumberOfSeries] = useState<string>("");
  const [exerciseReps, setExerciseReps] = useState<string>("");
  const [selectedExercise, setSelectedExercise] = useState<DropdownItem>();
  const [clearQuery, setClearQuery] = useState<boolean>(false); // Nowy stan do czyszczenia query

  useEffect(() => {
    getAllExercises();
  }, []);

  const getAllExercises = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
      `${API_URL}/api/exercise/${id}/getAllExercises`
    )
      .then((res) => res.json())
      .catch((err) => err);
    const helpExercisesToSelect = response.map((exercise: ExerciseForm) => {
      return { label: exercise.name, value: exercise._id };
    });
    setExercisesToSelect(helpExercisesToSelect);
  };
  const createPlanDay = async () => {
    const exercises = exercisesList.map((exercise: ExerciseForPlanDay) => {
      return {
        exercise: exercise.exercise.value,
        series: exercise.series,
        reps: exercise.reps,
      };
    });
    const response = await fetch(`${API_URL}/api/planDay/${props.planId}/createPlanDay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: planDayName,
        exercises: exercises,
      }),
    })
      .then((res) => res.json())
      .catch((err) => err);
    if(response.msg === Message.Created){
      props.closeForm();
    }
  };
  const validator = (input: string): void => {
    if (!input) return setNumberOfSeries(input);
    const result = isIntValidator(input);
    if (result) setNumberOfSeries(input);
  };
  const removeExerciseFromList = (item: ExerciseForPlanDay) => () => {
    const newList = exercisesList.filter(
      (exercise: ExerciseForPlanDay) => exercise !== item
    );
    setExercisesList(newList);
  }
  const addToList = (): void => {
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
    <Text
      style={{ fontFamily: "OpenSans_400Regular" }}
      className="text-white text-lg flex justify-between"
    >
      - {`${item.exercise.label}: ${item.series}x${item.reps}`}{" "}
      <Pressable onPress={removeExerciseFromList(item)}>
        {" "}
        <Icon style={{ color: "#de161d", fontSize: 30 }} name="delete" />
      </Pressable>
    </Text>
  );

  return (
    <View className="absolute h-full w-full flex flex-col bg-[#121212] top-0 z-30 gap-0">
      <Text
        className="text-3xl text-white text-center border-b-2 border-[#94e798] w-full p-4"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        New Plan Day
      </Text>

      <View className="flex flex-col  justify-between p-4   pl-2 pt-2 gap-2 flex-1">
        {/* Nazwa planu */}
        <View className="flex flex-col gap-2">
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="text-white text-xl"
          >
            Name:
          </Text>
          <TextInput
            style={{ fontFamily: "OpenSans_400Regular" }}
            className="bg-white h-8 text-black"
            onChangeText={(text: string) => setPlanDayName(text)}
          />
        </View>
        <View className="flex flex-col gap-2">
          {/* Lista dodanych ćwiczeń */}
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="text-white text-xl mt-4"
          >
            Exercises List:
          </Text>
          <ScrollView className="h-40">
            <FlatList
              data={exercisesList}
              renderItem={renderExerciseItem}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={() => (
                <Text
                  className="text-white"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  No exercises added yet.
                </Text>
              )}
            />
          </ScrollView>
        </View>

        {/* Formularz dodawania ćwiczeń */}
        <View className="p-4 flex flex-col items-end bg-[#282828] mt-4 rounded-lg">
          <View className="flex flex-col w-full">
            <Text
              style={{ fontFamily: "OpenSans_700Bold" }}
              className="text-white text-xl"
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

          <View className="flex flex-col w-full">
            <Text
              style={{ fontFamily: "OpenSans_700Bold" }}
              className="text-white text-xl"
            >
              Series:
            </Text>
            <TextInput
              style={{ fontFamily: "OpenSans_400Regular" }}
              className="bg-white h-8 p-4 text-black"
              value={numberOfSeries}
              keyboardType="numeric"
              onChangeText={validator}
            />
          </View>

          <View className="flex flex-col w-full">
            <Text
              style={{ fontFamily: "OpenSans_700Bold" }}
              className="text-white text-xl"
            >
              Reps:
            </Text>
            <TextInput
              style={{ fontFamily: "OpenSans_400Regular" }}
              className="bg-white h-8 text-black p-4"
              value={exerciseReps}
              onChangeText={(text: string) => setExerciseReps(text)}
            />
          </View>

          <Pressable
            className="bg-white w-40 h-12 flex items-center justify-center rounded-lg mt-2"
            onPress={addToList}
          >
            <Text
              className="text-xl"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              ADD TO LIST
            </Text>
          </Pressable>
        </View>

        <Pressable className="bg-[#94e798] self-end w-40 h-12 flex items-center justify-center rounded-lg" onPress={createPlanDay}>
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="text-[#131313] text-2xl"
          >
            CREATE
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CreatePlanDay;
 
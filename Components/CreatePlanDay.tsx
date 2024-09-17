import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";
import AutoComplete, { DropdownItem } from "./Autocomplete";
import { ExerciseForm, ExerciseForPlanDay } from "./interfaces/Exercise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isIntValidator } from "./helpers/numberValidator";

const CreatePlanDay: React.FC = () => {
  const API_URL = process.env.REACT_APP_BACKEND;
  const [planDayName, setPlanDayName] = useState<string>("");
  const [exercisesList, setExercisesList] = useState<ExerciseForPlanDay[]>([]);
  const [exercisesToSelect, setExercisesToSelect] = useState<DropdownItem[]>(
    []
  );
  const [numberOfSeries, setNumberOfSeries] = useState<string>("");
  const [exerciseReps, setExerciseReps] = useState<string>("");
  const [selectedExercise, setSelectedExercise] = useState<DropdownItem>();

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

  const validator = (input: string): void => {
    if (!input) return setNumberOfSeries(input);
    const result = isIntValidator(input);
    if (result) setNumberOfSeries(input);
  };

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
  };

  // Funkcja do renderowania dynamicznej listy
  const renderExerciseItem = ({ item }: { item: ExerciseForPlanDay }) => (
    <Text
      style={{ fontFamily: "OpenSans_400Regular" }}
      className="text-white text-lg"
    >
      - {`${item.exercise.label}: ${item.series}x${item.reps}`}
    </Text>
  );

  return (
    <View className="absolute h-full w-full flex flex-col bg-black top-0 z-30 gap-0">
      <Text
        className="text-3xl text-white text-center border-b-2 border-[#4CD964] w-full p-4"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        New Plan Day
      </Text>

      <View className="flex flex-col p-4   pl-2 pt-2 gap-2">
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

          {/* Dynamicznie renderowana lista ćwiczeń */}
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
        </View>

        {/* Formularz dodawania ćwiczeń */}
        <View className="p-4 flex flex-col items-end bg-[#4CD964] mt-4 rounded-lg">
          <View className="flex flex-col w-full">
            <Text
              style={{ fontFamily: "OpenSans_700Bold" }}
              className="text-black text-xl"
            >
              Exercise:
            </Text>
            <AutoComplete
              data={exercisesToSelect}
              onSelect={(item) => setSelectedExercise(item)}
              value={selectedExercise?.label || ""}
            />
          </View>

          <View className="flex flex-col w-full">
            <Text
              style={{ fontFamily: "OpenSans_700Bold" }}
              className="text-black text-xl"
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
              className="text-black text-xl"
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
      </View>
    </View>
  );
};

export default CreatePlanDay;

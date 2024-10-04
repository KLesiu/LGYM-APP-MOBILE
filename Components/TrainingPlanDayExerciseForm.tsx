import { View, Text, TextInput, Pressable } from "react-native";
import TrainingPlanDayExerciseFormProps from "./props/TrainingPlanDayExerciseFormProps";
import AutoComplete, { DropdownItem } from "./Autocomplete";
import { useEffect, useState } from "react";
import { isIntValidator } from "./helpers/numberValidator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseForm } from "./interfaces/Exercise";

const TrainingPlanDayExerciseForm: React.FC<
  TrainingPlanDayExerciseFormProps
> = (props) => {
  const API_URL = process.env.REACT_APP_BACKEND;

  const [exercisesToSelect, setExercisesToSelect] = useState<DropdownItem[]>(
    []
  );
  const [numberOfSeries, setNumberOfSeries] = useState<string>("");
  const [exerciseReps, setExerciseReps] = useState<string>("");
  const [selectedExercise, setSelectedExercise] = useState<DropdownItem>();
  const [clearQuery, setClearQuery] = useState<boolean>(false); // Nowy stan do czyszczenia query

  useEffect(() => {
    if(props.bodyPart) getExercisesByBodyPart()
    else getAllExercises();
  }, []);

  const getExercisesByBodyPart = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
        `${API_URL}/api/exercise/${id}/getExerciseByBodyPart`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bodyPart:props.bodyPart
            })
        }
      )
        .then((res) => res.json())
        .catch((err) => err);
      const helpExercisesToSelect = response.map((exercise: ExerciseForm) => {
        return { label: exercise.name, value: exercise._id };
      });
      setExercisesToSelect(helpExercisesToSelect);
  }
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
  const clearAutoCompleteQuery = () => {
    // Po wyczyszczeniu query resetujemy stan, aby zapobiec ponownemu wywołaniu
    setClearQuery(false);
  };
  const validator = (input: string): void => {
    if (!input) return setNumberOfSeries(input);
    const result = isIntValidator(input);
    if (result) setNumberOfSeries(input);
  };
  const sendNewExercise =()=>{
    if(!selectedExercise || !numberOfSeries || !exerciseReps) return;
    props.addExerciseToPlanDay(selectedExercise.value,parseInt(numberOfSeries),exerciseReps);
  }
  return (
    <View
      className="absolute h-full w-full flex flex-col items-center bg-[#121212]  top-0 z-30 p-4"
      style={{ gap: 16 }}
    >
      <Text
        className="w-full text-2xl text-center text-white  font-bold "
        style={{
          fontFamily: "OpenSans_700Bold",
        }}
      >
        ADD EXERCISE TO CURRENT TRAINING
      </Text>
      <View
        className=" w-full rounded-lg bg-[#282828] p-4  flex flex-col"
        style={{ gap: 4 }}
      >
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
      </View>
      <View className="w-full flex flex-row justify-between">
        <Pressable onPress={sendNewExercise} className="rounded-lg flex flex-row justify-center items-center w-28 h-14 bg-[#94e798]">
          <Text
            className="text-center text-xl text-black"
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            ADD
          </Text>
        </Pressable>
        <Pressable onPress={props.cancel} className="rounded-lg flex flex-row justify-center items-center w-28 h-14 bg-[#3f3f3f]">
          <Text
            className="text-center text-xl text-white"
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            CANCEL
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TrainingPlanDayExerciseForm;

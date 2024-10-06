import {
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";
import RecordsPopUpProps from "./props/RecordsPopUpProps";
import AutoComplete, { DropdownItem } from "./Autocomplete";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainRecordsForm } from "./interfaces/MainRecords";
import { ExerciseForm } from "./interfaces/Exercise";
import { isIntValidator } from "./helpers/numberValidator";
import { Message } from "./enums/Message";
import { WeightUnits } from "./enums/Units";
const RecordsPopUp: React.FC<RecordsPopUpProps> = (props) => {
  const API_URL = process.env.REACT_APP_BACKEND;
  const [error, setError] = useState<Message>();
  const [selectedExercise, setSelectedExercise] = useState<DropdownItem>();
  const [exercisesToSelect, setExercisesToSelect] = useState<DropdownItem[]>(
    []
  );
  const [weight, setWeight] = useState<string>();
  const [clearQuery, setClearQuery] = useState<boolean>(false); // Nowy stan do czyszczenia query

  useEffect(() => {
    getAllExercises();
  }, []);
  const getAllExercises = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
      `${API_URL}/api/exercise/${id}/getAllExercises`
    )
      .then((res) => res)
      .catch((err) => err).then(res=>res.json());
    const helpExercisesToSelect = response.map((exercise: ExerciseForm) => {
      return { label: exercise.name, value: exercise._id };
    });
    if (props.exerciseId) {
      const exercise = helpExercisesToSelect.find(
        (exercise: DropdownItem) => exercise.value === props.exerciseId
      );
      setSelectedExercise(exercise);
    }
    setExercisesToSelect(helpExercisesToSelect);
  };
  const clearAutoCompleteQuery = () => {
    // Po wyczyszczeniu query resetujemy stan, aby zapobiec ponownemu wywołaniu
    setClearQuery(false);
  };
  const validator = (input: string): void => {
    if (!input) return setWeight(input);
    const result = isIntValidator(input);
    if (result) setWeight(input);
  };
  const createNewRecord = async () => {
    if (!weight || !selectedExercise) return setError(Message.FieldRequired);
    const form: MainRecordsForm = {
      weight: parseFloat(weight),
      exercise: selectedExercise.value,
      unit: WeightUnits.KILOGRAMS,
      date: new Date(),
    };
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
      `${API_URL}/api/mainRecords/${id}/addNewRecord`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    )
      .then((res) => res.json())
      .catch((err) => err);
    if (response.msg === Message.Created) {
      props.offPopUp();
    }
  };
  return (
    <View
      style={{ gap: 16 }}
      className="absolute w-full h-full flex-1 text-white bg-[#121212] flex flex-col"
    >
      <Text
        className="text-center text-xl text-white"
        style={{
          fontFamily: "OpenSans_400Regular",
        }}
      >
        {props.exerciseId && selectedExercise ? "EDIT RECORD" : "NEW RECORD"}
      </Text>
      <View className="flex flex-col p-2" style={{ gap: 16 }}>
        <View className="flex flex-col w-full">
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="text-white text-xl"
          >
            Exercise:
          </Text>
          {props.exerciseId && selectedExercise ? (
            <TextInput    style={{ fontFamily: "OpenSans_400Regular" }}
            className="bg-white h-12 text-black p-4 rounded-lg" readOnly={true} value={selectedExercise.label}/>
          ) : (
            <AutoComplete
              data={exercisesToSelect}
              onSelect={(item) => setSelectedExercise(item)}
              value={selectedExercise?.label || ""}
              onClearQuery={clearQuery ? clearAutoCompleteQuery : undefined} // Przekazujemy funkcję, jeśli clearQuery jest true
            />
          )}
        </View>
        <View className="flex flex-col w-full">
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="text-white text-xl"
          >
            Weight:
          </Text>
          <TextInput
            style={{ fontFamily: "OpenSans_400Regular" }}
            className="bg-white h-12 text-black p-4 rounded-lg"
            onChangeText={validator}
            value={weight}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View className="w-full flex flex-row justify-between">
        
        <Pressable
          onPress={createNewRecord}
          className="rounded-lg flex flex-row justify-center items-center w-28 h-14 bg-[#94e798]"
        >
          <Text
            className="text-center text-xl text-black"
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            ADD
          </Text>
        </Pressable>
        <Pressable
          onPress={props.offPopUp}
          className="rounded-lg flex flex-row justify-center items-center w-28 h-14 bg-[#3f3f3f]"
        >
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
export default RecordsPopUp;

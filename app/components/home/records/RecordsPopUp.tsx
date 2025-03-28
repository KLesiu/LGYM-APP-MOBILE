import { Text, View, TextInput, Pressable } from "react-native";
import { MainRecordsForm } from "./../../../../interfaces/MainRecords";
import AutoComplete from "./../../elements/Autocomplete";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseForm } from "./../../../../interfaces/Exercise";
import { isIntValidator } from "./../../../../helpers/numberValidator";
import { Message } from "./../../../../enums/Message";
import { WeightUnits } from "./../../../../enums/Units";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import { DropdownItem } from "./../../../../interfaces/Dropdown";
import Dialog from "../../elements/Dialog";

interface RecordsPopUpProps {
  offPopUp: () => void;
  exerciseId: string | undefined;
}
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
    );
    const result = await response.json();
    const helpExercisesToSelect = result.map((exercise: ExerciseForm) => {
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
  const clearAutoCompleteQuery = () => setClearQuery(false);

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
    );
    const result = await response.json();
    if (result.msg === Message.Created) {
      props.offPopUp();
    }
  };
  return (
    <Dialog>
      <Text
        className="text-center text-xl text-white"
        style={{
          fontFamily: "OpenSans_700Bold",
        }}
      >
        {props.exerciseId && selectedExercise ? "EDIT RECORD" : "NEW RECORD"}
      </Text>
      <View className="flex flex-col w-full p-2" style={{ gap: 16 }}>
        <View className="flex flex-col w-full">
          <Text
            className="text-white text-base"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Exercise:
          </Text>
          {props.exerciseId && selectedExercise ? (
            <TextInput
              style={{ fontFamily: "OpenSans_400Regular" }}
              className="w-full px-2 py-4 bg-secondaryColor rounded-lg  text-white "
              readOnly={true}
              value={selectedExercise.label}
            />
          ) : (
            <AutoComplete
              data={exercisesToSelect}
              onSelect={(item) => setSelectedExercise(item)}
              value={selectedExercise?.label || ""}
              onClearQuery={clearQuery ? clearAutoCompleteQuery : undefined}
            />
          )}
        </View>
        <View className="flex flex-col w-full">
          <Text
            className="text-white text-base"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Weight:
          </Text>
          <TextInput
            style={{ fontFamily: "OpenSans_400Regular" }}
            className="w-full px-2 py-4 bg-secondaryColor rounded-lg  text-white "
            onChangeText={validator}
            value={weight}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View
        className="w-full flex flex-row justify-between"
        style={{ gap: 16 }}
      >
        <CustomButton
          text="Cancel"
          onPress={props.offPopUp}
          buttonStyleType={ButtonStyle.cancel}
          width="flex-1"
        />
        <CustomButton
          text="Add"
          onPress={createNewRecord}
          buttonStyleType={ButtonStyle.success}
          width="flex-1"
        />
      </View>
    </Dialog>
  );
};
export default RecordsPopUp;

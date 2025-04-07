import { View, Text, TextInput, Pressable } from "react-native";
import AutoComplete from "../../../elements/Autocomplete";
import { useEffect, useState } from "react";
import { isIntValidator } from "../../../../../helpers/numberValidator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseForm } from "../../../../../interfaces/Exercise";
import { BodyParts } from "../../../../../enums/BodyParts";
import CustomButton, { ButtonStyle } from "../../../elements/CustomButton";
import { DropdownItem } from "../../../../../interfaces/Dropdown";
import Dialog from "../../../elements/Dialog";

interface TrainingPlanDayExerciseFormProps {
  cancel: () => void;
  addExerciseToPlanDay: (
    exerciseId: string,
    series: number,
    reps: string
  ) => Promise<void>;
  bodyPart?: BodyParts;
}

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
    if (props.bodyPart) getExercisesByBodyPart();
    else getAllExercises();
  }, []);

  const getExercisesByBodyPart = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
      `${API_URL}/api/exercise/${id}/getExerciseByBodyPart`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bodyPart: props.bodyPart,
        }),
      }
    );
    const result = await response.json();
    const helpExercisesToSelect = result.map((exercise: ExerciseForm) => {
      return { label: exercise.name, value: exercise._id };
    });
    setExercisesToSelect(helpExercisesToSelect);
  };
  const getAllExercises = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
      `${API_URL}/api/exercise/${id}/getAllExercises`
    );
    if (!response.ok) return;
    const result = await response.json();
    const helpExercisesToSelect = result.map((exercise: ExerciseForm) => {
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
  const sendNewExercise = () => {
    if (!selectedExercise || !numberOfSeries || !exerciseReps) return;
    props.addExerciseToPlanDay(
      selectedExercise.value,
      parseInt(numberOfSeries),
      exerciseReps
    );
  };

  return (
    <Dialog>
      <Text
        className="text-lg text-white border-b-[1px] border-primaryColor py-1  w-full"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        Add exercise to the current training
      </Text>
      <View
        style={{ gap: 16 }}
        className="flex items-center flex-col justify-around w-full "
      >
        <View className="flex flex-col w-full" style={{ gap: 8 }}>
          <Text
            className="text-gray-200/80 font-light leading-4 text-base"
            style={{ fontFamily: "OpenSans_300Light" }}
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

        <View className="flex flex-col w-full" style={{ gap: 8 }}>
          <Text
            className="text-gray-200/80 font-light leading-4 text-base"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Series:
          </Text>
          <TextInput
            style={{
              fontFamily: "OpenSans_400Regular",
              backgroundColor: "rgb(30, 30, 30)",
              borderRadius: 8,
            }}
            className="w-full px-2 py-4  text-white "
            value={numberOfSeries}
            keyboardType="numeric"
            onChangeText={validator}
          />
        </View>

        <View className="flex flex-col w-full" style={{ gap: 8 }}>
          <Text
            className="text-gray-200/80 font-light leading-4 text-base"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Reps:
          </Text>
          <TextInput
            style={{
              fontFamily: "OpenSans_400Regular",
              backgroundColor: "rgb(30, 30, 30)",
              borderRadius: 8,
            }}
            className="w-full px-2 py-4  text-white "
            value={exerciseReps}
            onChangeText={(text: string) => setExerciseReps(text)}
          />
        </View>
      </View>
      <View
        className="w-full flex flex-row justify-between"
        style={{ gap: 16 }}
      >
        <CustomButton
          width="flex-1"
          onPress={props.cancel}
          buttonStyleType={ButtonStyle.cancel}
          text="Cancel"
        />
        <CustomButton
          width="flex-1"
          onPress={sendNewExercise}
          buttonStyleType={ButtonStyle.success}
          text="Add"
        />
      </View>
    </Dialog>
  );
};

export default TrainingPlanDayExerciseForm;

import { View, Text, TextInput, Pressable } from "react-native";
import AutoComplete, { DropdownItem } from "../../elements/Autocomplete";
import { useEffect, useState } from "react";
import { isIntValidator } from "../../../helpers/numberValidator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseForm } from "../../../interfaces/Exercise";
import { BodyParts } from "../../../enums/BodyParts";


interface TrainingPlanDayExerciseFormProps {
  cancel: () => void;
  addExerciseToPlanDay: (exerciseId:string,series:number,reps:string) => Promise<void>;
  bodyPart: BodyParts | undefined;
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
    )
    if(!response.ok) return;
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
    )
    if(!response.ok) return;
    const result = await response.json()
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
    <View
      className="absolute h-full w-full flex flex-col items-center bg-[#121212] p-4  top-0 z-30 "
      style={{ gap: 16 }}
    >
      <Text
       className="text-lg text-white border-b-[1px] border-[#94e798] py-1  w-full"
       style={{ fontFamily: "OpenSans_700Bold" }}
      >
        ADD EXERCISE TO CURRENT TRAINING
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
              backgroundColor: "rgba(30, 30, 30, 0.45)",
              borderRadius:8
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
              backgroundColor: "rgba(30, 30, 30, 0.45)",
              borderRadius:8

            }}
            className="w-full px-2 py-4  text-white "
            value={exerciseReps}
            onChangeText={(text: string) => setExerciseReps(text)}
          />
        </View>
      </View>
      <View className="w-full flex flex-row justify-between">
      <Pressable
          onPress={props.cancel}
          style={{borderRadius:8}}
          className=" flex flex-row justify-center items-center w-28 h-14 bg-[#3f3f3f]"
        >
          <Text
            className="text-center text-xl text-white"
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            Cancel
          </Text>
        </Pressable>
        <Pressable
          onPress={sendNewExercise}
          style={{borderRadius:8}}
          className=" flex flex-row justify-center items-center w-28 h-14 bg-[#94e798]"
        >
          <Text
            className="text-center text-xl text-black"
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            Add
          </Text>
        </Pressable>

      </View>
    </View>
  );
};

export default TrainingPlanDayExerciseForm;

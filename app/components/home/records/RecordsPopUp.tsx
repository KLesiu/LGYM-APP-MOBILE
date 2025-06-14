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
import { useHomeContext } from "../HomeContext";
import { useAppContext } from "../../../AppContext";
import ValidationView from "../../elements/ValidationView";

interface RecordsPopUpProps {
  offPopUp: () => void;
  exerciseId: string | undefined;
}
const RecordsPopUp: React.FC<RecordsPopUpProps> = (props) => {
  const [selectedExercise, setSelectedExercise] = useState<DropdownItem>();
  const [exercisesToSelect, setExercisesToSelect] = useState<DropdownItem[]>(
    []
  );
  const [weight, setWeight] = useState<string>();
  const [clearQuery, setClearQuery] = useState<boolean>(false); // Nowy stan do czyszczenia query
  const { userId } = useHomeContext();
  const { getAPI, setErrors, postAPI } = useAppContext();

  useEffect(() => {
    getAllExercises();
  }, []);

  const getAllExercises = async () => {
    try {
      await getAPI(
        `/exercise/${userId}/getAllExercises`,
        (response: ExerciseForm[]) => {
          const helpExercisesToSelect = response.map(
            (exercise: ExerciseForm) => {
              return {
                label: exercise.name,
                value: exercise._id,
              } as DropdownItem;
            }
          );
          if (props.exerciseId) {
            const exercise = helpExercisesToSelect.find(
              (exercise) => exercise.value === props.exerciseId
            );
            if (exercise) {
              setSelectedExercise(exercise);
            }
            setExercisesToSelect(helpExercisesToSelect);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
    
  };
  const clearAutoCompleteQuery = () => setClearQuery(false);

  const validator = (input: string): void => {
    if (!input) return setWeight(input);
    const result = isIntValidator(input);
    if (result) setWeight(input);
  };
  
  const createNewRecord = async () => {
    if (!weight || !selectedExercise) return setErrors([Message.FieldRequired]);
    const form: MainRecordsForm = {
      weight: parseFloat(weight),
      exercise: selectedExercise.value,
      unit: WeightUnits.KILOGRAMS,
      date: new Date(),
    };
    try {
      await postAPI(
        `/mainRecords/${userId}/addNewRecord`,
        () => props.offPopUp(),
        form
      );
    } catch (error) {
      console.error("Error creating new record:", error);
      setErrors([Message.TryAgain]);
    }
  };
  return (
    <Dialog>
      <View className="w-full h-full" style={{ gap: 16 }}>
        <Text
          className="text-center smallPhone:text-base  text-xl text-white"
          style={{
            fontFamily: "OpenSans_700Bold",
          }}
        >
          {props.exerciseId && selectedExercise ? "Edit record" : "New record"}
        </Text>
        <View className="flex flex-col w-full p-2" style={{ gap: 8 }}>
          <View className="flex flex-col w-full">
            <Text
              className="text-white smallPhone:text-sm text-base"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              Exercise:
            </Text>
            {props.exerciseId && selectedExercise ? (
              <TextInput
                style={{ fontFamily: "OpenSans_400Regular" }}
                className="w-full smallPhone:px-1 smallPhone:py-3 px-2 py-4 bg-secondaryColor rounded-lg  text-white "
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
              className="text-white smallPhone:text-sm text-base"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              Weight:
            </Text>
            <TextInput
              style={{ fontFamily: "OpenSans_400Regular" }}
              className="w-fullsmallPhone:px-1 smallPhone:py-3 px-2 py-4 bg-secondaryColor rounded-lg  text-white "
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
        <ValidationView />
      </View>
    </Dialog>
  );
};
export default RecordsPopUp;

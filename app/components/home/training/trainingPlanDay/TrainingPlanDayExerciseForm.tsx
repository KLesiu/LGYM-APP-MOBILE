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
import { useHomeContext } from "../../HomeContext";
import { useAppContext } from "../../../../AppContext";
import ValidationView from "../../../elements/ValidationView";
import { Message } from "../../../../../enums/Message";
import React from "react";

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
  const { apiURL, userId } = useHomeContext();
  const { postAPI, getAPI,isLoading ,setErrors} = useAppContext();

  const [exercisesToSelect, setExercisesToSelect] = useState<DropdownItem[]>(
    []
  );
  const [numberOfSeries, setNumberOfSeries] = useState<string>("");
  const [exerciseReps, setExerciseReps] = useState<string>("");
  const [selectedExercise, setSelectedExercise] = useState<DropdownItem>();
  const [clearQuery, setClearQuery] = useState<boolean>(false);

  useEffect(() => {
    if (props.bodyPart) getExercisesByBodyPart();
    else getAllExercises();
  }, []);

  const getExercisesByBodyPart = async () => {
    await postAPI(
      `/exercise/${userId}/getExerciseByBodyPart`,
      (result: ExerciseForm[]) => {
        const helpExercisesToSelect = result.map((exercise: ExerciseForm) => {
          return { label: exercise.name, value: exercise._id! };
        });
        setExercisesToSelect(helpExercisesToSelect);
      },
      { bodyPart: props.bodyPart }
    );
  };
  const getAllExercises = async () => {
    await getAPI(
      `/exercise/${userId}/getAllExercises`,
      (result: ExerciseForm[]) => {
        const helpExercisesToSelect = result.map((exercise: ExerciseForm) => {
          return { label: exercise.name, value: exercise._id! };
        });
        setExercisesToSelect(helpExercisesToSelect);
      }
    );
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
    if (!selectedExercise || !numberOfSeries || !exerciseReps) return setErrors([Message.FieldRequired]);
    props.addExerciseToPlanDay(
      selectedExercise.value,
      parseInt(numberOfSeries),
      exerciseReps
    );
  };

  return (
    <Dialog>
      <View className="w-full h-full flex flex-col py-5" style={{ gap: 16 }}>
        <View className="px-5 py-2">
          <Text
            className="text-3xl smallPhone:text-xl text-textColor"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            Add exercise to the current training
          </Text>
        </View>
        <View
          style={{ gap: 16 }}
          className="flex items-center flex-col justify-around w-full px-5"
        >
          <View className="flex flex-col w-full" style={{ gap: 8 }}>
            <Text
              className="text-gray-200/80 font-light leading-4 text-base smallPhone:text-sm"
              style={{ fontFamily: "OpenSans_300Light" }}
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

          <View className="flex flex-col w-full" style={{ gap: 8 }}>
            <Text
              className="text-gray-200/80 font-light leading-4 text-base smallPhone:text-sm"
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
              className="w-full px-2 py-4  text-textColor "
              value={numberOfSeries}
              keyboardType="numeric"
              onChangeText={validator}
            />
          </View>

          <View className="flex flex-col w-full" style={{ gap: 8 }}>
            <Text
              className="text-gray-200/80 font-light leading-4 text-base smallPhone:text-sm"
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
              className="w-full px-2 py-4  text-textColor "
              value={exerciseReps}
              onChangeText={(text: string) => setExerciseReps(text)}
            />
          </View>
        </View>
        <View
          className="w-full flex flex-row justify-between px-5"
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
            disabled={isLoading}
            onPress={sendNewExercise}
            buttonStyleType={ButtonStyle.success}
            text="Add"
          />
        </View>
        <ValidationView />
      </View>
    </Dialog>
  );
};

export default TrainingPlanDayExerciseForm;

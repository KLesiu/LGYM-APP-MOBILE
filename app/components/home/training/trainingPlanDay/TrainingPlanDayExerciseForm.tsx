import { View, Text, TextInput, Pressable } from "react-native";
import AutoComplete from "../../../elements/Autocomplete";
import { useEffect, useMemo, useState } from "react";
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
import {
  useGetApiExerciseIdGetAllExercises,
  usePostApiExerciseIdGetExerciseByBodyPart,
} from "../../../../../api/generated/exercise/exercise";

import { ExerciseResponseDto } from "../../../../../api/generated/model";

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
  const { userId } = useHomeContext();
  const { setErrors } = useAppContext();

  const [numberOfSeries, setNumberOfSeries] = useState<string>("");
  const [exerciseReps, setExerciseReps] = useState<string>("");
  const [selectedExercise, setSelectedExercise] = useState<DropdownItem>();
  const [clearQuery, setClearQuery] = useState<boolean>(false);

  const { data: allExercisesData, isLoading: isLoadingAll } =
    useGetApiExerciseIdGetAllExercises(userId, {
      query: { enabled: !props.bodyPart },
    });

  const {
    mutate: getExercisesByBodyPart,
    data: exercisesByBodyPartData,
    isPending: isLoadingBodyPart,
  } = usePostApiExerciseIdGetExerciseByBodyPart();

  useEffect(() => {
    if (props.bodyPart) {
      getExercisesByBodyPart({
        id: userId,
        data: { bodyPart: props.bodyPart },
      });
    }
  }, [props.bodyPart]);

  const exercisesToSelect = useMemo(() => {
    let data: ExerciseForm[] = [];
    if (props.bodyPart) {
      if (exercisesByBodyPartData?.data) {
        data = (exercisesByBodyPartData.data as ExerciseResponseDto[]).map(
          (dto) => ({
            _id: dto._id || "",
            name: dto.name || "",
            user: dto.user || "",
            bodyPart: (dto.bodyPart?.name as BodyParts) || BodyParts.Chest,
            description: dto.description || "",
            image: dto.image || "",
          })
        );
      }
    } else {
      if (allExercisesData?.data) {
        data = (allExercisesData.data as ExerciseResponseDto[]).map(
          (dto) => ({
            _id: dto._id || "",
            name: dto.name || "",
            user: dto.user || "",
            bodyPart: (dto.bodyPart?.name as BodyParts) || BodyParts.Chest,
            description: dto.description || "",
            image: dto.image || "",
          })
        );
      }
    }
    return data.map((exercise: ExerciseForm) => ({
      label: exercise.name,
      value: exercise._id!,
    }));
  }, [exercisesByBodyPartData, allExercisesData, props.bodyPart]);

  const isLoading = isLoadingAll || isLoadingBodyPart;

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
    if (!selectedExercise || !numberOfSeries || !exerciseReps)
      return setErrors([Message.FieldRequired]);
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
            <View className="flex flex-row gap-1">
              <Text
                className="text-gray-200/80 font-light leading-4 text-base smallPhone:text-sm"
                style={{ fontFamily: "OpenSans_300Light" }}
              >
                Exercise:
              </Text>
              <Text className="text-redColor">*</Text>
            </View>

            <AutoComplete
              data={exercisesToSelect}
              onSelect={(item) => setSelectedExercise(item)}
              value={selectedExercise?.label || ""}
              onClearQuery={clearQuery ? clearAutoCompleteQuery : undefined}
            />
          </View>

          <View className="flex flex-col w-full" style={{ gap: 8 }}>
            <View className="flex flex-row gap-1">
              <Text
                className="text-gray-200/80 font-light leading-4 text-base smallPhone:text-sm"
                style={{ fontFamily: "OpenSans_300Light" }}
              >
                Series:
              </Text>
              <Text className="text-redColor">*</Text>
            </View>

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
            <View className="flex flex-row gap-1">
              <Text
                className="text-gray-200/80 font-light leading-4 text-base smallPhone:text-sm"
                style={{ fontFamily: "OpenSans_300Light" }}
              >
                Reps:
              </Text>
              <Text className="text-redColor">*</Text>
            </View>

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

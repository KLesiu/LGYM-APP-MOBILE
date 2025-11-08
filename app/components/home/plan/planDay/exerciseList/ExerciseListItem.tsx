import { View, Text, TextInput } from "react-native";
import { ExerciseForPlanDay } from "./../../../../../../interfaces/Exercise";
import CustomButton, { ButtonSize } from "./../../../../elements/CustomButton";
import IconDelete from "./../../../../../../img/icons/deleteIcon.svg";
import React, { useEffect, useState } from "react";
import { isIntValidator } from "../../../../../../helpers/numberValidator";
interface ExerciseListItemProps {
  exerciseListItem: ExerciseForPlanDay;
  removeExerciseFromList?: (item: ExerciseForPlanDay) => void;
  editExerciseFromList?: (item: ExerciseForPlanDay) => void;
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({
  exerciseListItem,
  removeExerciseFromList,
  editExerciseFromList,
}) => {
  const [seriesNumber, setSeriesNumber] = useState<string>(
    exerciseListItem.series.toString()
  );

  useEffect(() => {
    if (isIntValidator(seriesNumber)) {
      const updatedExercise: ExerciseForPlanDay = {
        ...exerciseListItem,
        series: parseInt(seriesNumber) || 0,
      };
      if (editExerciseFromList) {
        editExerciseFromList(updatedExercise);
      }
    }
  }, [seriesNumber]);

  const validator = (input: string): void => {
    if (input === "") {
      setSeriesNumber("");
      return;
    }
    const result = isIntValidator(input);
    if (result) {
      setSeriesNumber(input);
    }
  };

  const setReps = (input: string): void => {
    const updatedExercise: ExerciseForPlanDay = {
      ...exerciseListItem,
      reps: input,
    };
    if (editExerciseFromList) {
      editExerciseFromList(updatedExercise);
    }
  };

  return (
    <View
      className="w-full bg-fourthColor flex flex-row  p-2 rounded-lg justify-between items-center"
      style={{ gap: 20 }}
    >
      <View className="flex flex-col flex-1" style={{ gap: 4 }}>
        <Text
          style={{
            fontFamily: "OpenSans_400Regular",
          }}
          className="text-base  text-textColor"
        >
          {exerciseListItem.exercise.label}
        </Text>
        {editExerciseFromList ? (
          <View className="flex flex-row justify-between" style={{ gap: 16 }}>
            <View style={{ gap: 4 }} className="flex flex-col flex-1">
              <View className="flex flex-row gap-1">
                <Text
                  style={{ fontFamily: "OpenSans_300Light" }}
                  className="  text-textColor text-sm "
                >
                  Series:
                </Text>
                <Text className="text-redColor">*</Text>
              </View>

              <TextInput
                style={{
                  fontFamily: "OpenSans_400Regular",
                }}
                className="w-full px-2 py-4 bg-secondaryColor rounded-lg  text-textColor "
                keyboardType="numeric"
                value={seriesNumber}
                onChangeText={validator}
              />
            </View>
            <View style={{ gap: 4 }} className="flex flex-col flex-1">
              <View className="flex flex-row gap-1">
                <Text
                  style={{ fontFamily: "OpenSans_300Light" }}
                  className="text-textColor text-sm"
                >
                  Reps:
                </Text>
                <Text className="text-redColor">*</Text>
              </View>

              <TextInput
                style={{
                  fontFamily: "OpenSans_400Regular",
                }}
                className="w-full px-2 py-4 bg-secondaryColor rounded-lg  text-textColor "
                value={exerciseListItem.reps}
                onChangeText={setReps}
              />
            </View>
          </View>
        ) : (
          <View className="flex flex-row" style={{ gap: 4 }}>
            <Text
              style={{
                fontFamily: "OpenSans_400Regular",
              }}
              className="text-sm smallPhone:text-xs  text-fifthColor"
            >
              Series: {exerciseListItem.series}
            </Text>
            <View className="flex flex-row" style={{ gap: 16 }}>
              <Text
                style={{
                  fontFamily: "OpenSans_400Regular",
                }}
                className="text-sm smallPhone:text-xs  text-fifthColor"
              >
                Reps: {exerciseListItem.reps}
              </Text>
            </View>
          </View>
        )}
      </View>
      {removeExerciseFromList && (
        <View className="flex justify-center items-center  w-12  h-12 smallPhone:w-10 smallPhone:h-10 bg-secondaryColor70 rounded-lg">
          <CustomButton
            buttonStyleSize={ButtonSize.small}
            onPress={() => removeExerciseFromList(exerciseListItem)}
            customSlots={[<IconDelete />]}
          />
        </View>
      )}
    </View>
  );
};

export default ExerciseListItem;

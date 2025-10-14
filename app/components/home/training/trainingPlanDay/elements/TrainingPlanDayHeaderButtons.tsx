import { View } from "react-native";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../../../elements/CustomButton";
import React from "react";

interface TrainingPlanDayHeaderButtonsProps {
    showExerciseForm: () => void
}

const TrainingPlanDayHeaderButtons: React.FC<
  TrainingPlanDayHeaderButtonsProps
> = ({showExerciseForm}) => {
  return (
    <View className="flex flex-row justify-between">
      <CustomButton
        onPress={showExerciseForm}
        buttonStyleType={ButtonStyle.success}
        text="Add Exercise"
      />
    </View>
  );
};

export default TrainingPlanDayHeaderButtons;

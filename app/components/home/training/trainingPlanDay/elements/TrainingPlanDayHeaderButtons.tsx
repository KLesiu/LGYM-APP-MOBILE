import { View } from "react-native";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../../../elements/CustomButton";
import React from "react";
import { useTranslation } from "react-i18next";

interface TrainingPlanDayHeaderButtonsProps {
    showExerciseForm: () => void
}

const TrainingPlanDayHeaderButtons: React.FC<
  TrainingPlanDayHeaderButtonsProps
> = ({showExerciseForm}) => {
  const { t } = useTranslation();
  return (
    <View className="flex flex-row justify-between">
      <CustomButton
        onPress={showExerciseForm}
        buttonStyleType={ButtonStyle.success}
        text={t('training.addExercise')}
      />
    </View>
  );
};

export default TrainingPlanDayHeaderButtons;

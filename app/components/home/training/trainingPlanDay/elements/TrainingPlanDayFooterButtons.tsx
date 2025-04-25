import React, { useState } from "react";
import { View, Pressable, Text, Switch as SwitchComp } from "react-native";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../../../elements/CustomButton";

interface TrainingPlanDayFooterButtonsProps {
  hideAndDeleteTrainingSession: () => void;
  sendTraining: (trainingSessionScores: any) => void;
}

const TrainingPlanDayFooterButtons: React.FC<
  TrainingPlanDayFooterButtonsProps
> = ({ hideAndDeleteTrainingSession, sendTraining }) => {
  const { trainingSessionScores } = useTrainingPlanDay();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View className="w-full flex flex-row justify-between px-5" style={{ gap: 8 }}>
      <CustomButton
        onPress={hideAndDeleteTrainingSession}
        disabled={!isEnabled}
        buttonStyleSize={ButtonSize.regular}
        buttonStyleType={ButtonStyle.grey}
        text="Delete"
        customClasses="flex-1"
      ></CustomButton>
      <SwitchComp onValueChange={toggleSwitch} value={isEnabled} />
      <CustomButton
        onPress={() => sendTraining(trainingSessionScores)}
        disabled={!isEnabled}
        buttonStyleSize={ButtonSize.regular}
        buttonStyleType={ButtonStyle.success}
        text="Add"
        customClasses="flex-1"
      ></CustomButton>
    </View>
  );
};

export default TrainingPlanDayFooterButtons;

import React, { useState } from "react";
import { View, Pressable, Text, Switch as SwitchComp } from "react-native";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../../../elements/CustomButton";
import { TrainingSessionScores } from "../../../../../../interfaces/Training";

interface TrainingPlanDayFooterButtonsProps {
  hideAndDeleteTrainingSession: () => void;
  sendTraining: (trainingSessionScores: any) => Promise<void>;
}

const TrainingPlanDayFooterButtons: React.FC<
  TrainingPlanDayFooterButtonsProps
> = ({ hideAndDeleteTrainingSession, sendTraining }) => {
  const { trainingSessionScores } = useTrainingPlanDay();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const triggerSendTraining = async (
    trainingSessionScores: TrainingSessionScores[]
  ) => {
    setIsButtonLoading(true);
    await sendTraining(trainingSessionScores);
    setIsButtonLoading(false);
  };

  return (
    <View
      className="w-full flex flex-row justify-between px-5"
      style={{ gap: 8 }}
    >
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
        onPress={() => triggerSendTraining(trainingSessionScores)}
        disabled={!isEnabled}
        isLoading={isButtonLoading}
        buttonStyleSize={ButtonSize.regular}
        buttonStyleType={ButtonStyle.success}
        text="Add"
        customClasses="flex-1"
      ></CustomButton>
    </View>
  );
};

export default TrainingPlanDayFooterButtons;

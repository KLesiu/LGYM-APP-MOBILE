import { View } from "react-native";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../../../elements/CustomButton";

interface TrainingPlanDayHeaderButtonsProps {
    showExerciseForm: () => void
}

const TrainingPlanDayHeaderButtons: React.FC<
  TrainingPlanDayHeaderButtonsProps
> = ({showExerciseForm}) => {
  return (
    <View className="flex flex-row justify-between px-5">
      <CustomButton
        onPress={showExerciseForm}
        buttonStyleType={ButtonStyle.success}
        textSize="smallPhone:text-sm text-base"
        text="Add Exercise"
      />
    </View>
  );
};

export default TrainingPlanDayHeaderButtons;

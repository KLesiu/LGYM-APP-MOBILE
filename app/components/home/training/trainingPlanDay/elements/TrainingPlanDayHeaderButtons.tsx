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
        buttonStyleSize={ButtonSize.regular}
        buttonStyleType={ButtonStyle.success}
        textSize="text-base"
        text="Add Exercise"
      />
    </View>
  );
};

export default TrainingPlanDayHeaderButtons;

import { View, Text } from "react-native";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";

interface TrainingPlanDayExerciseHeaderProps {}

const TrainingPlanDayExerciseHeader: React.FC<
  TrainingPlanDayExerciseHeaderProps
> = () => {
  const { currentExercise } = useTrainingPlanDay();
  return (
    <View className="flex flex-col px-5">
      <Text
        className="text-3xl text-white  font-bold "
        style={{
          fontFamily: "OpenSans_700Bold",
        }}
      >
        {currentExercise?.exercise.name}
      </Text>
      <Text
        className="text-base text-white "
        style={{
          fontFamily: "OpenSans_400Regular",
        }}
      >
        {currentExercise?.series}x{currentExercise?.reps}
      </Text>
    </View>
  );
};

export default TrainingPlanDayExerciseHeader;

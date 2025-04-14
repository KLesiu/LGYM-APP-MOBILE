import { View, Text } from "react-native";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";

interface TrainingPlanDayExerciseLastScoresInfoProps {}

const TrainingPlanDayExerciseLastScoresInfo: React.FC<
  TrainingPlanDayExerciseLastScoresInfoProps
> = () => {
  const { gymName } = useTrainingPlanDay();
  
  return (
    <View className="px-5 flex justify-start w-full ">
      <Text
        className="text-sm text-white "
        style={{
          fontFamily: "OpenSans_400Regular",
        }}
      >
        Last training scores at:
      </Text>
    </View>
  );
};

export default TrainingPlanDayExerciseLastScoresInfo;

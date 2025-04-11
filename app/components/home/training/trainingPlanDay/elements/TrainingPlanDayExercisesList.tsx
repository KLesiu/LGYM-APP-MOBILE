import { View, Text } from "react-native";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import TrainingPlanDayExerciseListCard from "./TrainingPlanDayExerciseListCard";
import { ScrollView } from "react-native";

interface TrainingPlanDayExercisesListProps {}

const TrainingPlanDayExercisesList: React.FC<
  TrainingPlanDayExercisesListProps
> = () => {
  const { exercisesInPlanList } = useTrainingPlanDay();
  return (
    <View className="flex flex-col w-full px-5" style={{ gap: 8 }}>
      <Text
        className="text-sm text-white "
        style={{
          fontFamily: "OpenSans_400Regular",
        }}
      >
        Exercise list
      </Text>
      <ScrollView
        className="w-full max-h-52"
        contentContainerStyle={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {exercisesInPlanList?.map((exercise, index) => (
          <TrainingPlanDayExerciseListCard
            key={index}
            exercise={exercise}
            isDone={false}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default TrainingPlanDayExercisesList;

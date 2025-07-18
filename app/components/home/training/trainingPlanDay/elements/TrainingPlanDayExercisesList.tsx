import { View, Text } from "react-native";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import TrainingPlanDayExerciseListCard from "./TrainingPlanDayExerciseListCard";
import { PlanDayExercisesFormVm } from "../../../../../../interfaces/PlanDay";

interface TrainingPlanDayExercisesListProps {
  deleteExerciseFromPlan: (exerciseId: string | undefined) => Promise<
    | {
        exercises: PlanDayExercisesFormVm[];
        _id: string;
        name: string;
      }
    | undefined
  >;
}

const TrainingPlanDayExercisesList: React.FC<
  TrainingPlanDayExercisesListProps
> = ({ deleteExerciseFromPlan }) => {
  const { exercisesInPlanList } = useTrainingPlanDay();
  return (
    <View className="flex flex-col w-full px-5 flex-1" style={{ gap: 8 }}>
      <Text
        className=" text-sm smallPhone:text-xs text-white "
        style={{
          fontFamily: "OpenSans_400Regular",
        }}
      >
        Exercise list 
        
      </Text>
      <View className="w-full flex-1" style={{ gap: 8 }}>
        {exercisesInPlanList?.map((exercise, index) => (
          <TrainingPlanDayExerciseListCard
            key={index}
            exercise={exercise}
            deleteExerciseFromPlan={deleteExerciseFromPlan}
          />
        ))}
      </View>
    </View>
  );
};

export default TrainingPlanDayExercisesList;

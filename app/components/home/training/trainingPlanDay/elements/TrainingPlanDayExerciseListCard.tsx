import { View, Text } from "react-native";
import { PlanDayExercisesFormVm } from "../../../../../../interfaces/PlanDay";
import Checkbox from "../../../../elements/Checkbox";
import RemoveIcon from "./../../../../../../img/icons/deleteIcon.svg";

interface TrainingPlanDayExerciseListCardProps {
  exercise: PlanDayExercisesFormVm;
  isDone: boolean;
  key: number;
}

const TrainingPlanDayExerciseListCard: React.FC<
  TrainingPlanDayExerciseListCardProps
> = ({ key, exercise, isDone }) => {
  return (
    <View
      className="bg-secondaryColor flex flex-row items-center justify-between w-full p-2  rounded-lg"
      key={key}
    >
      <View className="flex flex-row items-center" style={{ gap: 20 }}>
        <Checkbox value={true} />
        <View>
          <Text
            className="text-base text-white "
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            {exercise.exercise.name}
          </Text>
          <Text
            className="text-sm text-white "
            style={{
              fontFamily: "OpenSans_300Light",
            }}
          >
            Series: {exercise.series} Reps: {exercise.reps}
          </Text>
        </View>
      </View>
      <View className="w-12 h-12 flex justify-center items-center">
        <RemoveIcon width={20} height={20} />
      </View>
    </View>
  );
};

export default TrainingPlanDayExerciseListCard;

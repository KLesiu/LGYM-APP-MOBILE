import { View, Text, Pressable } from "react-native";
import { PlanDayExercisesFormVm } from "../../../../../../interfaces/PlanDay";
import Checkbox from "../../../../elements/Checkbox";
import RemoveIcon from "./../../../../../../img/icons/deleteIcon.svg";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import { useEffect, useState } from "react";
import { TrainingSessionScores } from "../../../../../../interfaces/Training";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../../../elements/CustomButton";

interface TrainingPlanDayExerciseListCardProps {
  exercise: PlanDayExercisesFormVm;
  deleteExerciseFromPlan: (exerciseId: string | undefined) => Promise<
    | {
        exercises: PlanDayExercisesFormVm[];
        _id: string;
        name: string;
      }
    | undefined
  >;
}

const TrainingPlanDayExerciseListCard: React.FC<
  TrainingPlanDayExerciseListCardProps
> = ({ exercise, deleteExerciseFromPlan }) => {
  const { setCurrentExercise, trainingSessionScores,scrollToTop } = useTrainingPlanDay();
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    checkIsExerciseDone();
  }, [trainingSessionScores]);

  const checkIsExerciseDone = () => {
    const foundExerciseSeries = trainingSessionScores.filter(
      (exerciseInSession) =>
        exerciseInSession.exercise._id === exercise.exercise._id
    );
    let isExerciseDone = true;
    for (let index = 0; index < foundExerciseSeries.length; index++) {
      const exerciseInSession = foundExerciseSeries[index];
      if (!checkIsExerciseHaveScore(exerciseInSession)) {
        isExerciseDone = false;
      }
    }
    setIsDone(isExerciseDone);
  };

  const checkIsExerciseHaveScore = (
    trainingSessionScore: TrainingSessionScores
  ) => {
    if (trainingSessionScore.reps && trainingSessionScore.weight) {
      return true;
    }
    return false;
  };

  const changeCurrentExercise = () => {
    scrollToTop();
    setCurrentExercise(exercise);
  }

  return (
    <Pressable
      onPress={changeCurrentExercise}
      className="bg-secondaryColor flex flex-row items-center justify-between w-full  p-2 smallPhone:p-1  rounded-lg"
    >
      <View className="flex flex-row items-center flex-1" style={{ gap: 20 }}>
        <Checkbox value={isDone} />
        <View className="flex flex-col flex-1">
          <Text
            className="text-base smallPhone:text-sm text-white "
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            {exercise.exercise.name}
          </Text>
          <Text
            className="text-sm smallPhone:text-xs text-white "
            style={{
              fontFamily: "OpenSans_300Light",
            }}
          >
            Series: {exercise.series} Reps: {exercise.reps}
          </Text>
        </View>
      </View>
      <View className="w-12 h-12 flex justify-center items-center">
        <CustomButton
          onPress={() => deleteExerciseFromPlan(exercise.exercise._id)}
          buttonStyleSize={ButtonSize.none}
          buttonStyleType={ButtonStyle.none}
          customSlots={[<RemoveIcon width={20} height={20} />]}
        />
      </View>
    </Pressable>
  );
};

export default TrainingPlanDayExerciseListCard;

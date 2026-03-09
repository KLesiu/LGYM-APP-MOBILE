import { View, Text } from "react-native";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import TrainingPlanDayExerciseListCard from "./TrainingPlanDayExerciseListCard";
import { PlanDayExercisesFormVm } from "../../../../../../types/models";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

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
  const { t } = useTranslation();
  const { exercisesInPlanList, trainingSessionScores } = useTrainingPlanDay();

  const completedExercisesCount = useMemo(() => {
    if (!exercisesInPlanList?.length) {
      return 0;
    }

    return exercisesInPlanList.filter((exercise) => {
      const scoresForExercise = trainingSessionScores.filter(
        (score) => score.exercise._id === exercise.exercise._id
      );

      if (!scoresForExercise.length) {
        return false;
      }

      return scoresForExercise.every(
        (score) => !!score.reps && !!score.weight
      );
    }).length;
  }, [exercisesInPlanList, trainingSessionScores]);

  const totalExercisesCount = exercisesInPlanList?.length ?? 0;

  return (
    <View className="flex flex-col w-full px-5 flex-1" style={{ gap: 8 }}>
      <View className="flex flex-row justify-between items-center" style={{ gap: 12 }}>
        <Text
          className=" text-sm smallPhone:text-xs text-textColor "
          style={{
            fontFamily: "OpenSans_400Regular",
          }}
        >
          {t('training.exerciseList')}
        </Text>
        <Text
          className="text-sm smallPhone:text-xs text-primaryColor"
          style={{
            fontFamily: "OpenSans_700Bold",
          }}
        >
          {completedExercisesCount}/{totalExercisesCount}
        </Text>
      </View>
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

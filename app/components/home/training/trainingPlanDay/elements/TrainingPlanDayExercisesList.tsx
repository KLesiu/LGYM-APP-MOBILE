import { View, Text } from "react-native";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import TrainingPlanDayExerciseListCard from "./TrainingPlanDayExerciseListCard";
import { PlanDayExercisesFormVm } from "../../../../../../interfaces/PlanDay";
import React from "react";
import { useTranslation } from "react-i18next";

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
  const { exercisesInPlanList } = useTrainingPlanDay();
  return (
    <View className="flex flex-col w-full px-5 flex-1" style={{ gap: 8 }}>
      <Text
        className=" text-sm smallPhone:text-xs text-textColor "
        style={{
          fontFamily: "OpenSans_400Regular",
        }}
      >
        {t('training.exerciseList')}
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

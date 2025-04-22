import { View, Text } from "react-native";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import { useEffect, useMemo, useState } from "react";
import { useHomeContext } from "../../../HomeContext";
import { LastExerciseScoresWithGym } from "../../../../../../interfaces/Exercise";

interface TrainingPlanDayExerciseLastScoresInfoProps {}

const TrainingPlanDayExerciseLastScoresInfo: React.FC<
  TrainingPlanDayExerciseLastScoresInfoProps
> = () => {
  const { gym, isGymFilterActive, currentExercise } = useTrainingPlanDay();
  const { apiURL, userId } = useHomeContext();
  const [lastExerciseScoresText, setLastExerciseScoresText] =
    useState<string>();

  useEffect(() => {
    getLastExerciseScores();
  }, [isGymFilterActive,currentExercise]);

  const getLastExerciseScores = async () => {
    const response = await fetch(
      `${apiURL}/api/exercise/${userId}/getLastExerciseScores`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gym: isGymFilterActive ? gym?._id : undefined,
          series: currentExercise?.series,
          reps: currentExercise?.reps,
          exerciseId: currentExercise?.exercise._id,
        }),
      }
    );
    const result = await response.json() as LastExerciseScoresWithGym;
    setLastExerciseScoresText(createLastExerciseScoresText(result));
  };

  const createLastExerciseScoresText = (
    lastExerciseScores: LastExerciseScoresWithGym
  ) => {
    const { seriesScores } = lastExerciseScores;

    const text = seriesScores
    .filter((seriesScore) => 
      seriesScore.score && 
      seriesScore.score.reps !== undefined &&
      seriesScore.score.weight !== undefined
    )
    .map((seriesScore) => {
      const { reps, weight, unit, gymName } = seriesScore.score!;
      const gymText = !isGymFilterActive ? ` (${gymName})` : '';
      return `${reps}x${weight}${unit}${gymText}`;
    })
    .join(", ");
    return text;
  };

  const text = useMemo(() => {
    if (isGymFilterActive) {
      return (
        <View className="flex flex-row gap-1">
          <Text
            className="text-sm text-white "
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            {`Last training scores in`}
          </Text>
          <Text
            className="text-sm text-primaryColor"
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            {`${gym?.name}`}:
          </Text>
        </View>
      );
    }
    return (
      <Text
        className="text-sm text-white "
        style={{
          fontFamily: "OpenSans_400Regular",
        }}
      >
        Last training scores:
      </Text>
    );
  }, [isGymFilterActive]);

  return (
    <View className="px-5 flex flex-col justify-start w-full ">
      {text}
      <Text
        className="text-sm text-white "
        style={{
          fontFamily: "OpenSans_400Regular",
        }}
      >
        {lastExerciseScoresText}
      </Text>
    </View>
  );
};

export default TrainingPlanDayExerciseLastScoresInfo;

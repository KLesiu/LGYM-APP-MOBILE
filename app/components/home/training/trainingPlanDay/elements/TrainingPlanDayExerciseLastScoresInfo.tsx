import { View, Text } from "react-native";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import { useEffect, useMemo, useState } from "react";
import { useHomeContext } from "../../../HomeContext";
import { LastExerciseScoresWithGym } from "../../../../../../interfaces/Exercise";
import { useAppContext } from "../../../../../AppContext";
import ViewLoading from "../../../../elements/ViewLoading";
import React from "react";

interface TrainingPlanDayExerciseLastScoresInfoProps {}

const TrainingPlanDayExerciseLastScoresInfo: React.FC<
  TrainingPlanDayExerciseLastScoresInfoProps
> = () => {
  const {
    gym,
    isGymFilterActive,
    currentExercise,
    lastExerciseScoresWithGym,
    setLastExerciseScoresWithGym,
  } = useTrainingPlanDay();
  const {  userId } = useHomeContext();
  const { postAPI } = useAppContext();
  const [lastExerciseScoresText, setLastExerciseScoresText] =
    useState<string>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  useEffect(() => {
    getLastExerciseScores();
  }, [isGymFilterActive, currentExercise]);

  const getLastExerciseScores = async () => {
    setViewLoading(true);
    await postAPI(
      `/exercise/${userId}/getLastExerciseScores`,
      (result: LastExerciseScoresWithGym) => {
        if (isGymFilterActive && !checkIsExerciseScoresExistsInState(result)) {
          const newLastExerciseScoresWithGym = [
            ...lastExerciseScoresWithGym,
            result,
          ];
          setLastExerciseScoresWithGym(newLastExerciseScoresWithGym);
        }
        setLastExerciseScoresText(createLastExerciseScoresText(result));
      },
      {
        gym: isGymFilterActive ? gym?._id : undefined,
        series: currentExercise?.series,
        reps: currentExercise?.reps,
        exerciseId: currentExercise?.exercise._id,
        exerciseName: currentExercise?.exercise.name,
      }
    );
    setViewLoading(false);
  };

  const checkIsExerciseScoresExistsInState = (
    lastExerciseScoresWithGymArg: LastExerciseScoresWithGym
  ) => {
    const { seriesScores, exerciseId } = lastExerciseScoresWithGymArg;
    let isExist = false;
    lastExerciseScoresWithGym.forEach((lastExerciseScores) => {
      if (
        lastExerciseScores.exerciseId === exerciseId &&
        lastExerciseScores.seriesScores.length === seriesScores.length
      ) {
        isExist = true;
      }
    });
    return isExist;
  };

  const createLastExerciseScoresText = (
    lastExerciseScores: LastExerciseScoresWithGym
  ) => {
    const { seriesScores } = lastExerciseScores;

    const text = seriesScores
      .filter(
        (seriesScore) =>
          seriesScore.score &&
          seriesScore.score.reps !== undefined &&
          seriesScore.score.weight !== undefined
      )
      .map((seriesScore) => {
        const { reps, weight, unit, gymName } = seriesScore.score!;
        const gymText = !isGymFilterActive ? ` (${gymName})` : "";
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
            className="text-sm smallPhone:text-xs text-textColor "
            style={{
              fontFamily: "OpenSans_400Regular",
            }}
          >
            {`Last training scores in`}
          </Text>
          <Text
            className="text-sm smallPhone:text-xs text-primaryColor"
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
        className=" text-sm smallPhone:text-xs text-textColor "
        style={{
          fontFamily: "OpenSans_400Regular",
        }}
      >
        Last training scores:
      </Text>
    );
  }, [isGymFilterActive]);

  return (
    viewLoading ? <ViewLoading /> :  <View className="px-5 flex flex-col justify-start w-full ">
      {text}
      <Text
        className=" text-sm smallPhone:text-xs text-textColor "
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

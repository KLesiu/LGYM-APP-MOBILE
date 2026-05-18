import { View, Text } from 'react-native';
import { useTrainingPlanDay } from '../TrainingPlanDayContext';
import { useEffect, useMemo, useState } from 'react';
import { useHomeContext } from '../../../HomeContext';
import { LastExerciseScoresResponseDto } from '../../../../../../api/generated/model';
import ViewLoading from '../../../../elements/ViewLoading';
import React from 'react';
import { usePostApiExerciseIdGetLastExerciseScores } from '../../../../../../api/generated/exercise/exercise';
import { useTranslation } from 'react-i18next';
import { EnumLookupDto } from '../../../../../../api/generated/model';

interface TrainingPlanDayExerciseLastScoresInfoProps {}

const TrainingPlanDayExerciseLastScoresInfo: React.FC<
  TrainingPlanDayExerciseLastScoresInfoProps
> = () => {
  const { t } = useTranslation();
  const {
    gym,
    isGymFilterActive,
    currentExercise,
    lastExerciseScoresWithGym,
    setLastExerciseScoresWithGym,
  } = useTrainingPlanDay();
  const { userId } = useHomeContext();
  const [lastExerciseScoresText, setLastExerciseScoresText] = useState<string>();

  const { mutate: getLastExerciseScores, isPending: viewLoading } =
    usePostApiExerciseIdGetLastExerciseScores();

  const createLastExerciseScoresText = (lastExerciseScores: LastExerciseScoresResponseDto) => {
    const seriesScores = lastExerciseScores.seriesScores ?? [];

    return seriesScores
      .filter(
        (seriesScore) =>
          seriesScore.score &&
          seriesScore.score.reps !== undefined &&
          seriesScore.score.weight !== undefined,
      )
      .map((seriesScore) => {
        const { reps, weight, unit, gymName } = seriesScore.score!;
        const gymText = isGymFilterActive ? '' : ` (${gymName})`;
        return `${reps}x${weight}${(unit as EnumLookupDto).displayName}${gymText}`;
      })
      .join(', ');
  };

  const checkIsExerciseScoresExistsInState = (
    lastExerciseScoresWithGymArg: LastExerciseScoresResponseDto,
  ) => {
    const { seriesScores, exerciseId } = lastExerciseScoresWithGymArg;
    const incomingSeriesScores = seriesScores ?? [];
    let isExist = false;
    lastExerciseScoresWithGym.forEach((lastExerciseScores) => {
      const existingSeriesScores = lastExerciseScores.seriesScores ?? [];
      if (
        lastExerciseScores.exerciseId === exerciseId &&
        existingSeriesScores.length === incomingSeriesScores.length
      ) {
        isExist = true;
      }
    });
    return isExist;
  };

  useEffect(() => {
    if (!userId || !currentExercise) return;

    getLastExerciseScores(
      {
        id: userId,
        data: {
          ...(isGymFilterActive && gym?._id ? { gym: gym._id } : {}),
          series: currentExercise?.series,
          ...(currentExercise?.exercise._id ? { exerciseId: currentExercise.exercise._id } : {}),
          ...(currentExercise?.exercise.name ? { exerciseName: currentExercise.exercise.name } : {}),
        },
      },
      {
        onSuccess: (result) => {
          if (!result || typeof result !== 'object' || !('data' in result)) {
            return;
          }

          const data = result.data as LastExerciseScoresResponseDto;
          if (isGymFilterActive && !checkIsExerciseScoresExistsInState(data)) {
            const newLastExerciseScoresWithGym = [...lastExerciseScoresWithGym, data];
            setLastExerciseScoresWithGym(newLastExerciseScoresWithGym);
          }
          setLastExerciseScoresText(createLastExerciseScoresText(data));
        },
      },
    );
  }, [isGymFilterActive, currentExercise, userId]);

  const text = useMemo(() => {
    if (isGymFilterActive) {
      return (
        <View className="flex flex-row gap-1">
          <Text
            className="text-sm smallPhone:text-xs text-textColor "
            style={{
              fontFamily: 'OpenSans_400Regular',
            }}
          >
            {t('training.lastScoresIn')}
          </Text>
          <Text
            className="text-sm smallPhone:text-xs text-primaryColor"
            style={{
              fontFamily: 'OpenSans_400Regular',
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
          fontFamily: 'OpenSans_400Regular',
        }}
      >
        {t('training.lastScores')}
      </Text>
    );
  }, [isGymFilterActive, t]);

  return viewLoading ? (
    <ViewLoading />
  ) : (
    <View className="px-5 flex flex-col justify-start w-full ">
      {text}
      <Text
        className=" text-sm smallPhone:text-xs text-textColor "
        style={{
          fontFamily: 'OpenSans_400Regular',
        }}
      >
        {lastExerciseScoresText}
      </Text>
    </View>
  );
};

export default TrainingPlanDayExerciseLastScoresInfo;

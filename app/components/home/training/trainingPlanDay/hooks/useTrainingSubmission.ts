import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import type { GymForm, TrainingSessionScores, TrainingSummary } from '../../../../../../types/models';
import {
  ExerciseScoresTrainingFormDtoUnit,
  type ExerciseScoresTrainingFormDto,
  type RankDto,
  type TrainingFormDto,
  type UserInfoDto,
} from '../../../../../../api/generated/model';
import {
  getApiCheckToken,
  getGetApiGetUsersRankingQueryKey,
} from '../../../../../../api/generated/user/user';
import {
  getGetApiIdGetLastTrainingQueryKey,
  usePostApiIdAddTraining,
} from '../../../../../../api/generated/training/training';
import {
  getGetApiMainRecordsIdGetLastMainRecordsQueryKey,
  getGetApiMainRecordsIdGetMainRecordsHistoryQueryKey,
} from '../../../../../../api/generated/main-records/main-records';
import { TrainingViewSteps } from '../../../../../../enums/TrainingView';
import toastService from '../../../../../services/toastService';
import { getErrorMessage, sanitize } from '../../../../../../lib/domain/errorHandler';

type UseTrainingSubmissionParams = {
  dayId: string;
  gym: GymForm | undefined;
  userId: string | undefined;
  user: UserInfoDto | null | undefined;
  setUser: (user: UserInfoDto | null) => void;
  setTrainingSummary: (trainingSummary: TrainingSummary) => void;
  setStep: (step: number) => void;
  hideAndDeleteTrainingSession: () => Promise<void>;
};

const getRankName = (rank: unknown, unknownLabel: string): string => {
  if (typeof rank === 'string') {
    return rank;
  }

  if (rank && typeof rank === 'object') {
    const rankName = (rank as RankDto).name;
    if (typeof rankName === 'string' && rankName.length > 0) {
      return rankName;
    }
  }

  return unknownLabel;
};

const getRankNeedElo = (rank: unknown): number => {
  if (rank && typeof rank === 'object') {
    const rankNeedElo = (rank as RankDto).needElo;
    if (typeof rankNeedElo === 'number') {
      return rankNeedElo;
    }
  }

  return 0;
};

const hasRankName = (rank: unknown): boolean => {
  if (typeof rank === 'string') {
    return rank.length > 0;
  }

  if (rank && typeof rank === 'object') {
    const rankName = (rank as RankDto).name;
    return typeof rankName === 'string' && rankName.length > 0;
  }

  return false;
};

const mapUnitValue = (unit: unknown, unknownLabel: string): string => {
  if (typeof unit === 'string') {
    return unit;
  }

  if (unit && typeof unit === 'object') {
    const unitName = (unit as { name?: unknown }).name;
    if (typeof unitName === 'string' && unitName.length > 0) {
      return unitName;
    }
  }

  return unknownLabel;
};

const mapTrainingSummary = (source: Record<string, unknown>, unknownLabel: string): TrainingSummary => {
  const comparisonSource = Array.isArray(source.comparison) ? source.comparison : [];
  const mappedComparison = comparisonSource.map((comp) => {
    const compRecord = (comp ?? {}) as Record<string, unknown>;
    const seriesSource = Array.isArray(compRecord.seriesComparisons)
      ? compRecord.seriesComparisons
      : [];

    return {
      ...compRecord,
      seriesComparisons: seriesSource.map((series) => {
        const seriesRecord = (series ?? {}) as Record<string, unknown>;
        const currentResult = seriesRecord.currentResult as Record<string, unknown> | undefined;
        const previousResult = seriesRecord.previousResult as
          | Record<string, unknown>
          | undefined
          | null;

        return {
          ...seriesRecord,
          currentResult: currentResult
            ? {
                ...currentResult,
                unit: mapUnitValue(currentResult.unit, unknownLabel),
              }
            : currentResult,
          previousResult: previousResult
            ? {
                ...previousResult,
                unit: mapUnitValue(previousResult.unit, unknownLabel),
              }
            : previousResult,
        };
      }),
    };
  }) as TrainingSummary['comparison'];

  return {
    comparison: mappedComparison,
    gainElo: typeof source.gainElo === 'number' ? source.gainElo : 0,
    userOldElo: typeof source.userOldElo === 'number' ? source.userOldElo : 0,
    profileRank: {
      name: getRankName(source.profileRank, unknownLabel),
      needElo: getRankNeedElo(source.profileRank),
    },
    nextRank: source.nextRank
      ? {
          name: getRankName(source.nextRank, unknownLabel),
          needElo: getRankNeedElo(source.nextRank),
        }
      : null,
    msg:
      typeof source.msg === 'string'
        ? (source.msg as TrainingSummary['msg'])
        : ('' as TrainingSummary['msg']),
  };
};

export const useTrainingSubmission = ({
  dayId,
  gym,
  userId,
  user,
  setUser,
  setTrainingSummary,
  setStep,
  hideAndDeleteTrainingSession,
}: UseTrainingSubmissionParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutateAsync: addTrainingMutation } = usePostApiIdAddTraining();

  const syncCurrentUserAfterTraining = useCallback(
    async (
      fallbackSummary: TrainingSummary,
      trainingSummaryData: Record<string, unknown>,
      hasUserOldEloFromApi: boolean,
    ) => {
      try {
        const response = await getApiCheckToken();
        if (response?.data && 'name' in response.data) {
          setUser(response.data);
          return;
        }
      } catch (error) {
        if (__DEV__) {
          const sanitizedError = sanitize(error);
          if (sanitizedError.devDetails) {
            console.warn('[TrainingPlanDay] failed to refresh user', sanitizedError.devDetails);
          }
        }
      }

      if (!user) {
        return;
      }

      const currentElo = hasUserOldEloFromApi ? Number(trainingSummaryData.userOldElo) : Number(user.elo ?? 0);
      const gainElo = Number(fallbackSummary.gainElo ?? 0);
      const updatedElo = currentElo + gainElo;
      const hasProfileRankFromApi = hasRankName(trainingSummaryData.profileRank);
      const hasNextRankFromApi = Object.hasOwn(trainingSummaryData, 'nextRank');

      const fallbackUser = {
        ...user,
        elo: updatedElo,
        ...(hasProfileRankFromApi && fallbackSummary.profileRank?.name
          ? { profileRank: fallbackSummary.profileRank.name }
          : {}),
        ...(hasNextRankFromApi && fallbackSummary.nextRank ? { nextRank: fallbackSummary.nextRank } : {}),
      };

      setUser(fallbackUser);
    },
    [setUser, user],
  );

  const addTraining = useCallback(
    async (exercises: TrainingSessionScores[]) => {
      const type = dayId;
      const gymId = gym?._id;

      if (!userId || !type || !gymId) {
        toastService.showError(t('training.missingTrainingContext'), t('training.failedToAdd'));
        return;
      }

      const createdAt = new Date().toISOString();
      const training: ExerciseScoresTrainingFormDto[] = exercises.map((ele: TrainingSessionScores) => ({
        exercise: `${ele.exercise._id}`,
        reps: Number.parseFloat(ele.reps),
        series: ele.series,
        weight: Number.parseFloat(ele.weight),
        unit: ExerciseScoresTrainingFormDtoUnit.Kilograms,
      }));

      const body: TrainingFormDto = {
        type,
        createdAt,
        exercises: training,
        gym: gymId,
      };

      try {
        const result = await addTrainingMutation({ id: userId, data: body });
        if (result?.data) {
          toastService.hide();
          await hideAndDeleteTrainingSession();
          setStep(TrainingViewSteps.TRAINING_SUMMARY);
          const trainingSummaryData = result.data as Record<string, unknown>;
          const hasUserOldEloFromApi =
            Object.hasOwn(trainingSummaryData, 'userOldElo') &&
            typeof trainingSummaryData.userOldElo === 'number';
          const mappedSummary = mapTrainingSummary(trainingSummaryData, t('common.unknown'));
          const normalizedSummary: TrainingSummary = {
            ...mappedSummary,
            userOldElo: hasUserOldEloFromApi ? mappedSummary.userOldElo : Number(user?.elo ?? 0),
          };
          setTrainingSummary(normalizedSummary);

          const invalidatePromises = [
            queryClient.invalidateQueries({ queryKey: getGetApiGetUsersRankingQueryKey() }),
          ];

          if (userId) {
            invalidatePromises.push(
              queryClient.invalidateQueries({ queryKey: getGetApiIdGetLastTrainingQueryKey(userId) }),
              queryClient.invalidateQueries({ queryKey: getGetApiMainRecordsIdGetLastMainRecordsQueryKey(userId) }),
              queryClient.invalidateQueries({ queryKey: getGetApiMainRecordsIdGetMainRecordsHistoryQueryKey(userId) }),
            );
          }

          await Promise.all(invalidatePromises);

          await syncCurrentUserAfterTraining(
            normalizedSummary,
            trainingSummaryData,
            hasUserOldEloFromApi,
          );
        }
      } catch (error) {
        const sanitizedError = sanitize(error);
        if (__DEV__ && sanitizedError.devDetails) {
          console.warn('[TrainingPlanDay] failed to add training', sanitizedError.devDetails);
        }
        const errorReason = getErrorMessage(error, t('common.tryAgain'));
        toastService.showError(errorReason, t('training.failedToAdd'));
      }
    },
    [
      addTrainingMutation,
      dayId,
      gym,
      hideAndDeleteTrainingSession,
      queryClient,
      setStep,
      setTrainingSummary,
      syncCurrentUserAfterTraining,
      t,
      user?.elo,
      user,
      userId,
    ],
  );

  const sendTraining = useCallback(
    async (exercises: TrainingSessionScores[]) => {
      await addTraining(exercises);
    },
    [addTraining],
  );

  const handleDeleteTrainingSession = useCallback(async () => {
    await hideAndDeleteTrainingSession();
  }, [hideAndDeleteTrainingSession]);

  return { sendTraining, handleDeleteTrainingSession };
};

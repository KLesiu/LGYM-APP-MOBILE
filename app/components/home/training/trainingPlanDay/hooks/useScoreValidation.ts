import { useCallback } from 'react';
import type { TFunction } from 'i18next';
import type { TrainingSessionScores } from '../../../../../../types/models';

type ScoreValidationResult =
  | { parsedScores: TrainingSessionScores[]; errorMessage?: never }
  | { parsedScores?: never; errorMessage: string };

export const useScoreValidation = (t: TFunction) => {
  const formatScoreValidationError = useCallback(
    (exerciseName: string, series: number, missingFields: string[], invalidFields: string[]) => {
      const details: string[] = [];

      if (missingFields.length > 0) {
        details.push(
          t('training.missingFieldList', {
            fields: missingFields.join(', '),
          }),
        );
      }

      if (invalidFields.length > 0) {
        details.push(
          t('training.invalidFieldList', {
            fields: invalidFields.join(', '),
          }),
        );
      }

      return t('training.scoreValidationDetails', {
        exercise: exerciseName,
        series,
        details: details.join('; '),
      });
    },
    [t],
  );

  const parseScoresIfValid = useCallback(
    (scores: TrainingSessionScores[]): ScoreValidationResult => {
      const parsedScores = scores.map((score) => {
        const repsValue = score.reps.toString().trim();
        const weightValue = score.weight.toString().trim();
        const repsWithDot = repsValue.replace(',', '.');
        const weightWithDot = weightValue.replace(',', '.');

        const missingFields: string[] = [];
        const invalidFields: string[] = [];

        if (!repsValue) {
          missingFields.push(t('training.reps'));
        }

        const parsedReps = parseFloat(repsWithDot);
        const parsedWeight = parseFloat(weightWithDot);

        if (!weightValue) {
          missingFields.push(t('training.weightKg'));
        }

        if (repsValue && !Number.isFinite(parsedReps)) {
          invalidFields.push(t('training.reps'));
        }

        if (weightValue && !Number.isFinite(parsedWeight)) {
          invalidFields.push(t('training.weightKg'));
        }

        if (missingFields.length > 0 || invalidFields.length > 0) {
          return formatScoreValidationError(
            score.exercise.name || t('common.unknown'),
            score.series,
            missingFields,
            invalidFields,
          );
        }

        return {
          ...score,
          reps: parsedReps.toString(),
          weight: parsedWeight.toString(),
        };
      });

      const firstError = parsedScores.find((score): score is string => typeof score === 'string');

      if (firstError) {
        return { errorMessage: firstError };
      }

      return { parsedScores: parsedScores as TrainingSessionScores[] };
    },
    [formatScoreValidationError, t],
  );

  return { parseScoresIfValid };
};

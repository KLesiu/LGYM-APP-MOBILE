import { ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import TrainingPlanDayExerciseForm from "./TrainingPlanDayExerciseForm";
import {
  TrainingSessionScores,
} from "../../../../../types/models";
import { GymForm } from "../../../../../types/models";
import React from "react";
import { useHomeContext } from "../../HomeContext";
import { useTrainingPlanDay } from "./TrainingPlanDayContext";
import TrainingPlanDayHeader from "./elements/TrainingPlanDayHeader";
import TrainingPlanDayFooterButtons from "./elements/TrainingPlanDayFooterButtons";
import TrainingPlanDayActionsButtons from "./elements/TrainingPlanDayActionsButtons";
import TrainingPlanDayExerciseLastScoresInfo from "./elements/TrainingPlanDayExerciseLastScoresInfo";
import TrainingPlanDayExerciseView from "./elements/TrainingPlanDayExerciseView";
import TrainingPlanDayExercisesList from "./elements/TrainingPlanDayExercisesList";
import TrainingPlanDayExerciseHeader from "./elements/TrainingPlanDayExerciseHeader";
import TrainingPlanDayHeaderButtons from "./elements/TrainingPlanDayHeaderButtons";
import CreatePlanDay from "../../plan/planDay/CreatePlanDay";
import PlanDayProvider from "../../plan/planDay/CreatePlanDayContext";
import { PlanDayVm } from "../../../../../types/models";
import { TrainingSummary } from "../../../../../types/models";
import { ExerciseForm } from "../../../../../types/models";
import { TrainingViewSteps } from "../../../../../enums/TrainingView";
import ViewLoading from "../../../elements/ViewLoading";
import TrainingPlanDayTimer from "./elements/TrainingPlanDayTimer";
import {
  getGetApiIdGetLastTrainingQueryKey,
  usePostApiIdAddTraining,
} from "../../../../../api/generated/training/training";
import {
  getGetApiMainRecordsIdGetLastMainRecordsQueryKey,
  getGetApiMainRecordsIdGetMainRecordsHistoryQueryKey,
} from "../../../../../api/generated/main-records/main-records";
import { getGetApiExerciseIdGetExerciseQueryOptions } from "../../../../../api/generated/exercise/exercise";
import { useQueryClient } from "@tanstack/react-query";
import {
  getApiCheckToken,
  getGetApiGetUsersRankingQueryKey,
} from "../../../../../api/generated/user/user";
import {
  BodyParts,
  ExerciseResponseDto,
  ExerciseScoresTrainingFormDtoUnit,
  EnumLookupDto,
  ExerciseScoresTrainingFormDto,
  RankDto,
  TrainingFormDto,
} from "../../../../../api/generated/model";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../../../stores/useAuthStore";
import { useAppContext } from "../../../../AppContext";
import { useOnboarding } from "../../../../onboarding/OnboardingContext";
import { TutorialStep } from "../../../../onboarding/tutorialBackend";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message } from "../../../../../enums/Message";
import toastService from "../../../../services/toastService";
import { getErrorMessage } from "../../../../../utils/errorHandler";
import { getExerciseDisplayName } from "../../../../../helpers/exerciseDisplayName";

interface TrainingPlanDayProps {
  hideDaySection: () => void;
  hideAndDeleteTrainingSession: () => Promise<void>;
  dayId: string;
  gym: GymForm | undefined;
  setStep: (step: number) => void;
  setTrainingSummary: (trainingSummary: TrainingSummary) => void;
}

type ScoreValidationResult =
  | { parsedScores: TrainingSessionScores[]; errorMessage?: never }
  | { parsedScores?: never; errorMessage: string };

const getRankName = (rank: unknown, unknownLabel: string): string => {
  if (typeof rank === "string") {
    return rank;
  }

  if (rank && typeof rank === "object") {
    const rankName = (rank as RankDto).name;
    if (typeof rankName === "string" && rankName.length > 0) {
      return rankName;
    }
  }

  return unknownLabel;
};

const getRankNeedElo = (rank: unknown): number => {
  if (rank && typeof rank === "object") {
    const rankNeedElo = (rank as RankDto).needElo;
    if (typeof rankNeedElo === "number") {
      return rankNeedElo;
    }
  }

  return 0;
};

const hasRankName = (rank: unknown): boolean => {
  if (typeof rank === "string") {
    return rank.length > 0;
  }

  if (rank && typeof rank === "object") {
    const rankName = (rank as RankDto).name;
    return typeof rankName === "string" && rankName.length > 0;
  }

  return false;
};

const mapUnitValue = (unit: unknown, unknownLabel: string): string => {
  if (typeof unit === "string") {
    return unit;
  }

  if (unit && typeof unit === "object") {
    const unitName = (unit as { name?: unknown }).name;
    if (typeof unitName === "string" && unitName.length > 0) {
      return unitName;
    }
  }

  return unknownLabel;
};

const mapTrainingSummary = (
  source: Record<string, unknown>,
  unknownLabel: string
): TrainingSummary => {
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
        const currentResult = seriesRecord.currentResult as
          | Record<string, unknown>
          | undefined;
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
  }) as TrainingSummary["comparison"];

  return {
    comparison: mappedComparison,
    gainElo: typeof source.gainElo === "number" ? source.gainElo : 0,
    userOldElo: typeof source.userOldElo === "number" ? source.userOldElo : 0,
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
      typeof source.msg === "string"
        ? (source.msg as TrainingSummary["msg"])
        : ("" as TrainingSummary["msg"]),
  };
};

const getKilogramsUnit = (): ExerciseScoresTrainingFormDtoUnit =>
  ExerciseScoresTrainingFormDtoUnit.Kilograms;

const TrainingPlanDay: React.FC<TrainingPlanDayProps> = (props) => {
  const { t } = useTranslation();
  const { changeHeaderVisibility, userId } = useHomeContext();
  const { setUserInfo } = useAppContext();
  const { currentStep, isTutorialActive, completeStep } = useOnboarding();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  
  const {
    planDay,
    setPlanDay,
    setCurrentExercise,
    gym,
    sendPlanDayToLocalStorage,
    addNewExerciseToTrainingSessionScores,
    incrementOrDecrementExerciseInTrainingSessionScores,
    trainingSessionScores,
    setTrainingSessionScores,
    scrollViewRef,
  } = useTrainingPlanDay();

  const [
    isTrainingPlanDayExerciseFormShow,
    setIsTrainingPlanDayExerciseFormShow,
  ] = useState<boolean>(false);
  const [isPlanShow, setIsPlanShow] = useState<boolean>(false);
  const [bodyPart, setBodyPart] = useState<BodyParts | undefined>();
  const [exerciseWhichBeingSwitched, setExerciseWhichBeingSwitched] = useState<
    string | undefined
  >();

  const { mutateAsync: addTrainingMutation, isPending: isAddingTraining } = usePostApiIdAddTraining();
  const isTutorialTrainingSession =
    isTutorialActive && currentStep === TutorialStep.LastTreningResult;

  useEffect(() => {
    changeHeaderVisibility(false);
    return () => {
      toastService.hide();
      changeHeaderVisibility(true);
    };
  }, []);

  const syncCurrentUserAfterTraining = async (
    fallbackSummary: TrainingSummary,
    trainingSummaryData: Record<string, unknown>,
    hasUserOldEloFromApi: boolean
  ) => {
    try {
      const response = await getApiCheckToken();
      if (response?.data && "name" in response.data) {
        const freshUser = response.data;
        setUser(freshUser);
        setUserInfo(freshUser);
        return;
      }
    } catch (error) {
      console.error("Failed to refresh user after training", error);
    }

    if (!user) {
      return;
    }

    const currentElo = hasUserOldEloFromApi
      ? Number(trainingSummaryData.userOldElo)
      : Number(user.elo ?? 0);
    const gainElo = Number(fallbackSummary.gainElo ?? 0);
    const updatedElo = currentElo + gainElo;
    const hasProfileRankFromApi = hasRankName(trainingSummaryData.profileRank);
    const hasNextRankFromApi = Object.hasOwn(trainingSummaryData, "nextRank");

    const fallbackUser = {
      ...user,
      elo: updatedElo,
      profileRank: hasProfileRankFromApi
        ? fallbackSummary.profileRank?.name
        : user.profileRank,
      nextRank: hasNextRankFromApi
        ? (fallbackSummary.nextRank ?? undefined)
        : user.nextRank,
    };

    setUser(fallbackUser);
    setUserInfo(fallbackUser);
  };

  /// Submit training and delete training session from localStorage then show summary.
  const addTraining = async (exercises: TrainingSessionScores[]) => {
    if (isTutorialTrainingSession) {
      const tutorialSummary: TrainingSummary = {
        comparison: [],
        gainElo: 0,
        userOldElo: typeof user?.elo === "number" ? user.elo : 0,
        profileRank: {
          name: getRankName(user?.profileRank, t("common.unknown")),
          needElo: getRankNeedElo(user?.profileRank),
        },
        nextRank: user?.nextRank
          ? {
              name: getRankName(user.nextRank, t("common.unknown")),
              needElo: getRankNeedElo(user.nextRank),
            }
          : null,
        msg: Message.Created,
        };

        await AsyncStorage.multiRemove(["planDay", "trainingSessionScores", "gym"]);
        toastService.hide();
        props.setTrainingSummary(tutorialSummary);
        props.setStep(TrainingViewSteps.TRAINING_SUMMARY);
        await completeStep(TutorialStep.LastTreningResult);
      return;
    }

    const type = props.dayId;
    const gymId = gym?._id;

    if (!userId || !type || !gymId) {
      toastService.showError(
        t("training.missingTrainingContext"),
        t("training.failedToAdd")
      );
      return;
    }

    const createdAt = new Date().toISOString();
    const training: ExerciseScoresTrainingFormDto[] = exercises.map((ele: TrainingSessionScores) => {
      const exerciseScoresTrainingForm: ExerciseScoresTrainingFormDto = {
        exercise: `${ele.exercise._id}`,
        reps: parseFloat(ele.reps),
        series: ele.series,
        weight: parseFloat(ele.weight),
        unit: getKilogramsUnit(),
      };
      return exerciseScoresTrainingForm;
    });

    const body: TrainingFormDto = {
      type,
      createdAt: createdAt,
      exercises: training,
      gym: gymId,
    };

    try {
        const result = await addTrainingMutation({ id: userId, data: body });
        if (result && result.data) {
              toastService.hide();
              await props.hideAndDeleteTrainingSession();
              props.setStep(TrainingViewSteps.TRAINING_SUMMARY);
             const trainingSummaryData = result.data as Record<string, unknown>;
             const hasUserOldEloFromApi =
               Object.hasOwn(trainingSummaryData, "userOldElo") &&
               typeof trainingSummaryData.userOldElo === "number";
             const mappedSummary = mapTrainingSummary(
               trainingSummaryData,
               t("common.unknown")
             );
             const normalizedSummary: TrainingSummary = {
               ...mappedSummary,
               userOldElo: hasUserOldEloFromApi
                 ? mappedSummary.userOldElo
                 : Number(user?.elo ?? 0),
             };
             props.setTrainingSummary(normalizedSummary);

             const invalidatePromises = [
               queryClient.invalidateQueries({
                 queryKey: getGetApiGetUsersRankingQueryKey(),
               }),
             ];

             if (userId) {
               invalidatePromises.push(
                 queryClient.invalidateQueries({
                   queryKey: getGetApiIdGetLastTrainingQueryKey(userId),
                 }),
                 queryClient.invalidateQueries({
                   queryKey: getGetApiMainRecordsIdGetLastMainRecordsQueryKey(userId),
                 }),
                 queryClient.invalidateQueries({
                   queryKey: getGetApiMainRecordsIdGetMainRecordsHistoryQueryKey(userId),
                 })
               );
             }

             await Promise.all(invalidatePromises);
             await Promise.all([
               queryClient.refetchQueries({
                 queryKey: getGetApiGetUsersRankingQueryKey(),
                 type: "all",
               }),
               ...(userId
                 ? [
                     queryClient.refetchQueries({
                       queryKey: getGetApiIdGetLastTrainingQueryKey(userId),
                       type: "all",
                     }),
                     queryClient.refetchQueries({
                       queryKey: getGetApiMainRecordsIdGetLastMainRecordsQueryKey(userId),
                       type: "all",
                     }),
                     queryClient.refetchQueries({
                       queryKey: getGetApiMainRecordsIdGetMainRecordsHistoryQueryKey(userId),
                       type: "all",
                     }),
                   ]
                 : []),
             ]);

              await syncCurrentUserAfterTraining(
                normalizedSummary,
                trainingSummaryData,
                hasUserOldEloFromApi
              );
         }
    } catch (error) {
        console.error(error);
        const errorReason = getErrorMessage(error, t("common.tryAgain"));
        toastService.showError(errorReason, t("training.failedToAdd"));
    }
  };

  /// Delete exercise from plan day
  const deleteExerciseFromPlanDay = async (exerciseId: string | undefined) => {
    if (!exerciseId) return;
    const newPlanDayExercises = planDay?.exercises.filter(
      (exercise) => exercise.exercise._id !== exerciseId
    );
    if (!newPlanDayExercises || !newPlanDayExercises.length || !planDay) return;
    const newPlanDay = { ...planDay, exercises: newPlanDayExercises };
    await sendPlanDayToLocalStorage(newPlanDay);
    setPlanDay(newPlanDay);
    setCurrentExercise(newPlanDay.exercises[0]);
    const newTrainingSessionScores = trainingSessionScores.filter(
      (exercise) => exercise.exercise._id !== exerciseId
    );
    setTrainingSessionScores(newTrainingSessionScores);
    return newPlanDay;
  };

  /// Show exercise form for adding a new exercise with a specific body part
  const showExerciseFormByBodyPart = (
    bodyPart: EnumLookupDto | undefined,
    exerciseToSwitchId: string
  ) => {
    if (!exerciseToSwitchId) return;
    setExerciseWhichBeingSwitched(exerciseToSwitchId);
    setBodyPart((bodyPart?.id as BodyParts) || undefined);
    setIsTrainingPlanDayExerciseFormShow(true);
  };

  /// Show exercise form for adding a new exercise
  const showExerciseForm = () => {
    setBodyPart(undefined);
    setExerciseWhichBeingSwitched(undefined);
    setIsTrainingPlanDayExerciseFormShow(true);
  };

  /// Hide exercise form
  const hideExerciseForm = () => {
    setIsTrainingPlanDayExerciseFormShow(false);
  };

  const getExercise = async (id: string): Promise<ExerciseForm> => {
    const exercise = await queryClient.fetchQuery(
        getGetApiExerciseIdGetExerciseQueryOptions(id)
    );
    const dto = exercise.data as ExerciseResponseDto;
    return {
      _id: dto._id || "",
      name: getExerciseDisplayName(dto),
      user: dto.user || "",
      bodyPart: dto.bodyPart || undefined,
      description: dto.description || "",
      image: dto.image || "",
    };
  };

  const incrementOrDecrementExercise = async (
    exerciseId: string,
    seriesChange: number
  ) => {
    if (!planDay?.exercises?.length) {
      return;
    }

    const targetExercise = planDay.exercises.find(
      (exercise) => exercise.exercise._id === exerciseId
    );

    if (!targetExercise) {
      return;
    }

    const nextSeries = targetExercise.series + seriesChange;
    if (nextSeries < 1) {
      return;
    }

    const newPlanDayExercises = planDay?.exercises.map((exercise) => {
      if (exercise.exercise._id === exerciseId) {
        const newCurrentExercise = {
          ...exercise,
          series: nextSeries,
        };
        setCurrentExercise(newCurrentExercise);
        return newCurrentExercise;
      }
      return exercise;
    });
    const newPlanDay = { ...planDay, exercises: newPlanDayExercises };
    await addExerciseToPlanDay(newPlanDay as PlanDayVm);

    incrementOrDecrementExerciseInTrainingSessionScores(
      exerciseId,
      seriesChange
    );
  };

  const getExerciseToAddFromForm = async (
    exerciseId: string,
    series: number,
    reps: string,
    isIncrementDecrement?: boolean
  ) => {
    if (!planDay) return;

    const response = await getExercise(exerciseId);
    let newPlanDay: PlanDayVm = planDay;
    let exerciseIndex = -1;
    let exerciseScoreInsertIndex: number | undefined;

    if (exerciseWhichBeingSwitched || isIncrementDecrement) {
      const idExercise = isIncrementDecrement
        ? exerciseId
        : exerciseWhichBeingSwitched;

      if (idExercise) {
        const foundScoreIndex = trainingSessionScores.findIndex(
          (score) => score.exercise._id === idExercise
        );
        if (foundScoreIndex !== -1) {
          exerciseScoreInsertIndex = foundScoreIndex;
        }
      }

      exerciseIndex = newPlanDay.exercises.findIndex(
        (e) => e.exercise._id === idExercise
      );

      const response = await deleteExerciseFromPlanDay(idExercise);
      if (!response) return;

      newPlanDay = response;
    }

    let newPlanDayExercises = [...newPlanDay.exercises];

    const newExercise = { exercise: response, series, reps };

    if (exerciseIndex !== -1) {
      newPlanDayExercises.splice(exerciseIndex, 0, newExercise);
    } else {
      newPlanDayExercises.push(newExercise);
    }

    newPlanDay = { ...newPlanDay, exercises: newPlanDayExercises };

    if (!newPlanDay) return;
    addNewExerciseToTrainingSessionScores(newExercise, exerciseScoreInsertIndex);
    setCurrentExercise(newExercise);
    await addExerciseToPlanDay(newPlanDay);
    setIsTrainingPlanDayExerciseFormShow(false);
  };

  const addExerciseToPlanDay = async (newPlanDay: PlanDayVm) => {
    setPlanDay(newPlanDay);
    await sendPlanDayToLocalStorage(newPlanDay);
  };

  const formatScoreValidationError = (
    exerciseName: string,
    series: number,
    missingFields: string[],
    invalidFields: string[]
  ): string => {
    const details: string[] = [];

    if (missingFields.length > 0) {
      details.push(
        t("training.missingFieldList", {
          fields: missingFields.join(", "),
        })
      );
    }

    if (invalidFields.length > 0) {
      details.push(
        t("training.invalidFieldList", {
          fields: invalidFields.join(", "),
        })
      );
    }

    return t("training.scoreValidationDetails", {
      exercise: exerciseName,
      series,
      details: details.join("; "),
    });
  };

  const parseScoresIfValid = (
    scores: TrainingSessionScores[]
  ): ScoreValidationResult => {
    const parsedScores = scores.map((score) => {
      const repsValue = score.reps.toString().trim();
      const weightValue = score.weight.toString().trim();
      const repsWithDot = repsValue.replace(",", ".");
      const weightWithDot = weightValue.replace(",", ".");

      const missingFields: string[] = [];
      const invalidFields: string[] = [];

      if (!repsValue) {
        missingFields.push(t("training.reps"));
      }

      const parsedReps = parseFloat(repsWithDot);
      const parsedWeight = parseFloat(weightWithDot);

      if (!weightValue) {
        missingFields.push(t("training.weightKg"));
      }

      if (repsValue && !Number.isFinite(parsedReps)) {
        invalidFields.push(t("training.reps"));
      }

      if (weightValue && !Number.isFinite(parsedWeight)) {
        invalidFields.push(t("training.weightKg"));
      }

      if (missingFields.length > 0 || invalidFields.length > 0) {
        return formatScoreValidationError(
          getExerciseDisplayName(score.exercise) || t("common.unknown"),
          score.series,
          missingFields,
          invalidFields
        );
      }

      return {
        ...score,
        reps: parsedReps.toString(),
        weight: parsedWeight.toString(),
      };
    });

    const firstError = parsedScores.find(
      (score): score is string => typeof score === "string"
    );

    if (firstError) {
      return { errorMessage: firstError };
    }

    return { parsedScores: parsedScores as TrainingSessionScores[] };
  };

  const sendTraining = async (exercises: TrainingSessionScores[]) => {
    const result = parseScoresIfValid(exercises);
    if (!result.parsedScores) {
      toastService.showError(
        result.errorMessage,
        t("training.invalidScores")
      );
      return;
    }

    toastService.hide();
    await addTraining(result.parsedScores);
  };

  const togglePlanShow = () => {
    setIsPlanShow(!isPlanShow);
  };

  const handleDeleteTrainingSession = async () => {
    await props.hideAndDeleteTrainingSession();

    if (isTutorialTrainingSession) {
      await completeStep(TutorialStep.LastTreningResult);
    }
  };

  return (
    <View className="absolute w-full h-full text-textColor bg-bgColor flex flex-col">
      {planDay && Object.keys(planDay).length ? (
        <View
          style={{ gap: 8 }}
          className=" h-full flex flex-col justify-between pb-4"
        >
          <TrainingPlanDayHeader hideDaySection={props.hideDaySection} />

          <ScrollView
            ref={scrollViewRef}
            className="flex flex-col"
            contentContainerStyle={{
              display: "flex",
              gap: 16,
            }}
          >
            <TrainingPlanDayExerciseHeader />
            <View className="flex flex-row px-5" style={{gap: 8}}>
              <TrainingPlanDayHeaderButtons
                showExerciseForm={showExerciseForm}
              />
              <TrainingPlanDayTimer />
            </View>

            <TrainingPlanDayActionsButtons
              getExerciseToAddFromForm={getExerciseToAddFromForm}
              incrementOrDecrementExercise={incrementOrDecrementExercise}
              deleteExerciseFromPlan={deleteExerciseFromPlanDay}
              showExerciseFormByBodyPart={showExerciseFormByBodyPart}
              togglePlanShow={togglePlanShow}
            />
            <TrainingPlanDayExerciseLastScoresInfo />
            <TrainingPlanDayExerciseView />
            <TrainingPlanDayExercisesList
              deleteExerciseFromPlan={deleteExerciseFromPlanDay}
            />
          </ScrollView>
          <TrainingPlanDayFooterButtons
            sendTraining={sendTraining}
            hideAndDeleteTrainingSession={handleDeleteTrainingSession}
          />
        </View>
      ) : (
        <ViewLoading />
      )}
      {isTrainingPlanDayExerciseFormShow && (
        <TrainingPlanDayExerciseForm
          cancel={hideExerciseForm}
          addExerciseToPlanDay={getExerciseToAddFromForm}
          bodyPart={bodyPart}
        />
      )}
      {isPlanShow && (
        <PlanDayProvider closeForm={togglePlanShow}>
          <CreatePlanDay isPreview={true} planDayId={planDay?._id} />
        </PlanDayProvider>
      )}
    </View>
  );
};

export default TrainingPlanDay;

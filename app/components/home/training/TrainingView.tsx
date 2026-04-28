import { View } from 'react-native';
import TrainingDayChoose from './trainingChoices/TrainingDayChoose';
import TrainingGymChoose from './trainingChoices/TrainingGymChoose';
import TrainingPlanDay from './trainingPlanDay/TrainingPlanDay';
import TrainingSummary from './TrainingSummary';
import StartTrainingControl from './elements/StartTrainingControl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  GymForm,
  TrainingSummary as TrainingSummaryInterface,
} from '../../../../types/models';
import { useHomeContext } from '../HomeContext';
import TrainingPlanDayProvider from './trainingPlanDay/TrainingPlanDayContext';
import { TrainingViewSteps } from '../../../../enums/TrainingView';
import React from 'react';
import { GymChoiceInfoDto } from '../../../../api/generated/model';
import { useOnboarding } from '../../../onboarding/OnboardingContext';
import { TutorialStep } from '../../../onboarding/tutorialBackend';
import { encryptedStorage } from '../../../../lib/encryptedStorage';

type TrainingViewProps = Record<string, never>;

const parseStoredValue = <T,>(value: string | null): T | null => {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const isValidStoredGym = (gym: GymForm | null): gym is GymForm => {
  return !!gym && typeof gym._id === 'string' && gym._id.length > 0;
};

const TrainingView: React.FC<TrainingViewProps> = () => {
  const { toggleMenuButton } = useHomeContext();
  const { registerScreen, setStepAction } = useOnboarding();

  ///GYM
  const [gym, setGym] = useState<GymForm>();

  ///PLAN DAY
  const [dayId, setDayId] = useState<string>();

  ///TRAINING SUMMARY
  const [trainingSummary, setTrainingSummary] = useState<TrainingSummaryInterface>();

  const [step, setStep] = useState<TrainingViewSteps>();

  const getInformationAboutGyms = useCallback(() => {
    setStep(TrainingViewSteps.CHOOSE_GYM);
    toggleMenuButton(true);
  }, [toggleMenuButton]);

  const resetWithoutStep = useCallback(() => {
    setGym(undefined);
    setDayId('');
    setTrainingSummary(undefined);
    toggleMenuButton(false);
  }, [toggleMenuButton]);

  const resetTrainingView = useCallback(() => {
    setStep(TrainingViewSteps.None);
    resetWithoutStep();
  }, [resetWithoutStep]);

  const showDaySection = useCallback(
    async (day: string): Promise<void> => {
      setStep(TrainingViewSteps.TRAINING_PLAN_DAY);
      setDayId(day);
      toggleMenuButton(true);
    },
    [toggleMenuButton],
  );

  const hideAndDeleteTrainingSession = useCallback(async () => {
    await encryptedStorage.removeItem('planDay');
    await encryptedStorage.removeItem('trainingSessionScores');
    await encryptedStorage.removeItem('gym');
    resetTrainingView();
  }, [resetTrainingView]);

  const goBackFromTrainingPlanDay = useCallback(() => {
    setStep(TrainingViewSteps.PLAN_DAY_TO_RESUME);
    resetWithoutStep();
  }, [resetWithoutStep]);

  /// Set gym, hide gym choice popUp and show day choice popUp
  const changeGym = useCallback(async (gymData: GymChoiceInfoDto) => {
    const gymForm: GymForm = {
      name: gymData.name || '',
      ...(gymData.address ? { address: gymData.address } : {}),
      ...(gymData._id ? { _id: gymData._id } : {}),
    };
    setGym(gymForm);
    setStep(TrainingViewSteps.CHOOSE_DAY);
  }, []);

  /// Get active plan day from localStorage, set gym and show TrainingPlanDay.
  const getCurrentPlanDayTraining = useCallback(
    async (storedDayId?: string) => {
      const dayIdFromStorage =
        storedDayId ??
        parseStoredValue<{ _id?: string }>(await encryptedStorage.getItem('planDay'))?._id;

      if (!dayIdFromStorage) {
        await hideAndDeleteTrainingSession();
        return;
      }

      const storedGym = parseStoredValue<GymForm>(await encryptedStorage.getItem('gym'));
      if (!isValidStoredGym(storedGym)) {
        await hideAndDeleteTrainingSession();
        return;
      }

      setGym({
        ...(storedGym._id ? { _id: storedGym._id } : {}),
        name: storedGym.name ?? '',
        ...(storedGym.address ? { address: storedGym.address } : {}),
      });
      showDaySection(dayIdFromStorage);
    },
    [hideAndDeleteTrainingSession, showDaySection],
  );

  /// Check is user have active plan day training
  const checkIsUserHaveActivePlanDayTraining = useCallback(async () => {
    const planDay = parseStoredValue<{ _id?: string }>(await encryptedStorage.getItem('planDay'));

    if (planDay?._id) {
      await getCurrentPlanDayTraining(planDay._id);
      return;
    }

    setStep(TrainingViewSteps.None);
  }, [getCurrentPlanDayTraining]);

  /// Init component
  const init = useCallback(async () => {
    await checkIsUserHaveActivePlanDayTraining();
  }, [checkIsUserHaveActivePlanDayTraining]);

  useEffect(() => {
    registerScreen(step === TrainingViewSteps.TRAINING_PLAN_DAY ? 'TRAINING_VIEW' : 'TRAINING');
  }, [registerScreen, step]);

  useEffect(() => {
    setStepAction(TutorialStep.CreateTraining, getInformationAboutGyms);

    return () => {
      setStepAction(TutorialStep.CreateTraining, null);
    };
  }, [getInformationAboutGyms, setStepAction]);

  useEffect(() => {
    init();
  }, [init]);

  const isAddTrainingActive = useMemo(() => step === TrainingViewSteps.PLAN_DAY_TO_RESUME, [step]);

  const renderView = useCallback(() => {
    switch (step) {
      case TrainingViewSteps.CHOOSE_GYM:
        return <TrainingGymChoose goBack={resetTrainingView} setGym={changeGym} />;
      case TrainingViewSteps.CHOOSE_DAY:
        return (
          <TrainingDayChoose goBack={getInformationAboutGyms} showDaySection={showDaySection} />
        );
      case TrainingViewSteps.TRAINING_PLAN_DAY:
        return (
          <TrainingPlanDayProvider gym={gym} dayId={dayId ?? ''}>
            <TrainingPlanDay
              hideDaySection={goBackFromTrainingPlanDay}
              hideAndDeleteTrainingSession={hideAndDeleteTrainingSession}
              dayId={dayId ?? ''}
              gym={gym}
              setStep={setStep}
              setTrainingSummary={setTrainingSummary}
            />
          </TrainingPlanDayProvider>
        );
      case TrainingViewSteps.TRAINING_SUMMARY:
        return (
          <TrainingSummary
            trainingSummary={trainingSummary as TrainingSummaryInterface}
            closePopUp={resetTrainingView}
          />
        );
      default:
        return null;
    }
  }, [
    changeGym,
    dayId,
    getInformationAboutGyms,
    goBackFromTrainingPlanDay,
    gym,
    hideAndDeleteTrainingSession,
    resetTrainingView,
    showDaySection,
    step,
    trainingSummary,
  ]);

  return (
    <View className="relative  flex flex-col justify-center items-center h-full w-full">
      <StartTrainingControl
        isAddTrainingActive={isAddTrainingActive}
        getCurrentPlanDayTraining={getCurrentPlanDayTraining}
        getInformationAboutGyms={getInformationAboutGyms}
      />
      {renderView()}
    </View>
  );
};

export default TrainingView;

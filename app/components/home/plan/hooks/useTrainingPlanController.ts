import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import type { PlanDayBaseInfoVm, PlanForm } from '../../../../../types/models';
import {
  getGetApiIdCheckIsUserHavePlanQueryKey,
  getGetApiIdGetPlanConfigQueryKey,
  getGetApiIdGetPlansListQueryKey,
  usePostApiCopy,
  usePostApiIdDeletePlan,
  usePostApiIdSetNewActivePlan,
} from '../../../../../api/generated/plan/plan';
import {
  getGetApiPlanDayIdGetPlanDaysInfoQueryKey,
  getGetApiPlanDayIdGetPlanDaysTypesQueryKey,
  useGetApiPlanDayIdDeletePlanDay,
} from '../../../../../api/generated/plan-day/plan-day';
import { useOnboarding } from '../../../../onboarding/OnboardingContext';
import { TutorialStep } from '../../../../onboarding/tutorialBackend';
import { useHomeContext } from '../../HomeContext';
import { getErrorMessage, sanitize } from '../../../../../lib/domain/errorHandler';
import toastService from '../../../../services/toastService';
import type { PlanDto } from '../../../../../api/generated/model';

type UseTrainingPlanControllerParams = {
  planConfig?: PlanForm;
  onRefetchPlanDays: () => Promise<void>;
  onRefetchAll: () => Promise<unknown>;
};

export const useTrainingPlanController = ({
  planConfig,
  onRefetchPlanDays,
  onRefetchAll,
}: UseTrainingPlanControllerParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { toggleMenuButton, hideMenu, userId, changeHeaderVisibility } = useHomeContext();
  const { completeStep, currentStep, registerScreen, setStepAction } = useOnboarding();

  const [isSwitchingPlan, setIsSwitchingPlan] = useState<boolean>(false);
  const [isPlanDayFormVisible, setIsPlanDayFormVisible] = useState<boolean>(false);
  const [isPlansListVisible, setIsPlansListVisible] = useState<boolean>(false);
  const [isPreviewPlanDay, setIsPreviewPlanDay] = useState<boolean | undefined>(false);
  const [showPlanConfig, setShowPlanConfig] = useState<boolean>(false);
  const [currentPlanDay, setCurrentPlanDay] = useState<PlanDayBaseInfoVm>();
  const [isDeletePlanDayConfirmationDialogVisible, setIsDeletePlanDayConfirmationDialogVisible] =
    useState<boolean>(false);
  const [isShareCodeDialogShowed, setIsShareCodeDialogShowed] = useState<boolean>(false);
  const [isCopyPlanDialogShowed, setIsCopyPlanDialogShowed] = useState<boolean>(false);
  const [isDeletePlanConfirmationDialogVisible, setIsDeletePlanConfirmationDialogVisible] =
    useState<boolean>(false);

  const { mutateAsync: copyPlanMutation } = usePostApiCopy();
  const { mutateAsync: setNewActivePlanMutation } = usePostApiIdSetNewActivePlan();
  const { mutateAsync: deletePlanMutation } = usePostApiIdDeletePlan();
  const { refetch: triggerDeletePlanDay } = useGetApiPlanDayIdDeletePlanDay(currentPlanDay?._id || '', {
    query: { enabled: false },
  });

  const handlePlanCreated = useCallback(async () => {
    if (currentStep !== TutorialStep.CreatePlan) {
      return;
    }

    await completeStep(TutorialStep.CreatePlan);
  }, [completeStep, currentStep]);

  const handlePlanDayCreated = useCallback(async () => {
    if (currentStep !== TutorialStep.CreatePlanDay) {
      return;
    }

    await completeStep(TutorialStep.CreatePlanDay);
  }, [completeStep, currentStep]);

  const refetchAll = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: getGetApiIdGetPlanConfigQueryKey(userId) });
    await queryClient.invalidateQueries({ queryKey: getGetApiIdGetPlansListQueryKey(userId) });
    await queryClient.invalidateQueries({ queryKey: getGetApiIdCheckIsUserHavePlanQueryKey(userId) });
    await queryClient.invalidateQueries({ queryKey: getGetApiPlanDayIdGetPlanDaysTypesQueryKey(userId) });
    if (planConfig?._id) {
      await queryClient.invalidateQueries({ queryKey: getGetApiPlanDayIdGetPlanDaysInfoQueryKey(planConfig._id) });
    }
    await onRefetchAll();
  }, [onRefetchAll, planConfig?._id, queryClient, userId]);

  const togglePlanConfigPopUp = useCallback((value: boolean): void => {
    if (value) {
      setIsPlansListVisible(false);
    }
    toggleMenuButton(value);
    setShowPlanConfig(value);
  }, [toggleMenuButton]);

  const showPlanDayForm = useCallback(
    (planDay?: PlanDayBaseInfoVm, isPreview?: boolean): void => {
      setCurrentPlanDay(planDay);
      setIsPreviewPlanDay(isPreview);
      toggleMenuButton(true);
      changeHeaderVisibility(false);
      setIsPlanDayFormVisible(true);
    },
    [changeHeaderVisibility, toggleMenuButton],
  );

  const showPlansList = useCallback((): void => {
    setIsPlansListVisible(true);
    toggleMenuButton(true);
  }, [toggleMenuButton]);

  const hidePlansList = useCallback((): void => {
    setIsPlansListVisible(false);
    toggleMenuButton(false);
  }, [toggleMenuButton]);

  const showShareCodeDialog = useCallback((): void => {
    setIsShareCodeDialogShowed(true);
    toggleMenuButton(true);
  }, [toggleMenuButton]);

  const hideShareCodeDialog = useCallback((): void => {
    setIsShareCodeDialogShowed(false);
    toggleMenuButton(false);
  }, [toggleMenuButton]);

  const hideCopyPlanDialog = useCallback(() => {
    setIsCopyPlanDialogShowed(false);
    toggleMenuButton(false);
  }, [toggleMenuButton]);

  const showCopyPlanDialog = useCallback(() => {
    setIsCopyPlanDialogShowed(true);
    toggleMenuButton(true);
  }, [toggleMenuButton]);

  const hidePlanDayForm = useCallback(async (): Promise<void> => {
    setIsPlanDayFormVisible(false);
    toggleMenuButton(false);
    changeHeaderVisibility(true);
    hideMenu();
    await onRefetchPlanDays();
  }, [changeHeaderVisibility, hideMenu, onRefetchPlanDays, toggleMenuButton]);

  const reloadSection = useCallback(async (): Promise<void> => {
    setShowPlanConfig(false);
    toggleMenuButton(false);
    await refetchAll();
  }, [refetchAll, toggleMenuButton]);

  const changeActivePlan = useCallback(
    async (newPlanConfig: PlanForm) => {
      try {
        if (newPlanConfig._id) {
          setIsSwitchingPlan(true);
          await setNewActivePlanMutation({ id: userId, data: { _id: newPlanConfig._id } });
          await queryClient.invalidateQueries({ queryKey: getGetApiIdGetPlanConfigQueryKey(userId) });
          await queryClient.invalidateQueries({ queryKey: getGetApiIdGetPlansListQueryKey(userId) });
          await queryClient.invalidateQueries({ queryKey: getGetApiIdCheckIsUserHavePlanQueryKey(userId) });
          await queryClient.invalidateQueries({ queryKey: getGetApiPlanDayIdGetPlanDaysTypesQueryKey(userId) });
          await AsyncStorage.multiRemove(['planDay', 'trainingSessionScores']);
        }
      } catch (error) {
        const sanitizedError = sanitize(error);
        if (__DEV__ && sanitizedError.devDetails) {
          console.warn('[TrainingPlan] change active plan failed', sanitizedError.devDetails);
        }
        toastService.showError(getErrorMessage(error, t('common.tryAgain')));
      } finally {
        setIsSwitchingPlan(false);
      }
    },
    [queryClient, setNewActivePlanMutation, t, userId],
  );

  const copyPlan = useCallback(
    async (code: string) => {
      try {
        const response = await copyPlanMutation({ data: { shareCode: code } });
        const newPlan = response.data as PlanDto;

        toastService.showError(t('plans.copiedMessage'), t('plans.copiedTitle'));

        if (newPlan && newPlan.id) {
          const planToActivate: PlanForm = {
            _id: newPlan.id,
            name: newPlan.name || '',
            isActive: newPlan.isActive,
          };
          await changeActivePlan(planToActivate);
          await queryClient.invalidateQueries({ queryKey: getGetApiIdGetPlansListQueryKey(userId) });
        }

        hideCopyPlanDialog();
        hidePlansList();
      } catch (error) {
        const sanitizedError = sanitize(error);
        if (__DEV__ && sanitizedError.devDetails) {
          console.warn('[TrainingPlan] copy plan failed', sanitizedError.devDetails);
        }
        toastService.showError(t('plans.copyFailed'));
      }
    },
    [changeActivePlan, copyPlanMutation, hideCopyPlanDialog, hidePlansList, queryClient, t, userId],
  );

  const setNewPlanConfig = useCallback(
    async (newPlanConfig: PlanForm) => {
      hidePlansList();
      if (newPlanConfig._id === planConfig?._id || isSwitchingPlan) return;
      await changeActivePlan(newPlanConfig);
    },
    [changeActivePlan, hidePlansList, isSwitchingPlan, planConfig?._id],
  );

  const deletePlanDayVisible = useCallback((visible: boolean, planDay?: PlanDayBaseInfoVm) => {
    if (visible) setCurrentPlanDay(planDay);
    else setCurrentPlanDay(undefined);
    setIsDeletePlanDayConfirmationDialogVisible(visible);
  }, []);

  useEffect(() => {
    registerScreen('PLAN');
  }, [registerScreen]);

  useEffect(() => {
    setStepAction(TutorialStep.CreatePlan, () => {
      togglePlanConfigPopUp(true);
    });

    return () => {
      setStepAction(TutorialStep.CreatePlan, null);
    };
  }, [setStepAction, togglePlanConfigPopUp]);

  useEffect(() => {
    setStepAction(TutorialStep.CreatePlanDay, () => {
      showPlanDayForm(undefined);
    });

    return () => {
      setStepAction(TutorialStep.CreatePlanDay, null);
    };
  }, [setStepAction, showPlanDayForm]);

  const handleDeletePlanDayConfirm = useCallback(async () => {
    await triggerDeletePlanDay();
    await onRefetchPlanDays();
    deletePlanDayVisible(false);
  }, [deletePlanDayVisible, onRefetchPlanDays, triggerDeletePlanDay]);

  const deletePlan = useCallback(async () => {
    try {
      if (planConfig?._id) {
        await deletePlanMutation({ id: planConfig._id });
        queryClient.setQueryData(getGetApiIdGetPlanConfigQueryKey(userId), null);
        await queryClient.invalidateQueries({ queryKey: getGetApiIdGetPlansListQueryKey(userId) });
        await refetchAll();
      }
    } catch (error) {
      const sanitizedError = sanitize(error);
        if (__DEV__ && sanitizedError.devDetails) {
          console.warn('[TrainingPlan] delete plan failed', sanitizedError.devDetails);
        }
      toastService.showError(getErrorMessage(error, t('common.tryAgain')));
    } finally {
      setIsDeletePlanConfirmationDialogVisible(false);
    }
  }, [deletePlanMutation, planConfig?._id, queryClient, refetchAll, t, userId]);

  return {
    isSwitchingPlan,
    isPlanDayFormVisible,
    isPlansListVisible,
    isPreviewPlanDay,
    showPlanConfig,
    currentPlanDay,
    isDeletePlanDayConfirmationDialogVisible,
    isShareCodeDialogShowed,
    isCopyPlanDialogShowed,
    isDeletePlanConfirmationDialogVisible,
    togglePlanConfigPopUp,
    showPlanDayForm,
    showPlansList,
    hidePlansList,
    showShareCodeDialog,
    hideShareCodeDialog,
    showCopyPlanDialog,
    hideCopyPlanDialog,
    hidePlanDayForm,
    reloadSection,
    copyPlan,
    setNewPlanConfig,
    deletePlanDayVisible,
    handleDeletePlanDayConfirm,
    deletePlan,
    handlePlanCreated,
    handlePlanDayCreated,
  };
};

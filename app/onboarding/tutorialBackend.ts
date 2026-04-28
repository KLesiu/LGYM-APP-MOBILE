import type {
  CompleteStepRequest,
  CompleteStepRequestStep,
  CompleteStepRequestTutorialType,
  CompleteTutorialRequest,
  TutorialProgressDto,
  TutorialProgressDtoCompletedStepsItem,
  TutorialProgressDtoRemainingStepsItem,
} from '../../api/generated/model';
import {
  CompleteStepRequestStep as GeneratedTutorialStep,
  CompleteStepRequestTutorialType as GeneratedTutorialType,
} from '../../api/generated/model';

export const TutorialStep = GeneratedTutorialStep;
export type TutorialStep = CompleteStepRequestStep;

export const TutorialType = GeneratedTutorialType;
export type TutorialType = CompleteStepRequestTutorialType;

export const ONBOARDING_TUTORIAL_TYPE = TutorialType.OnboardingDemo;

export const ONBOARDING_STEP_ORDER = [
  TutorialStep.CreateArea,
  TutorialStep.CreateGym,
  TutorialStep.CreatePlan,
  TutorialStep.CreatePlanDay,
  TutorialStep.CreateTraining,
  TutorialStep.LastTreningResult,
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEP_ORDER)[number];

const ONBOARDING_STEPS = new Set<TutorialStep>(ONBOARDING_STEP_ORDER);

const isOnboardingStep = (
  step:
    | TutorialStep
    | TutorialProgressDtoCompletedStepsItem
    | TutorialProgressDtoRemainingStepsItem
    | null
    | undefined,
): step is OnboardingStepId => Boolean(step && ONBOARDING_STEPS.has(step as TutorialStep));

export const getNextOnboardingStep = (step: OnboardingStepId): OnboardingStepId | null => {
  const stepIndex = ONBOARDING_STEP_ORDER.indexOf(step);

  if (stepIndex === -1) {
    return null;
  }

  return ONBOARDING_STEP_ORDER[stepIndex + 1] ?? null;
};

export const resolveOnboardingCurrentStep = (
  progress?: TutorialProgressDto | null,
): OnboardingStepId | null => {
  if (!progress || progress.isCompleted) {
    return null;
  }

  const remainingStep = progress.remainingSteps?.find(isOnboardingStep);

  if (remainingStep) {
    return remainingStep;
  }

  const completedSteps = new Set((progress.completedSteps ?? []).filter(isOnboardingStep));

  return ONBOARDING_STEP_ORDER.find((step) => !completedSteps.has(step)) ?? null;
};

export const buildCompleteStepRequest = (step: OnboardingStepId): CompleteStepRequest => ({
  tutorialType: ONBOARDING_TUTORIAL_TYPE,
  step,
});

export const buildCompleteTutorialRequest = (): CompleteTutorialRequest => ({
  tutorialType: ONBOARDING_TUTORIAL_TYPE,
});

export const isOnboardingTutorial = (progress?: TutorialProgressDto | null): boolean =>
  progress?.tutorialType === ONBOARDING_TUTORIAL_TYPE;

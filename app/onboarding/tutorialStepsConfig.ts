import type { HomeScreenId } from "../components/home/homeScreens";
import type { TFunction } from "i18next";
import {
  ONBOARDING_STEP_ORDER,
  TutorialStep,
  type OnboardingStepId,
} from "./tutorialBackend";

export type OnboardingScreenId = HomeScreenId | "PLAN_DAY" | "TRAINING_VIEW";

export interface ContextualHelpContent {
  title: string;
  description: string;
  accentLabel?: string;
  iconName: string;
  primaryActionLabel?: string;
}

export interface TutorialStepConfig {
  id: OnboardingStepId;
  triggerScreen: OnboardingScreenId;
  resumeScreen: HomeScreenId;
  targetScreen?: HomeScreenId;
  nextStep?: OnboardingStepId;
  completeOnNext?: boolean;
  requiresStepAction?: boolean;
  content: ContextualHelpContent;
}

export const tutorialStepOrder: OnboardingStepId[] = [...ONBOARDING_STEP_ORDER];

export const getTutorialStepsConfig = (
  t: TFunction
): Record<OnboardingStepId, TutorialStepConfig> => ({
  [TutorialStep.CreateArea]: {
    id: TutorialStep.CreateArea,
    triggerScreen: "START",
    resumeScreen: "START",
    targetScreen: "GYM",
    nextStep: TutorialStep.CreateGym,
    content: {
      title: t("onboarding.tutorial.steps.gymIntro.title"),
      description: t("onboarding.tutorial.steps.gymIntro.description"),
      accentLabel: t("onboarding.tutorial.accentLabel"),
      iconName: "map-marker-radius",
      primaryActionLabel: t("onboarding.tutorial.steps.gymIntro.primaryActionLabel"),
    },
  },
  [TutorialStep.CreateGym]: {
    id: TutorialStep.CreateGym,
    triggerScreen: "GYM",
    resumeScreen: "GYM",
    nextStep: TutorialStep.CreatePlan,
    completeOnNext: false,
    requiresStepAction: true,
    content: {
      title: t("onboarding.tutorial.steps.gymCreate.title"),
      description: t("onboarding.tutorial.steps.gymCreate.description"),
      accentLabel: t("onboarding.tutorial.accentLabel"),
      iconName: "plus-box-outline",
      primaryActionLabel: t("onboarding.tutorial.steps.gymCreate.primaryActionLabel"),
    },
  },
  [TutorialStep.CreatePlan]: {
    id: TutorialStep.CreatePlan,
    triggerScreen: "PLAN",
    resumeScreen: "PLAN",
    nextStep: TutorialStep.CreatePlanDay,
    completeOnNext: false,
    requiresStepAction: true,
    content: {
      title: t("onboarding.tutorial.steps.planCreate.title"),
      description: t("onboarding.tutorial.steps.planCreate.description"),
      accentLabel: t("onboarding.tutorial.accentLabel"),
      iconName: "clipboard-list-outline",
      primaryActionLabel: t("onboarding.tutorial.steps.planCreate.primaryActionLabel"),
    },
  },
  [TutorialStep.CreatePlanDay]: {
    id: TutorialStep.CreatePlanDay,
    triggerScreen: "PLAN",
    resumeScreen: "PLAN",
    nextStep: TutorialStep.CreateTraining,
    completeOnNext: false,
    requiresStepAction: true,
    content: {
      title: t("onboarding.tutorial.steps.planDayCreate.title"),
      description: t("onboarding.tutorial.steps.planDayCreate.description"),
      accentLabel: t("onboarding.tutorial.accentLabel"),
      iconName: "calendar-plus",
      primaryActionLabel: t("onboarding.tutorial.steps.planDayCreate.primaryActionLabel"),
    },
  },
  [TutorialStep.CreateTraining]: {
    id: TutorialStep.CreateTraining,
    triggerScreen: "TRAINING",
    resumeScreen: "TRAINING",
    nextStep: TutorialStep.LastTreningResult,
    content: {
      title: t("onboarding.tutorial.steps.training.title"),
      description: t("onboarding.tutorial.steps.training.description"),
      accentLabel: t("onboarding.tutorial.accentLabel"),
      iconName: "weight-lifter",
      primaryActionLabel: t("onboarding.tutorial.steps.training.primaryActionLabel"),
    },
  },
  [TutorialStep.LastTreningResult]: {
    id: TutorialStep.LastTreningResult,
    triggerScreen: "TRAINING_VIEW",
    resumeScreen: "TRAINING",
    completeOnNext: false,
    content: {
      title: t("onboarding.tutorial.steps.trainingView.title"),
      description: t("onboarding.tutorial.steps.trainingView.description"),
      accentLabel: t("onboarding.tutorial.accentLabel"),
      iconName: "check-decagram",
      primaryActionLabel: t("onboarding.tutorial.steps.trainingView.primaryActionLabel"),
    },
  },
});

export const getScreenHelpConfig = (
  t: TFunction
): Partial<Record<OnboardingScreenId, ContextualHelpContent>> => ({
  GYM: {
    title: t("onboarding.help.gym.title"),
    description: t("onboarding.help.gym.description"),
    accentLabel: t("onboarding.help.accentLabel"),
    iconName: "map-marker-multiple-outline",
    primaryActionLabel: t("onboarding.help.primaryActionLabel"),
  },
  PLAN: {
    title: t("onboarding.help.plan.title"),
    description: t("onboarding.help.plan.description"),
    accentLabel: t("onboarding.help.accentLabel"),
    iconName: "clipboard-text-outline",
    primaryActionLabel: t("onboarding.help.primaryActionLabel"),
  },
  PLAN_DAY: {
    title: t("onboarding.help.planDay.title"),
    description: t("onboarding.help.planDay.description"),
    accentLabel: t("onboarding.help.accentLabel"),
    iconName: "calendar-edit",
    primaryActionLabel: t("onboarding.help.primaryActionLabel"),
  },
  TRAINING: {
    title: t("onboarding.help.training.title"),
    description: t("onboarding.help.training.description"),
    accentLabel: t("onboarding.help.accentLabel"),
    iconName: "play-circle-outline",
    primaryActionLabel: t("onboarding.help.primaryActionLabel"),
  },
  TRAINING_VIEW: {
    title: t("onboarding.help.trainingView.title"),
    description: t("onboarding.help.trainingView.description"),
    accentLabel: t("onboarding.help.accentLabel"),
    iconName: "notebook-edit-outline",
    primaryActionLabel: t("onboarding.help.primaryActionLabel"),
  },
});

import type { HomeScreenId } from "../components/home/homeScreens";
import type { TFunction } from "i18next";

export type OnboardingStepId =
  | "GYM_INTRO"
  | "GYM_CREATE"
  | "PLAN_CREATE"
  | "PLAN_DAY_CREATE"
  | "TRAINING"
  | "TRAINING_VIEW";

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
  targetScreen?: HomeScreenId;
  nextStep?: OnboardingStepId;
  completeOnNext?: boolean;
  content: ContextualHelpContent;
}

export const ONBOARDING_STORAGE_KEY = "onboarding-state";
export const ONBOARDING_PENDING_SYNC_KEY = "onboarding-pending-sync";

export const tutorialStepOrder: OnboardingStepId[] = [
  "GYM_INTRO",
  "GYM_CREATE",
  "PLAN_CREATE",
  "PLAN_DAY_CREATE",
  "TRAINING",
  "TRAINING_VIEW",
];

export const getTutorialStepsConfig = (
  t: TFunction
): Record<OnboardingStepId, TutorialStepConfig> => ({
  GYM_INTRO: {
    id: "GYM_INTRO",
    triggerScreen: "START",
    targetScreen: "GYM",
    nextStep: "GYM_CREATE",
    content: {
      title: t("onboarding.tutorial.steps.gymIntro.title"),
      description: t("onboarding.tutorial.steps.gymIntro.description"),
      accentLabel: t("onboarding.tutorial.accentLabel"),
      iconName: "map-marker-radius",
      primaryActionLabel: t("onboarding.tutorial.steps.gymIntro.primaryActionLabel"),
    },
  },
  GYM_CREATE: {
    id: "GYM_CREATE",
    triggerScreen: "GYM",
    nextStep: "PLAN_CREATE",
    completeOnNext: false,
    content: {
      title: t("onboarding.tutorial.steps.gymCreate.title"),
      description: t("onboarding.tutorial.steps.gymCreate.description"),
      accentLabel: t("onboarding.tutorial.accentLabel"),
      iconName: "plus-box-outline",
      primaryActionLabel: t("onboarding.tutorial.steps.gymCreate.primaryActionLabel"),
    },
  },
  PLAN_CREATE: {
    id: "PLAN_CREATE",
    triggerScreen: "PLAN",
    nextStep: "PLAN_DAY_CREATE",
    completeOnNext: false,
    content: {
      title: t("onboarding.tutorial.steps.planCreate.title"),
      description: t("onboarding.tutorial.steps.planCreate.description"),
      accentLabel: t("onboarding.tutorial.accentLabel"),
      iconName: "clipboard-list-outline",
      primaryActionLabel: t("onboarding.tutorial.steps.planCreate.primaryActionLabel"),
    },
  },
  PLAN_DAY_CREATE: {
    id: "PLAN_DAY_CREATE",
    triggerScreen: "PLAN",
    nextStep: "TRAINING",
    completeOnNext: false,
    content: {
      title: t("onboarding.tutorial.steps.planDayCreate.title"),
      description: t("onboarding.tutorial.steps.planDayCreate.description"),
      accentLabel: t("onboarding.tutorial.accentLabel"),
      iconName: "calendar-plus",
      primaryActionLabel: t("onboarding.tutorial.steps.planDayCreate.primaryActionLabel"),
    },
  },
  TRAINING: {
    id: "TRAINING",
    triggerScreen: "TRAINING",
    nextStep: "TRAINING_VIEW",
    content: {
      title: t("onboarding.tutorial.steps.training.title"),
      description: t("onboarding.tutorial.steps.training.description"),
      accentLabel: t("onboarding.tutorial.accentLabel"),
      iconName: "weight-lifter",
      primaryActionLabel: t("onboarding.tutorial.steps.training.primaryActionLabel"),
    },
  },
  TRAINING_VIEW: {
    id: "TRAINING_VIEW",
    triggerScreen: "TRAINING_VIEW",
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

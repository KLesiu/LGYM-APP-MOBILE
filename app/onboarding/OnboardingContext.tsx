import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import type { TutorialProgressDto } from "../../api/generated/model";
import {
  getApiTutorialsActive,
  postApiTutorialsComplete,
  postApiTutorialsCompleteStep,
} from "../../api/generated/tutorial/tutorial";
import type { HomeScreenId } from "../components/home/homeScreens";
import ContextualHelpModal, {
  type ContextualHelpMode,
} from "../components/onboarding/ContextualHelpModal";
import {
  tutorialStepOrder,
  getScreenHelpConfig,
  getTutorialStepsConfig,
  type ContextualHelpContent,
  type OnboardingScreenId,
} from "./tutorialStepsConfig";
import {
  buildCompleteStepRequest,
  buildCompleteTutorialRequest,
  getNextOnboardingStep,
  isOnboardingTutorial,
  resolveOnboardingCurrentStep,
  type OnboardingStepId,
} from "./tutorialBackend";

interface OnboardingContextValue {
  currentStep: OnboardingStepId | null;
  isTutorialActive: boolean;
  completedTutorial: boolean;
  isReady: boolean;
  currentScreen: OnboardingScreenId | null;
  canShowHelp: boolean;
  completeStep: (stepId: OnboardingStepId) => Promise<void>;
  syncTutorialState: (hasActiveTutorials?: boolean | null) => Promise<void>;
  registerScreen: (screenId: OnboardingScreenId) => void;
  openInfoForScreen: (screenId?: OnboardingScreenId) => void;
  closeModal: () => void;
  handleModalNext: () => Promise<void>;
  setScreenNavigator: (navigator: (screenId: HomeScreenId) => void) => void;
  setStepAction: (stepId: OnboardingStepId, action: (() => void | Promise<void>) | null) => void;
}

const INITIAL_STEP: OnboardingStepId = tutorialStepOrder[0];

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export const useOnboarding = (): OnboardingContextValue => {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }

  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const tutorialStepsConfig = useMemo(() => getTutorialStepsConfig(t), [t, i18n.language]);
  const screenHelpConfig = useMemo(() => getScreenHelpConfig(t), [t, i18n.language]);

  const [currentStep, setCurrentStep] = useState<OnboardingStepId | null>(null);
  const [isTutorialActive, setIsTutorialActive] = useState<boolean>(false);
  const [completedTutorial, setCompletedTutorial] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<OnboardingScreenId | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ContextualHelpMode>("TUTORIAL");
  const [stepActionVersion, setStepActionVersion] = useState<number>(0);
  const [modalContent, setModalContent] = useState<ContextualHelpContent | null>(
    tutorialStepsConfig[INITIAL_STEP].content
  );
  const screenNavigatorRef = useRef<((screenId: HomeScreenId) => void) | null>(null);
  const resumedStepRef = useRef<OnboardingStepId | null>(null);
  const stepActionsRef = useRef<
    Partial<Record<OnboardingStepId, () => void | Promise<void>>>
  >({});

  const clearTutorialState = useCallback(() => {
    setCurrentStep(null);
    setIsTutorialActive(false);
    setCompletedTutorial(false);
    setModalVisible(false);
    setModalMode("TUTORIAL");
    setModalContent(tutorialStepsConfig[INITIAL_STEP].content);
    resumedStepRef.current = null;
  }, [tutorialStepsConfig]);

  const applyTutorialProgress = useCallback(
    (progress?: TutorialProgressDto | null) => {
      const resolvedStep = resolveOnboardingCurrentStep(progress);

      if (!progress || progress.isCompleted || !resolvedStep) {
        setCurrentStep(null);
        setIsTutorialActive(false);
        setCompletedTutorial(Boolean(progress?.isCompleted));
        setModalVisible(false);
        return;
      }

      setCurrentStep(resolvedStep);
      setIsTutorialActive(true);
      setCompletedTutorial(false);
      setModalMode("TUTORIAL");
      setModalContent(tutorialStepsConfig[resolvedStep].content);
      resumedStepRef.current = null;
    },
    [tutorialStepsConfig]
  );

  const resumeTutorialNavigation = useCallback(
    (stepId: OnboardingStepId) => {
      const resumeScreen = tutorialStepsConfig[stepId].resumeScreen;

      if (!screenNavigatorRef.current) {
        return;
      }

      if (currentScreen === resumeScreen && resumedStepRef.current === stepId) {
        return;
      }

      resumedStepRef.current = stepId;
      screenNavigatorRef.current(resumeScreen);
    },
    [currentScreen, tutorialStepsConfig]
  );

  React.useEffect(() => {
    if (!isReady || !isTutorialActive || !currentStep) {
      return;
    }

    resumeTutorialNavigation(currentStep);
  }, [currentStep, isReady, isTutorialActive, resumeTutorialNavigation]);

  const syncTutorialState = useCallback(
    async (hasActiveTutorials?: boolean | null) => {
      if (!hasActiveTutorials) {
        clearTutorialState();
        setIsReady(true);
        return;
      }

      setIsReady(false);

      try {
        const response = await getApiTutorialsActive();
        const tutorials = Array.isArray(response.data) ? response.data : [];
        const onboardingProgress = tutorials.find(isOnboardingTutorial);

        applyTutorialProgress(onboardingProgress ?? null);
      } catch (error) {
        console.error("Failed to synchronize tutorial state:", error);
        clearTutorialState();
      } finally {
        setIsReady(true);
      }
    },
    [applyTutorialProgress, clearTutorialState]
  );

  React.useEffect(() => {
    if (!isReady || !isTutorialActive || !currentScreen || !currentStep) {
      return;
    }

    const stepConfig = tutorialStepsConfig[currentStep];
    const needsRegisteredAction = stepConfig.completeOnNext === false;

    if (needsRegisteredAction && !stepActionsRef.current[currentStep]) {
      return;
    }

    if (stepConfig.triggerScreen === currentScreen) {
      setModalContent(stepConfig.content);
      setModalMode("TUTORIAL");
      setModalVisible(true);
    }
  }, [currentScreen, currentStep, isReady, isTutorialActive, stepActionVersion, tutorialStepsConfig]);

  const completeStep = useCallback(
    async (stepId: OnboardingStepId) => {
      await postApiTutorialsCompleteStep(buildCompleteStepRequest(stepId));

      const nextStep = getNextOnboardingStep(stepId);

      if (!nextStep) {
        await postApiTutorialsComplete(buildCompleteTutorialRequest());
        setCurrentStep(null);
        setCompletedTutorial(true);
        setIsTutorialActive(false);
        setModalVisible(false);
        return;
      }

      setCurrentStep(nextStep);
      setIsTutorialActive(true);
      setCompletedTutorial(false);
      setModalContent(tutorialStepsConfig[nextStep].content);
      resumedStepRef.current = null;
    },
    [tutorialStepsConfig]
  );

  const registerScreen = useCallback((screenId: OnboardingScreenId) => {
    setCurrentScreen(screenId);
  }, []);

  const openInfoForScreen = useCallback(
    (screenId?: OnboardingScreenId) => {
      const resolvedScreen = screenId ?? currentScreen;

      if (!resolvedScreen) {
        return;
      }

      const content = screenHelpConfig[resolvedScreen];

      if (!content) {
        return;
      }

      setCurrentScreen(resolvedScreen);
      setModalContent(content);
      setModalMode("INFO");
      setModalVisible(true);
    },
    [currentScreen, screenHelpConfig]
  );

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const setScreenNavigator = useCallback((navigator: (screenId: HomeScreenId) => void) => {
    screenNavigatorRef.current = navigator;

    if (currentStep && isTutorialActive) {
      resumeTutorialNavigation(currentStep);
    }
  }, [currentStep, isTutorialActive, resumeTutorialNavigation]);

  const setStepAction = useCallback(
    (stepId: OnboardingStepId, action: (() => void | Promise<void>) | null) => {
      if (!action) {
        delete stepActionsRef.current[stepId];
        setStepActionVersion((currentVersion) => currentVersion + 1);
        return;
      }

      stepActionsRef.current[stepId] = action;
      setStepActionVersion((currentVersion) => currentVersion + 1);
    },
    []
  );

  const handleModalNext = useCallback(async () => {
    if (modalMode === "INFO") {
      setModalVisible(false);
      return;
    }

    if (!currentStep) {
      setModalVisible(false);
      return;
    }

    const stepId = currentStep;
    const stepConfig = tutorialStepsConfig[stepId];
    const stepAction = stepActionsRef.current[stepId];

    setModalVisible(false);

    if (stepConfig.completeOnNext !== false) {
      await completeStep(stepId);
      return;
    }

    if (stepAction) {
      await stepAction();
    } else if (stepConfig.targetScreen && screenNavigatorRef.current) {
      screenNavigatorRef.current(stepConfig.targetScreen);
    }
  }, [completeStep, currentStep, modalMode, tutorialStepsConfig]);

  const canShowHelp = currentScreen ? Boolean(screenHelpConfig[currentScreen]) : false;

  const contextValue = useMemo(
    () => ({
      currentStep,
      isTutorialActive,
      completedTutorial,
      isReady,
      currentScreen,
      canShowHelp,
      completeStep,
      syncTutorialState,
      registerScreen,
      openInfoForScreen,
      closeModal,
      handleModalNext,
      setScreenNavigator,
      setStepAction,
    }),
    [
      canShowHelp,
      closeModal,
      completeStep,
      completedTutorial,
      currentScreen,
      currentStep,
      handleModalNext,
      isReady,
      isTutorialActive,
      openInfoForScreen,
      registerScreen,
      setScreenNavigator,
      setStepAction,
      syncTutorialState,
    ]
  );

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
      <ContextualHelpModal
        visible={modalVisible}
        onClose={closeModal}
        onNext={() => {
          void handleModalNext();
        }}
        mode={modalMode}
        content={modalContent}
      />
    </OnboardingContext.Provider>
  );
};

export default OnboardingProvider;

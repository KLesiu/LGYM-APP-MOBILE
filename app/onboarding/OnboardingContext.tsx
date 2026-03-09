import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import type { HomeScreenId } from "../components/home/homeScreens";
import ContextualHelpModal, {
  type ContextualHelpMode,
} from "../components/onboarding/ContextualHelpModal";
import {
  getScreenHelpConfig,
  getTutorialStepsConfig,
  ONBOARDING_STORAGE_KEY,
  type ContextualHelpContent,
  type OnboardingScreenId,
  type OnboardingStepId,
} from "./tutorialStepsConfig";

interface StoredOnboardingState {
  currentStep: OnboardingStepId;
  isTutorialActive: boolean;
  completedTutorial: boolean;
}

interface OnboardingContextValue {
  currentStep: OnboardingStepId;
  isTutorialActive: boolean;
  completedTutorial: boolean;
  isReady: boolean;
  currentScreen: OnboardingScreenId | null;
  canShowHelp: boolean;
  completeStep: (stepId: OnboardingStepId) => Promise<void>;
  skipTutorial: () => Promise<void>;
  resetTutorial: () => Promise<void>;
  registerScreen: (screenId: OnboardingScreenId) => void;
  openInfoForScreen: (screenId?: OnboardingScreenId) => void;
  closeModal: () => void;
  handleModalNext: () => Promise<void>;
  setScreenNavigator: (navigator: (screenId: HomeScreenId) => void) => void;
  setStepAction: (stepId: OnboardingStepId, action: (() => void | Promise<void>) | null) => void;
}

const INITIAL_STEP: OnboardingStepId = "GYM_INTRO";

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

  const [currentStep, setCurrentStep] = useState<OnboardingStepId>(INITIAL_STEP);
  const [isTutorialActive, setIsTutorialActive] = useState<boolean>(false);
  const [completedTutorial, setCompletedTutorial] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<OnboardingScreenId | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ContextualHelpMode>("TUTORIAL");
  const [modalContent, setModalContent] = useState<ContextualHelpContent | null>(
    tutorialStepsConfig[INITIAL_STEP].content
  );
  const screenNavigatorRef = useRef<((screenId: HomeScreenId) => void) | null>(null);
  const stepActionsRef = useRef<
    Partial<Record<OnboardingStepId, () => void | Promise<void>>>
  >({});

  const persistState = useCallback(async (nextState: StoredOnboardingState) => {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(nextState));
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);

        if (storedValue) {
          const parsedState = JSON.parse(storedValue) as Partial<StoredOnboardingState>;
          setCurrentStep(parsedState.currentStep ?? INITIAL_STEP);
          setCompletedTutorial(parsedState.completedTutorial ?? false);
          setIsTutorialActive(parsedState.isTutorialActive ?? true);
        } else {
          const initialState: StoredOnboardingState = {
            currentStep: INITIAL_STEP,
            isTutorialActive: true,
            completedTutorial: false,
          };

          setCurrentStep(initialState.currentStep);
          setCompletedTutorial(initialState.completedTutorial);
          setIsTutorialActive(initialState.isTutorialActive);
          await persistState(initialState);
        }
      } catch {
        setCurrentStep(INITIAL_STEP);
        setCompletedTutorial(false);
        setIsTutorialActive(true);
      } finally {
        setIsReady(true);
      }
    };

    void bootstrap();
  }, [persistState]);

  useEffect(() => {
    if (!isReady || !isTutorialActive || !currentScreen) {
      return;
    }

    const stepConfig = tutorialStepsConfig[currentStep];

    if (stepConfig.triggerScreen === currentScreen) {
      setModalContent(stepConfig.content);
      setModalMode("TUTORIAL");
      setModalVisible(true);
    }
  }, [currentScreen, currentStep, isReady, isTutorialActive, tutorialStepsConfig]);

  const completeStep = useCallback(
    async (stepId: OnboardingStepId) => {
      const stepConfig = tutorialStepsConfig[stepId];
      const nextStep = stepConfig.nextStep;

      if (!nextStep) {
        setCompletedTutorial(true);
        setIsTutorialActive(false);
        await persistState({
          currentStep: stepId,
          isTutorialActive: false,
          completedTutorial: true,
        });
        return;
      }

      setCurrentStep(nextStep);
      await persistState({
        currentStep: nextStep,
        isTutorialActive: true,
        completedTutorial: false,
      });
    },
    [persistState, tutorialStepsConfig]
  );

  const skipTutorial = useCallback(async () => {
    setModalVisible(false);
    setIsTutorialActive(false);
    await persistState({
      currentStep,
      isTutorialActive: false,
      completedTutorial,
    });
  }, [completedTutorial, currentStep, persistState]);

  const resetTutorial = useCallback(async () => {
    setCurrentStep(INITIAL_STEP);
    setCurrentScreen(null);
    setCompletedTutorial(false);
    setIsTutorialActive(true);
    setModalMode("TUTORIAL");
    setModalContent(tutorialStepsConfig[INITIAL_STEP].content);
    setModalVisible(false);
    await persistState({
      currentStep: INITIAL_STEP,
      isTutorialActive: true,
      completedTutorial: false,
    });
  }, [persistState, tutorialStepsConfig]);

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
  }, []);

  const setStepAction = useCallback(
    (stepId: OnboardingStepId, action: (() => void | Promise<void>) | null) => {
      if (!action) {
        delete stepActionsRef.current[stepId];
        return;
      }

      stepActionsRef.current[stepId] = action;
    },
    []
  );

  const handleModalNext = useCallback(async () => {
    if (modalMode === "INFO") {
      setModalVisible(false);
      return;
    }

    const stepId = currentStep;
    const stepConfig = tutorialStepsConfig[stepId];
    const stepAction = stepActionsRef.current[stepId];

    setModalVisible(false);

    if (stepAction) {
      await stepAction();
    } else if (stepConfig.targetScreen && screenNavigatorRef.current) {
      screenNavigatorRef.current(stepConfig.targetScreen);
    }

    if (stepConfig.completeOnNext !== false) {
      await completeStep(stepId);
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
      skipTutorial,
      resetTutorial,
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
      resetTutorial,
      setScreenNavigator,
      setStepAction,
      skipTutorial,
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

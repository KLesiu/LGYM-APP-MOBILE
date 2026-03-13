import { View } from "react-native";
import React, { JSX, useCallback, useRef } from "react";
import { useState } from "react";
import Menu from "./components/layout/Menu";
import Header from "./components//layout/Header";
import Loading from "./components/elements/Loading";
import HomeProvider from "./components/home/HomeContext";
import Start from "./components/home/start/Start";
import { SafeAreaView } from "react-native-safe-area-context";
import Exercises from "./components/home/exercises/Exercises";
import Gym from "./components/home/gym/Gym";
import Training from "./components/home/training/Training";
import TrainingPlan from "./components/home/plan/TrainingPlan";
import History from "./components/home/history/History";
import Records from "./components/home/records/Records";
import Profile from "./components/home/profile/Profile";
import { DEFAULT_HOME_SCREEN, type HomeScreenId } from "./components/home/homeScreens";
import { useOnboarding } from "./onboarding/OnboardingContext";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { setScreenNavigator, canUserNavigateToScreen } = useOnboarding();
  const [currentScreen, setCurrentScreen] = useState<HomeScreenId>(DEFAULT_HOME_SCREEN);
  const [view, setView] = useState<JSX.Element>();
  const [isHeaderShow, setIsHeaderShow] = useState<boolean>(true);
  const lastBlockedToastAtRef = useRef<number>(0);
  const hasInitializedHomeScreenRef = useRef<boolean>(false);

  const changeView = useCallback((nextView?: JSX.Element) => {
    setCurrentScreen(DEFAULT_HOME_SCREEN);
    setView(nextView ?? <Start />);
  }, []);

  const buildScreen = useCallback(
    (screenId: HomeScreenId): JSX.Element => {
      switch (screenId) {
        case "EXERCISES":
          return <Exercises addExerciseToList={() => {}} />;
        case "GYM":
          return <Gym />;
        case "TRAINING":
          return <Training />;
        case "PLAN":
          return <TrainingPlan />;
        case "HISTORY":
          return <History />;
        case "RECORDS":
          return <Records />;
        case "PROFILE":
          return <Profile changeView={changeView} />;
        case "START":
        default:
          return <Start />;
      }
    },
    [changeView]
  );

  const navigateToScreen = useCallback(
    (screenId: HomeScreenId, options?: { force?: boolean; showBlockedToast?: boolean }) => {
      if (!options?.force && !canUserNavigateToScreen(screenId)) {
        if (options?.showBlockedToast) {
          const now = Date.now();
          if (now - lastBlockedToastAtRef.current > 1200) {
            lastBlockedToastAtRef.current = now;
            Toast.show({
              type: "success",
              text1: t("onboarding.tutorial.navigationLockedTitle"),
              text2: t("onboarding.tutorial.navigationLockedDescription"),
            });
          }
        }

        return;
      }

      setCurrentScreen(screenId);
      setView(buildScreen(screenId));
    },
    [buildScreen, canUserNavigateToScreen, t]
  );

  const changeHeaderVisibility = useCallback((isVisible: boolean) => {
    setIsHeaderShow(isVisible);
  }, []);

  useEffect(() => {
    if (hasInitializedHomeScreenRef.current) {
      return;
    }

    hasInitializedHomeScreenRef.current = true;
    navigateToScreen(DEFAULT_HOME_SCREEN, { force: true });
  }, [navigateToScreen]);

  useEffect(() => {
    setScreenNavigator((screenId) => {
      navigateToScreen(screenId, { force: true });
    });
  }, [navigateToScreen, setScreenNavigator]);

  return (
    <SafeAreaView className="bg-bgColor flex-1">
      <View className="bg-bgColor flex flex-col justify-between relative h-full ">
        <HomeProvider
          viewChange={changeView}
          navigateToScreen={navigateToScreen}
          changeHeaderVisibility={changeHeaderVisibility}
          currentScreen={currentScreen}
        >
          <Header viewChange={changeView} isHeaderShow={isHeaderShow} />
          {view}
          <Menu />
        </HomeProvider>
        {!view && <Loading />}
      </View>
    </SafeAreaView>
  );
};
export default Home;

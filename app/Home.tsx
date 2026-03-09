import { View } from "react-native";
import React, { JSX, useCallback } from "react";
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

const Home: React.FC = () => {
  const { setScreenNavigator } = useOnboarding();
  const [currentScreen, setCurrentScreen] = useState<HomeScreenId>(DEFAULT_HOME_SCREEN);
  const [view, setView] = useState<JSX.Element>();
  const [isHeaderShow, setIsHeaderShow] = useState<boolean>(true);

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
    (screenId: HomeScreenId) => {
      setCurrentScreen(screenId);
      setView(buildScreen(screenId));
    },
    [buildScreen]
  );

  const changeHeaderVisibility = useCallback((isVisible: boolean) => {
    setIsHeaderShow(isVisible);
  }, []);

  useEffect(() => {
    navigateToScreen(DEFAULT_HOME_SCREEN);
  }, [navigateToScreen]);

  useEffect(() => {
    setScreenNavigator(navigateToScreen);
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

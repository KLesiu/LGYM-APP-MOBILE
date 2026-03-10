import React, {
  JSX,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createContext } from "react";
import { Animated, BackHandler } from "react-native";
import { useAuthStore } from "../../../stores/useAuthStore";
import { DEFAULT_HOME_SCREEN, type HomeScreenId } from "./homeScreens";

interface HomeContextProps {
  toggleMenuButton: (hide: boolean) => void;
  isExpanded: boolean;
  animation: Animated.Value;
  isMenuButtonVisible: boolean;
  toggleMenu: () => void;
  hideMenu: () => void;
  changeView: (component?: JSX.Element) => void;
  navigateToScreen: (screenId: HomeScreenId) => void;
  currentScreen: HomeScreenId;
  userId: string;
  changeHeaderVisibility: (isVisible: boolean) => void;
}

const HomeContext = createContext<HomeContextProps | null>(null);

export const useHomeContext = (): HomeContextProps => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHomeContext must be used within HomeProvider");
  }
  return context;
};

interface HomeProviderProps {
  children: React.ReactNode;
  viewChange: (view?: JSX.Element) => void;
  navigateToScreen: (screenId: HomeScreenId) => void;
  changeHeaderVisibility: (isVisible: boolean) => void;
  currentScreen: HomeScreenId;
}

const HomeProvider: React.FC<HomeProviderProps> = ({
  children,
  viewChange,
  navigateToScreen,
  changeHeaderVisibility,
  currentScreen,
}) => {
  const { user } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true);
  const userId = user?._id || "";
  const animation = useRef(new Animated.Value(0)).current;


  const toggleMenu = useCallback(() => {
    setIsExpanded((prev) => {
      const newState = !prev;
      Animated.timing(animation, {
        toValue: newState ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      return newState;
    });
  }, [animation]);

  const hideMenu = useCallback(() => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(false);
  }, [animation]);

  const toggleMenuButton = useCallback((hide: boolean) => {
    setIsMenuButtonVisible(!hide);
  }, []);

  const handleBackButton = useCallback(() => {
    navigateToScreen(DEFAULT_HOME_SCREEN);
    toggleMenuButton(false);
    return true;
  }, [navigateToScreen, toggleMenuButton]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );
    return () => {
      backHandler.remove();
    };
  }, [handleBackButton]);

  const changeView = useCallback(
    (component?: React.JSX.Element) => {
      if (isExpanded) toggleMenu();
      viewChange(component);
    },
    [isExpanded, toggleMenu, viewChange]
  );
  const contextValue = useMemo(
    () => ({
      isExpanded,
      animation,
      toggleMenu,
      toggleMenuButton,
      isMenuButtonVisible,
      changeView,
      navigateToScreen,
      currentScreen,
      hideMenu,
      userId,
      changeHeaderVisibility,
    }),
    [
      isExpanded,
      animation,
      toggleMenu,
      toggleMenuButton,
      isMenuButtonVisible,
      changeView,
      navigateToScreen,
      currentScreen,
      hideMenu,
      userId,
      changeHeaderVisibility,
    ]
  );

  return (
    <HomeContext.Provider value={contextValue}>
      {children}
    </HomeContext.Provider>
  );
};

export default HomeProvider;

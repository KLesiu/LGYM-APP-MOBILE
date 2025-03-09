import React, { useCallback, useContext, useRef, useState } from "react";
import { createContext } from "react";
import { Animated } from "react-native";

interface HomeContextProps {
  toggleMenuButton: (hide: boolean) => void;
  isExpanded: boolean;
  animation: Animated.Value;
  isMenuButtonVisible: boolean;
  toggleMenu: () => void;
  hideMenu: () => void;
  changeView: (component: React.JSX.Element) => void;
  apiURL: string;
}

const HomeContext = createContext<HomeContextProps | null>(null);

export const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHomeContext must be used within HomeProvider");
  }
  return context;
};

interface HomeProviderProps {
  children: React.ReactNode;
  viewChange: (view: JSX.Element) => void;
}

const HomeProvider: React.FC<HomeProviderProps> = ({ children, viewChange }) => {
  const apiURL = process.env.REACT_APP_BACKEND || "";
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true);
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
    setIsExpanded(false);
  },[])

  const toggleMenuButton = useCallback(
    (hide:boolean) => {
      setIsMenuButtonVisible(!hide);
    },
    [isExpanded, toggleMenu]
  );

  const changeView = useCallback(
    (component: React.JSX.Element) => {
      if (isExpanded) toggleMenu(); 
      viewChange(component);
    },
    [isExpanded, toggleMenu, viewChange]
  );

  return (
    <HomeContext.Provider
      value={{
        isExpanded,
        animation,
        toggleMenu,
        toggleMenuButton,
        isMenuButtonVisible,
        changeView,
        apiURL,
        hideMenu
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export default HomeProvider;

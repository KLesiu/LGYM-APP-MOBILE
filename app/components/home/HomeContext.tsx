import React, { useContext, useRef, useState } from "react";
import { createContext } from "react";
import { Animated } from "react-native";

interface HomeContext {
  toggleMenuButton: (hide: boolean) => void;
  viewChange: (view: JSX.Element) => void;
  isExpanded: boolean;
  animation: Animated.Value;
  setIsExpanded: (isExpanded: boolean) => void;
  setIsMenuButtonVisible: (isMenuButtonVisible: boolean) => void;
  isMenuButtonVisible: boolean;
  toggleMenu: () => void;
  changeView: (component: React.JSX.Element) => void;
  apiURL: string;
}

const HomeContext = createContext<HomeContext | null>(null);

export const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useMenuContext must be used within HomeProvider");
  }
  return context;
};

interface HomeProviderProps {
  children: React.ReactNode;
  viewChange: (view: JSX.Element) => void;
}

const HomeProvider: React.FC<HomeProviderProps> = ({
  children,
  viewChange,
}) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenuButton = (hide: boolean) => {
    toggleMenu();
    setIsMenuButtonVisible(!hide);
  };

  const toggleMenu = () => {
    if (isExpanded) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsExpanded(false));
    } else {
      setIsExpanded(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const changeView = (component: React.JSX.Element) => {
    toggleMenu();
    viewChange(component);
  };
  return (
    <HomeContext.Provider
      value={{
        viewChange,
        isExpanded,
        setIsExpanded,
        animation,
        toggleMenu,
        toggleMenuButton,
        isMenuButtonVisible,
        setIsMenuButtonVisible,
        changeView,
        apiURL
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export default HomeProvider;

import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { createContext } from "react";
import { Animated, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HomeContextProps {
  toggleMenuButton: (hide: boolean) => void;
  isExpanded: boolean;
  animation: Animated.Value;
  isMenuButtonVisible: boolean;
  toggleMenu: () => void;
  hideMenu: () => void;
  changeView: (component: React.JSX.Element) => void;
  apiURL: string;
  userId:string;
  changeHeaderVisibility: (isVisible: boolean) => void;
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
  viewChange: (view?: JSX.Element) => void;
  changeHeaderVisibility: (isVisible: boolean) => void;
}

const HomeProvider: React.FC<HomeProviderProps> = ({ children, viewChange,changeHeaderVisibility }) => {
  const apiURL = process.env.REACT_APP_BACKEND || "";
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true);
  const [userId,setUserId] = useState<string>("");
  const animation = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => { 
    getUserId();
  },[])



  const handleBackButton = useCallback(()=>{
    changeView();
    toggleMenuButton(false)
    return true;
  },[])

  const getUserId = useCallback(async () => {
    const id = await AsyncStorage.getItem("id");
    if(id){
      setUserId(id);
    }
  },[])


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
    (component?: React.JSX.Element) => {
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
        hideMenu,
        userId,
        changeHeaderVisibility
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export default HomeProvider;

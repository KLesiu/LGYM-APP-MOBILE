import React, {
  JSX,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createContext } from "react";
import { Animated, BackHandler } from "react-native";
import { useAppContext } from "../../AppContext";

interface HomeContextProps {
  toggleMenuButton: (hide: boolean) => void;
  isExpanded: boolean;
  animation: Animated.Value;
  isMenuButtonVisible: boolean;
  toggleMenu: () => void;
  hideMenu: () => void;
  changeView: (component?: JSX.Element) => void;
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
  changeHeaderVisibility: (isVisible: boolean) => void;
}

const HomeProvider: React.FC<HomeProviderProps> = ({
  children,
  viewChange,
  changeHeaderVisibility,
}) => {
  const {userInfo} = useAppContext()
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true);
  const [userId, setUserId] = useState<string>("");
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

  useEffect(()=>{
    if(userInfo){
      setUserId(userInfo._id)
    }
  },[userInfo])

  const handleBackButton = useCallback(() => {
    changeView();
    toggleMenuButton(false);
    return true;
  }, []);

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

  const hideMenu =() => {
    setIsExpanded(false);
  };

  const toggleMenuButton = useCallback((hide: boolean) => {
    setIsMenuButtonVisible(!hide);
  }, []);

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
        hideMenu,
        userId,
        changeHeaderVisibility,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export default HomeProvider;

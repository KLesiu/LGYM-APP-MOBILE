import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Image, Text, Animated } from "react-native";
import TrainingPlan from "../home/plan/TrainingPlan";
import History from "../home/history/History";
import AddTraining from "../home/training/AddTraining";
import Profile from "../home/profile/Profile";
import Start from "../home/start/Start";
import Exercises from "../home/exercises/Exercises";
import Gym from "../home/gym/Gym";
import Charts from "../home/charts/Charts";


import HomeIcon from "./../../img/icons/homeIcon.svg";
import ProfileIcon from "./../../img/icons/profileIcon.svg";
import HistoryIcon from "./../../img/icons/calendarIcon.svg";
import AddTrainingIcon from "./../../img/icons/plusCircleIcon.svg";
import ExerciseIcon from "./../../img/icons/exercisesIcon.svg";
import PlanIcon from "./../../img/icons/planIcon.svg";
import GymIcon from "./../../img/icons/gymIcon.svg";
import MenuIcon from "./../../img/icons/menuIcon.svg";
import ChartIcon from "./../../img/icons/chartsIcon.svg";

interface MenuProps {
  viewChange: (view: JSX.Element) => void;
}

const Menu: React.FC<MenuProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    props.viewChange(<Start viewChange={props.viewChange} toggleMenuButton={toggleMenuButton} />);
  }, []);

  const toggleMenu = () => {
    if (isExpanded) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsExpanded(false)); // Ukrywamy menu po zakończeniu animacji
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
    props.viewChange(component);
  };

  const toggleMenuButton = (hide: boolean) => {
    toggleMenu();
    setIsMenuButtonVisible(!hide);
  };

  const animatedScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const items = [
    { icon: <HomeIcon/>, label: "Home", component: <Start viewChange={props.viewChange} toggleMenuButton={toggleMenuButton} /> },
    { icon: <ExerciseIcon/>, label: "Exercises", component: <Exercises  toggleMenuButton={toggleMenuButton} /> },
    { icon: <GymIcon />, label: "Gym", component: <Gym viewChange={props.viewChange} toggleMenuButton={toggleMenuButton} /> },
    { icon: <AddTrainingIcon />, label: "Training", component: <AddTraining toggleMenuButton={toggleMenuButton} /> },
    { icon: <PlanIcon />, label: "Plan", component: <TrainingPlan hideMenuButton={toggleMenuButton} /> },
    { icon: <HistoryIcon />, label: "History", component: <History /> },
    { icon: <ChartIcon />, label: "Charts", component: <Charts  toggleMenuButton={toggleMenuButton} /> },
    { icon: <ProfileIcon />, label: "Profile", component: <Profile viewChange={props.viewChange} toggleMenuButton={toggleMenuButton} /> },
  ];

  return isMenuButtonVisible ? (
    <View className="flex items-center justify-end bg-bgColor relative w-full">
      {isExpanded && (
        <Animated.View
          style={{
            transform: [{ scale: animatedScale }],
            opacity: animatedOpacity,
          }}
          className="absolute items-center justify-center bottom-[-65px]"
          pointerEvents={isExpanded ? "auto" : "none"} 
        >
          <View style={{ borderRadius: 10000 }} className="relative w-[450px] h-[440px] items-center justify-center bg-[#282424db] -mb-[82px]">
            {items.map((item, index) => {
              const totalItems = items.length;
              const angle = (index / (totalItems - 1)) * Math.PI + Math.PI / 2;
              const x = -Math.sin(angle) * 160;
              const y = Math.cos(angle) * 180;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => changeView(item.component)}
                  style={{ transform: [{ translateX: x }, { translateY: y }], borderRadius: 10000 }}
                  className="absolute w-20 h-20 items-center justify-center bg-bgColor p-1"
                >
                  {item.icon}
                  <Text className="text-gray-400 text-sm font-light">{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      )}

      <TouchableOpacity
        onPress={toggleMenu}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: [{ translateX: -32 }],
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: "#94e798",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9,
        }}
      >
        <MenuIcon />
      </TouchableOpacity>
    </View>
  ) : null;
};

export default Menu;

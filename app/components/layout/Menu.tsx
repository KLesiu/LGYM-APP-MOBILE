import React, { useState, useRef, useEffect,createContext, useMemo } from "react";
import { View, TouchableOpacity, Image, Text, Animated } from "react-native";
import TrainingPlan from "../home/plan/TrainingPlan";
import History from "../home/history/History";
import AddTraining from "../home/training/Training";
import Profile from "../home/profile/Profile";
import Start from "../home/start/Start";
import Exercises from "../home/exercises/Exercises";
import Gym from "../home/gym/Gym";
import Charts from "../home/charts/Charts";
import HomeIcon from "./../../../img/icons/homeIcon.svg";
import ProfileIcon from "./../../../img/icons/profileIcon.svg";
import HistoryIcon from "./../../../img/icons/calendarIcon.svg";
import AddTrainingIcon from "./../../../img/icons/plusCircleIcon.svg";
import ExerciseIcon from "./../../../img/icons/exercisesIcon.svg";
import PlanIcon from "./../../../img/icons/planIcon.svg";
import GymIcon from "./../../../img/icons/gymIcon.svg";
import MenuIcon from "./../../../img/icons/menuIcon.svg";
import ChartIcon from "./../../../img/icons/chartsIcon.svg";
import { useHomeContext } from "../home/HomeContext";
import { Dimensions } from 'react-native';


const Menu: React.FC = () => {
  const {isExpanded,isMenuButtonVisible,animation,changeView,toggleMenu} = useHomeContext()
  const { width } = Dimensions.get('window');


  useEffect(() => {
    changeView(<Start  />);
  }, []);

  const animatedScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const items = [
    { icon: <HomeIcon />, label: "Home", component: <Start/> },
    { icon: <ExerciseIcon/>, label: "Exercises", component: <Exercises/> },
    { icon: <GymIcon />, label: "Gym", component: <Gym /> },
    { icon: <AddTrainingIcon />, label: "Training", component: <AddTraining/> },
    { icon: <PlanIcon />, label: "Plan", component: <TrainingPlan /> },
    { icon: <HistoryIcon />, label: "History", component: <History /> },
    { icon: <ChartIcon />, label: "Charts", component: <Charts/> },
    { icon: <ProfileIcon />, label: "Profile", component: <Profile/> },
  ];

  const returnProperties = useMemo(()=>{
    if(width <= 360)return {xMultiplier:140,yMultiplier:160}
    return {xMultiplier:160,yMultiplier:180}
  },[width])

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
          <View style={{ borderRadius: 10000 }} className="relative w-[450px] smallPhone:w-[400px] h-[440px] smallPhone:h-[380px] items-center justify-center bg-[#282424db] -mb-[82px] ">
            {items.map((item, index) => {
              const totalItems = items.length;
              const angle = (index / (totalItems - 1)) * Math.PI + Math.PI / 2;
              const {xMultiplier,yMultiplier} = returnProperties;
              const X = -Math.sin(angle) * xMultiplier;
              const Y = Math.cos(angle) * yMultiplier;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => changeView(item.component)}
                  style={{ transform: [{ translateX: X }, { translateY: Y }], borderRadius: 10000 }}
                  className="absolute w-20 h-20 smallPhone:w-16 smallPhone:h-16 items-center justify-center bg-bgColor p-1 smallPhone:p-0"
                >
                  {item.icon}
                  <Text className="text-gray-400 text-sm smallPhone:text-xs font-light">{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      )}

      <TouchableOpacity
        onPress={toggleMenu}
        className="bg-primaryColor rounded-full absolute bottom-8 left-1/2 transform -translate-x-8 w-16 h-16 items-center justify-center z-10"
      >
        <MenuIcon />
      </TouchableOpacity>
    </View>
  ) : null;
};

export default Menu;

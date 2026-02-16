import React, { useEffect, useMemo } from "react";
import { View, TouchableOpacity, Text, Animated, useWindowDimensions } from "react-native";
import TrainingPlan from "../home/plan/TrainingPlan";
import History from "../home/history/History";
import AddTraining from "../home/training/Training";
import Profile from "../home/profile/Profile";
import Start from "../home/start/Start";
import Exercises from "../home/exercises/Exercises";
import Gym from "../home/gym/Gym";
import HomeIcon from "./../../../img/icons/homeIcon.svg";
import ProfileIcon from "./../../../img/icons/profileIcon.svg";
import HistoryIcon from "./../../../img/icons/calendarIcon.svg";
import AddTrainingIcon from "./../../../img/icons/plusCircleIcon.svg";
import ExerciseIcon from "./../../../img/icons/exercisesIcon.svg";
import PlanIcon from "./../../../img/icons/planIcon.svg";
import GymIcon from "./../../../img/icons/gymIcon.svg";
import RecordIcon from "./../../../img/icons/recordsIcon.svg";
import MenuIcon from "./../../../img/icons/menuIcon.svg";
import { useHomeContext } from "../home/HomeContext";
import Records from "../home/records/Records";
import { useTranslation } from "react-i18next";

const Menu: React.FC = () => {
  const { t } = useTranslation();
  const {
    isExpanded,
    isMenuButtonVisible,
    animation,
    changeView,
    toggleMenu,
  } = useHomeContext();
  const { width } = useWindowDimensions();

  useEffect(() => {
    changeView(<Start />);
  }, []);

  const animatedScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const menuConfig = useMemo(() => {
    if (width <= 360) return { xMultiplier: 140, yMultiplier: 160 };
    return { xMultiplier: 160, yMultiplier: 180 };
  }, [width]);

  const menuItems = useMemo(() => {
    const items = [
      { icon: <HomeIcon />, label: t("menu.home"), component: <Start /> },
      { 
        icon: <ExerciseIcon />, 
        label: t("menu.exercises"), 
        component: <Exercises addExerciseToList={() => {}} /> 
      },
      { icon: <GymIcon />, label: t("menu.gym"), component: <Gym /> },
      {
        icon: <AddTrainingIcon />,
        label: t("menu.training"),
        component: <AddTraining />,
      },
      { icon: <PlanIcon />, label: t("menu.plan"), component: <TrainingPlan /> },
      { icon: <HistoryIcon />, label: t("menu.history"), component: <History /> },
      { icon: <RecordIcon />, label: t("menu.records"), component: <Records /> },
      {
        icon: <ProfileIcon />,
        label: t("menu.profile"),
        component: <Profile changeView={changeView} />,
      },
    ];

    const totalItems = items.length;
    const { xMultiplier, yMultiplier } = menuConfig;

    return items.map((item, index) => {
      const angle = (index / (totalItems - 1)) * Math.PI + Math.PI / 2;
      const x = -Math.sin(angle) * xMultiplier;
      const y = Math.cos(angle) * yMultiplier;
      return { ...item, x, y };
    });
  }, [menuConfig, changeView, t]);

  if (!isMenuButtonVisible) return null;

  return (
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
          <View
            style={{ borderRadius: 10000 }}
            className="relative w-[450px] smallPhone:w-[400px] h-[440px] smallPhone:h-[380px] items-center justify-center bg-[#282424db] -mb-[82px] "
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => changeView(item.component)}
                style={{
                  transform: [{ translateX: item.x }, { translateY: item.y }],
                  borderRadius: 10000,
                }}
                className="absolute w-20 h-20 smallPhone:w-16 smallPhone:h-16 items-center justify-center bg-bgColor p-1 smallPhone:p-0"
              >
                {item.icon}
                <Text className="text-gray-400 text-sm smallPhone:text-xs font-light">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
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
  );
};

export default Menu;

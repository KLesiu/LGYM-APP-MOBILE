import React, { useCallback, useMemo } from "react";
import { View, TouchableOpacity, Text, Animated, useWindowDimensions, ScrollView } from "react-native";
import HomeIcon from "./../../../img/icons/homeIcon.svg";
import ProfileIcon from "./../../../img/icons/profileIcon.svg";
import HistoryIcon from "./../../../img/icons/calendarIcon.svg";
import AddTrainingIcon from "./../../../img/icons/plusCircleIcon.svg";
import ExerciseIcon from "./../../../img/icons/exercisesIcon.svg";
import PlanIcon from "./../../../img/icons/planIcon.svg";
import GymIcon from "./../../../img/icons/gymIcon.svg";
import RecordIcon from "./../../../img/icons/recordsIcon.svg";
import ChartsIcon from "./../../../img/icons/chartsIcon.svg";
import MenuIcon from "./../../../img/icons/menuIcon.svg";
import { useHomeContext } from "../home/HomeContext";
import { useTranslation } from "react-i18next";
import { DEFAULT_HOME_SCREEN, type HomeScreenId } from "../home/homeScreens";

const Menu: React.FC = () => {
  const { t } = useTranslation();
  const {
    isExpanded,
    isMenuButtonVisible,
    animation,
    navigateToScreen,
    toggleMenu,
    hideMenu,
  } = useHomeContext();
  const { width } = useWindowDimensions();

  const animatedScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const menuConfig = useMemo(() => {
    if (width <= 360) return { itemWidth: (width - 72) / 2 };
    if (width <= 420) return { itemWidth: (width - 88) / 3 };
    return { itemWidth: 110 };
  }, [width]);

  const menuItems = useMemo(() => {
    const items = [
      { icon: <HomeIcon />, label: t("menu.home"), screenId: DEFAULT_HOME_SCREEN },
      { 
        icon: <ExerciseIcon />, 
        label: t("menu.exercises"), 
        screenId: "EXERCISES" as HomeScreenId,
      },
      { icon: <GymIcon />, label: t("menu.gym"), screenId: "GYM" as HomeScreenId },
      {
        icon: <AddTrainingIcon />,
        label: t("menu.training"),
        screenId: "TRAINING" as HomeScreenId,
      },
      { icon: <PlanIcon />, label: t("menu.plan"), screenId: "PLAN" as HomeScreenId },
      {
        icon: <HistoryIcon color="white" />,
        label: t("menu.history"),
        screenId: "HISTORY" as HomeScreenId,
      },
      {
        icon: <ChartsIcon />,
        label: t("menu.measurements"),
        screenId: "MEASUREMENTS" as HomeScreenId,
      },
      { icon: <RecordIcon />, label: t("menu.records"), screenId: "RECORDS" as HomeScreenId },
      {
        icon: <ProfileIcon />,
        label: t("menu.profile"),
        screenId: "PROFILE" as HomeScreenId,
      },
      {
        icon: <ProfileIcon />,
        label: t("menu.trainer"),
        screenId: "TRAINER" as HomeScreenId,
      },
    ];

    return items;
  }, [menuConfig, t]);

  const handleMenuItemPress = useCallback(
    (screenId: HomeScreenId) => {
      hideMenu();
      navigateToScreen(screenId, { showBlockedToast: true });
    },
    [hideMenu, navigateToScreen]
  );

  if (!isMenuButtonVisible) return null;

  return (
    <View className="flex items-center justify-end bg-bgColor relative w-full">
      {isExpanded && (
        <Animated.View
          style={{
            transform: [{ scale: animatedScale }],
            opacity: animatedOpacity,
          }}
          className="absolute bottom-24 left-4 right-4"
          pointerEvents={isExpanded ? "auto" : "none"}
        >
          <View
            style={{ borderRadius: 24 }}
            className="bg-[#282424f2] px-4 py-5 border border-[#3a3a3a]"
          >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              <View className="flex-row flex-wrap justify-center" style={{ gap: 12 }}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleMenuItemPress(item.screenId)}
                    style={{
                      borderRadius: 18,
                      width: menuConfig.itemWidth,
                      minHeight: width <= 360 ? 82 : 90,
                    }}
                    className="items-center justify-center bg-bgColor px-2 py-3"
                  >
                    <View className="mb-2">{item.icon}</View>
                    <Text className="text-gray-400 text-center text-sm smallPhone:text-xs font-light">
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
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

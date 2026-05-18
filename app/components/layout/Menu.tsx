import React, { useCallback, useMemo } from 'react';
import { View, TouchableOpacity, Text, Animated, useWindowDimensions } from 'react-native';
import HomeIcon from './../../../img/icons/homeIcon.svg';
import ProfileIcon from './../../../img/icons/profileIcon.svg';
import HistoryIcon from './../../../img/icons/calendarIcon.svg';
import AddTrainingIcon from './../../../img/icons/plusCircleIcon.svg';
import ExerciseIcon from './../../../img/icons/exercisesIcon.svg';
import PlanIcon from './../../../img/icons/planIcon.svg';
import GymIcon from './../../../img/icons/gymIcon.svg';
import RecordIcon from './../../../img/icons/recordsIcon.svg';
import MenuIcon from './../../../img/icons/menuIcon.svg';
import { useHomeContext } from '../home/HomeContext';
import { useTranslation } from 'react-i18next';
import { DEFAULT_HOME_SCREEN, type HomeScreenId } from '../home/homeScreens';

const Menu: React.FC = () => {
  const { t } = useTranslation();
  const { isExpanded, isMenuButtonVisible, animation, navigateToScreen, toggleMenu, hideMenu } =
    useHomeContext();
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
    if (width <= 360) return { xMultiplier: 140, yMultiplier: 160 };
    return { xMultiplier: 160, yMultiplier: 180 };
  }, [width]);

  const menuItems = useMemo(() => {
    const items = [
      { icon: <HomeIcon />, label: t('menu.home'), screenId: DEFAULT_HOME_SCREEN },
      {
        icon: <ExerciseIcon />,
        label: t('menu.exercises'),
        screenId: 'EXERCISES' as HomeScreenId,
      },
      { icon: <GymIcon />, label: t('menu.gym'), screenId: 'GYM' as HomeScreenId },
      {
        icon: <AddTrainingIcon />,
        label: t('menu.training'),
        screenId: 'TRAINING' as HomeScreenId,
      },
      { icon: <PlanIcon />, label: t('menu.plan'), screenId: 'PLAN' as HomeScreenId },
      {
        icon: <HistoryIcon color="white" />,
        label: t('menu.history'),
        screenId: 'HISTORY' as HomeScreenId,
      },
      { icon: <RecordIcon />, label: t('menu.records'), screenId: 'RECORDS' as HomeScreenId },
      {
        icon: <ProfileIcon />,
        label: t('menu.profile'),
        screenId: 'PROFILE' as HomeScreenId,
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
  }, [menuConfig, t]);

  const handleMenuItemPress = useCallback(
    (screenId: HomeScreenId) => {
      hideMenu();
      navigateToScreen(screenId, { showBlockedToast: true });
    },
    [hideMenu, navigateToScreen],
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
          className="absolute items-center justify-center bottom-[-65px]"
          pointerEvents={isExpanded ? 'auto' : 'none'}
        >
          <View
            style={{ borderRadius: 10000 }}
            className="relative w-[450px] smallPhone:w-[400px] h-[440px] smallPhone:h-[380px] items-center justify-center bg-[#282424db] -mb-[82px] "
          >
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.screenId}
                onPress={() => handleMenuItemPress(item.screenId)}
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

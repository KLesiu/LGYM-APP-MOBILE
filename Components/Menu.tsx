import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Image, Text, Animated } from 'react-native';
import MenuProps from './props/MenuProps';
import TrainingPlan from './TrainingPlan';
import History from './History';
import AddTraining from './AddTraining';
import Profile from './Profile';
import Start from './Start';
import Exercises from './Exercises';
import home from './img/icons/home.png';
import profile from './img/icons/profile.png';
import history from './img/icons/history.png';
import addTraining from './img/icons/add.png';
import exercise from './img/icons/exercises.png';
import plan from './img/icons/plan.png';
import menu from './img/icons/menu.png';

const Menu: React.FC<MenuProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const animatedScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const animatedOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });
  const changeView = (component:React.JSX.Element)=>{
    toggleMenu()
    props.viewChange(component);
  }
  const items = [
    { icon: addTraining, label: 'Training', component: <AddTraining /> },
    { icon: exercise, label: 'Exercises', component: <Exercises viewChange={props.viewChange} /> },
    { icon: plan, label: 'Plan', component: <TrainingPlan /> },
    { icon: history, label: 'History', component: <History trainingsDates={[]} /> },
    { icon: home, label: 'Home', component: <Start viewChange={props.viewChange} /> },
    { icon: profile, label: 'Profile', component: <Profile /> },
  ];

  return (
    <View className="flex items-center justify-end bg-[#131313] relative w-full">
      {/* Animated Menu Items */}
      <Animated.View
        style={[
          {
            transform: [{ scale: animatedScale }],
            opacity: animatedOpacity
          }
        ]}
        className="absolute items-center justify-center bottom-24 -right-8"
      >
        <View className="relative w-52 h-32 items-center justify-center">
          {items.map((item, index) => {
            // Calculate angle and position for semi-circle
            const angle = (index / (items.length - 1)) * Math.PI; // Distribute items in a semi-circle
            const radius = 120; // Distance from the center
            const x = -Math.sin(angle) * radius; // Adjust distance from center
            const y = -Math.cos(angle) * radius; // Adjust distance from center

            return (
              <TouchableOpacity
                key={index}
                onPress={() => changeView(item.component)}
                style={{ transform: [{ translateX: x }, { translateY: y }] }}
                className="absolute w-12 h-12 items-center  justify-center"
              >
                <Image source={item.icon} className="w-8 h-8" />
                <Text className="text-gray-400 text-base font-light">{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* Main Menu Button */}
      <TouchableOpacity
        onPress={toggleMenu}
        className="absolute right-8 bottom-[132px] w-16 h-16 rounded-full bg-[#4CD964] items-center justify-center z-[9]"
      >
        <Image source={menu}  />
      </TouchableOpacity>
    </View>
  );
};

export default Menu;

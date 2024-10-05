import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Image, Text, Animated } from "react-native";
import MenuProps from "./props/MenuProps";
import TrainingPlan from "./TrainingPlan";
import History from "./History";
import AddTraining from "./AddTraining";
import Profile from "./Profile";
import Start from "./Start";
import Exercises from "./Exercises";
import home from "./img/icons/home.png";
import profile from "./img/icons/profile.png";
import history from "./img/icons/history.png";
import addTraining from "./img/icons/add.png";
import exercise from "./img/icons/exercises.png";
import plan from "./img/icons/plan.png";
import menu from "./img/icons/menu.png";

const Menu: React.FC<MenuProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true); 
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

  const changeView = (component: React.JSX.Element) => {
    toggleMenu();
    props.viewChange(component);
  };
  const toggleMenuButton =(hide:boolean)=>{
    if(hide)setIsMenuButtonVisible(false)
    else setIsMenuButtonVisible(true)
  }

  const items = [
    { icon: addTraining, label: "Training", component: <AddTraining toggleMenuButton={toggleMenuButton} /> },
    {
      icon: exercise,
      label: "Exercises",
      component: <Exercises viewChange={props.viewChange} />,
    },
    { icon: plan, label: "Plan", component: <TrainingPlan hideMenuButton={toggleMenuButton} /> },
    {
      icon: history,
      label: "History",
      component: <History trainingsDates={[]} />,
    },
    {
      icon: home,
      label: "Home",
      component: <Start viewChange={props.viewChange} />,
    },
    { icon: profile, label: "Profile", component: <Profile /> },
  ];

  return (
    <View className="flex items-center justify-end bg-[#131313] relative w-full">
      {/* Animated Menu Items */}
      <Animated.View
        style={[
          {
            transform: [{ scale: animatedScale }],
            opacity: animatedOpacity,
          },
        ]}
        className="absolute items-center justify-center bottom-[-65px]"
      >
        <View className="relative w-52 h-52 items-center justify-center">
          {items.map((item, index) => {
           const totalItems = items.length;
           const angle = (index / (totalItems - 1)) * Math.PI + Math.PI / 2; // Rozkład od -π/2 do π/2 (od lewej do prawej)
           const radius = 120; // Odległość od środka
           const x = -Math.sin(angle) * radius; // Odwrócenie położenia X (od lewej do prawej)
           const y = Math.cos(angle) * radius; // Odwrócenie położenia Y

            return (
              <TouchableOpacity
                key={index}
                onPress={() => changeView(item.component)}
                style={{ transform: [{ translateX: x }, { translateY: y }] }}
                className="absolute w-12 h-12 items-center justify-center"
              >
                <Image source={item.icon} className="w-8 h-8" />
                <Text className="text-gray-400 text-base font-light">
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

        
      {isMenuButtonVisible ?
      <TouchableOpacity
        onPress={toggleMenu}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: [{ translateX: -32 }], // Center horizontally (half of width: 64/2)
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: "#94e798",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9,
        }}
      >
        <Image source={menu} />
      </TouchableOpacity> : <></>}
    </View>
  );
};

export default Menu;

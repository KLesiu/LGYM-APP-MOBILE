import React, { useState, useRef, useEffect } from "react";
import { View, Text } from "react-native";
import ClockIcon from "./../../../../../../img/icons/clockIcon.svg";
import CustomButton, { ButtonStyle } from "../../../../elements/CustomButton";

const TrainingPlanDayTimer: React.FC = () => {
  const [timerCount, setTimerCount] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleTimerAction = () => {
    if (isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setTimerCount(0);
      setIsRunning(false);
    } else {
      intervalRef.current = setInterval(() => {
        setTimerCount((prevCount) => prevCount + 1);
      }, 1000);
      setIsRunning(true);
    }
  };

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <View className="flex flex-row justify-between items-center flex-1">
      <CustomButton
        text={isRunning ? "Finish pause" : "Start pause"}
        onPress={handleTimerAction}
        buttonStyleType={ButtonStyle.grey}
      />
      <View className="flex flex-row items-end h-full" style={{ gap: 4 }}>
        <ClockIcon />
        <Text
          className="text-textColor"
          style={{ fontFamily: "OpenSans_400Regular" }}
        >
          {formatTime(timerCount)}
        </Text>
      </View>
    </View>
  );
};

export default TrainingPlanDayTimer;
import React from "react";
import { View } from "react-native";
interface ProgressBarProps {
  width: number;
}

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  return (
    <View
      style={{ borderRadius: 8 }}
      className="w-28 h-6 smallPhone:h-3 border-primaryColor border-4 smallPhone:border-2 p-1 smallPhone:p-0.5 "
    >
      <View
        className="w-full h-full bg-white"
        style={{ width: `${props.width}%` }}
      ></View>
    </View>
  );
};

export default ProgressBar;

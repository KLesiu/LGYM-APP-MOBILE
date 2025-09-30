import React from "react";
import { View } from "react-native";

interface BackgroundMainSectionProps {
    children?: React.ReactNode;
}

const BackgroundMainSection: React.FC<BackgroundMainSectionProps> = ({ children }) => {
  return <View className="relative flex flex-1 bg-bgColor">{children}</View>;
};


export default BackgroundMainSection
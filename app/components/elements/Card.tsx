import { Pressable, View } from "react-native";
import ViewLoading from "./ViewLoading";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  customClasses?: string;
  isLoading?: boolean;
}

const Card: React.FC<CardProps> = ({ children, onPress, customClasses = "" ,isLoading}) => {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      className={`w-full bg-[#141414] flex flex-row p-4 smallPhone:p-3 rounded-lg justify-between items-start border border-thirdColor ${customClasses}`}
      style={{ gap: 20 }}
      {...(onPress && { onPress })}
    >
      {isLoading ? <ViewLoading /> : children}
    </Container>
  );
};

export default Card;

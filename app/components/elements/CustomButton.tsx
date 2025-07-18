import { Pressable, Text, View } from "react-native";
import { FontWeights } from "../../../enums/FontsProperties";
import React from "react";
import ViewLoading from "./ViewLoading";
import MiniLoading from "./MiniLoading";
import Loading from "./Loading";

export enum ButtonStyle {
  success = "bg-primaryColor",
  cancel = "bg-[#3f3f3f]",
  outline = "border-primaryColor border-[1px]",
  outlineBlack = "border-fifthColor border-[1px]",
  grey = "bg-[#282828]",
  default = "bg-white",
  none = "bg-transparent",
}
export enum ButtonSize {
  none = "p-0",
  small = "py-2 px-1",
  regular = "py-4 px-2 smallPhone:py-2 smallPhone:px-1",
  xl = "py-6 px-4 smallPhone:py-4 smallPhone:px-2 ",
  xxl = "py-8 px-6",
  long = "py-2 px-6",
  square = "p-3",
}
interface ButtonProps {
  onPress: () => void;
  text?: string;
  textSize?: string;
  textWeight?: FontWeights;
  buttonStyleType?: ButtonStyle;
  buttonStyleSize?: ButtonSize;
  customSlots?: JSX.Element[];
  width?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  customClasses?: string;
  isLoading?: boolean;
}

const CustomButton: React.FC<ButtonProps> = (props) => {
  const textColorClass = (): string => {
    switch (props.buttonStyleType) {
      case ButtonStyle.success:
        return "text-black";
      case ButtonStyle.cancel:
        return "text-white";
      case ButtonStyle.outline:
        return "text-white";
      case ButtonStyle.grey:
        return "text-white";
      case ButtonStyle.outlineBlack:
        return "text-white";
      default:
        return "text-black";
    }
  };

  return (
    <Pressable
      style={{ borderRadius: 8 }}
      disabled={props.disabled || props.isLoading}
      className={` ${
        props.buttonStyleSize ? props.buttonStyleSize : ButtonSize.regular
      } m-0 ${props.buttonStyleType}  ${props.width} ${
        props.customClasses
      }  flex justify-center items-center ${
        props.disabled || props.isLoading ? "opacity-50" : "opacity-100"
      }`}
      onPress={props.onPress}
    >
      {props.isLoading ? (
        <ViewLoading customClasses="py-0" />
      ) : props.customSlots ? (
        props.customSlots.map((slot, index) => <View key={index}>{slot}</View>)
      ) : (
        <Text
          className={`${
            props.textSize ? props.textSize : "text-base"
          } text-center ${textColorClass()} w-full`}
          style={{
            fontFamily: props.textWeight
              ? props.textWeight
              : FontWeights.regular,
          }}
        >
          {props.text}
        </Text>
      )}
      {props.children}
    </Pressable>
  );
};

export default CustomButton;

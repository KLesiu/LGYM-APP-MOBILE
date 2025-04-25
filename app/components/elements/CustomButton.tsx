import { Pressable, Text, View } from "react-native";
import { FontWeights } from "../../../enums/FontsProperties";
import React from "react";

export enum ButtonStyle {
    success = "bg-primaryColor",
    cancel = "bg-[#3f3f3f]",
    outline = "border-primaryColor border-[1px]",
    outlineBlack = "border-fifthColor border-[1px]",
    grey = "bg-[#282828]",
    default = "bg-white",
    none = "bg-transparent",
}
export enum ButtonSize{
  none= "p-0",
  small ="py-2 px-1",
  regular = 'smallPhone:py-2 smallPhone:px-1 middPhone:py-4 midPhone:px-2',
  xl = 'smallPhone:py-4 smallPhone:px-2 midPhone:py-6 midPhone:px-4',
  xxl = 'py-8 px-6',
  long = "py-2 px-6",
  square = "p-3",
}
interface ButtonProps {
  onPress: () => void;
  text?: string;
  textSize?:string;
  textWeight?:FontWeights;
  buttonStyleType?: ButtonStyle;
  buttonStyleSize?: ButtonSize;
  customSlots?: JSX.Element[];
  width?:string,
  children?:React.ReactNode,
  disabled?:boolean,
  customClasses?:string,
}

const CustomButton: React.FC<ButtonProps> = (props) => {
  const textColorClass = ():string=>{
    switch(props.buttonStyleType){
      case ButtonStyle.success:
        return 'text-black';
      case ButtonStyle.cancel:
        return 'text-white';
      case ButtonStyle.outline:
        return 'text-white';
      case ButtonStyle.grey:
        return 'text-white';
      case ButtonStyle.outlineBlack:
        return 'text-white';
      default:
        return 'text-black';
    }
  }


  return (
    <Pressable
      style={{ borderRadius: 8 }}
      disabled={props.disabled}
      className={` ${props.buttonStyleSize ? props.buttonStyleSize : ButtonSize.regular} m-0 ${props.buttonStyleType}  ${props.width} ${props.customClasses}  flex justify-center items-center ${props.disabled ? 'opacity-50' : 'opacity-100'}`}
      onPress={props.onPress}
    >
      {props.children}
      {props.customSlots ? props.customSlots.map((slot,index) => <View key={index}>{slot}</View>) :    
      <Text
        className={`${props.textSize ? props.textSize : 'text-base'} text-center ${textColorClass()} w-full`}
        style={{ fontFamily: props.textWeight ? props.textWeight : FontWeights.regular }}
      >
        {props.text}
      </Text>}
    </Pressable>
  );
};

export default CustomButton;

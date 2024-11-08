import { Pressable, Text } from "react-native";
import { FontWeights } from "../../enums/FontsProperties";

export enum ButtonStyle {
    success = "bg-[#94e798]",
    cancel = "bg-[#3f3f3f]",
    outline = "border-[#94e798] border-[1px]",
    default = "bg-white"
}
export enum ButtonSize{
  small ="py-2 px-1",
  regular = 'py-4 px-2',
  xl = 'py-6 px-4',
  xxl = 'py-8 px-6'
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
      default:
        return 'text-black';
    }
  }


  return (
    <Pressable
      style={{ borderRadius: 8 }}
      className={` ${props.buttonStyleSize ? props.buttonStyleSize : ButtonSize.regular} m-0 ${props.buttonStyleType}  ${props.width}  flex justify-center items-center`}
      onPress={props.onPress}
    >
      {props.customSlots ? props.customSlots.map((slot) => <>{slot}</>) :    
      <Text
        className={`${props.textSize ? props.textSize : 'text-base'}  w-full text-center ${textColorClass()}`}
        style={{ fontFamily: props.textWeight ? props.textWeight : FontWeights.regular }}
      >
        {props.text}
      </Text>}
    </Pressable>
  );
};

export default CustomButton;

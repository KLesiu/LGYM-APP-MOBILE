import { Pressable, Text } from "react-native";

export enum ButtonStyle {
    success = "bg-[#94e798]",
    delete = "bg-[#3f3f3f]"
}

interface ButtonProps {
  onPress: () => void;
  text: string;
  buttonStyleType: ButtonStyle;
  height:string,
  width:string,
}

const Button: React.FC<ButtonProps> = (props) => {
  const textColorClass = props.buttonStyleType === ButtonStyle.delete ? "text-white" : "text-black";

  return (
    <Pressable
      style={{ borderRadius: 8 }}
      className={` py-4 px-2 m-0 ${props.buttonStyleType} ${props.height} ${props.width} flex justify-center items-center`}
      onPress={props.onPress}
    >
      <Text
        className={`text-base w-full text-center ${textColorClass}`}
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        {props.text}
      </Text>
    </Pressable>
  );
};

export default Button;

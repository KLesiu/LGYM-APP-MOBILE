import { View } from "react-native";
interface ProgressBarProps {
  width: number;
}

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  return (
    <View
      style={{ borderRadius: 8 }}
      className="w-28 h-6 border-[#20BC2D] border-4 p-1 "
    >
      <View
        className="w-full h-full bg-[#20BC2D]"
        style={{ width: `${props.width}%` }}
      ></View>
    </View>
  );
};

export default ProgressBar;

import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CheckboxProps {
  value: boolean;
  setValue?: (value: boolean) => void;
  customClasses?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  value,
  setValue,
  customClasses,
}) => {
  return (
    <Pressable
      className={customClasses}
      onPress={() => setValue && setValue(!value)}
    >
      <Ionicons
        name={value ? "checkbox" : "square-outline"}
        size={28}
        color={value ? "#20BC2D" : "#1E1E1E"}
      />
    </Pressable>
  );
};
export default Checkbox;

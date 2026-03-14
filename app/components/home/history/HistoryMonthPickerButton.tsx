import React from "react";
import { TouchableOpacity, View } from "react-native";
import CalendarIcon from "./../../../../img/icons/calendarIcon.svg";

interface HistoryMonthPickerButtonProps {
  onPress: () => void;
}

const HistoryMonthPickerButton: React.FC<HistoryMonthPickerButtonProps> = ({
  onPress,
}) => {
  return (
    <View className="w-full flex-row justify-end mb-3">
      <TouchableOpacity
        onPress={onPress}
        className="h-10 w-10 items-center justify-center rounded-md bg-primaryColor"
      >
        <CalendarIcon width={18} height={18} />
      </TouchableOpacity>
    </View>
  );
};

export default HistoryMonthPickerButton;


import {Text} from "react-native";
import React from "react";

interface ProgressSummaryValueProps {
    value: number | null;
    unit?: string;
}

const ProgressSummaryValue: React.FC<ProgressSummaryValueProps> = ({ value, unit = "" }) => {
  if (value === null || value === undefined) {
    return <Text className="text-textColor text-sm">-</Text>;
  }
  if (value > 0) {
    return <Text className="text-primaryColor text-sm smallPhone:text-xs">(+{value}{unit})</Text>;
  }
  if (value < 0) {
    return <Text className="text-red-400 text-sm smallPhone:text-xs">({value}{unit})</Text>;
  }
  return <Text className="text-textColor text-sm smallPhone:text-xs">({value}{unit})</Text>;
};

export default ProgressSummaryValue
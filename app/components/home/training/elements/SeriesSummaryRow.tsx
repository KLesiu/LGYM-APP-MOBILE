import {Text, View} from "react-native";
import React from "react";
import { SeriesComparison } from "../../../../../interfaces/Training";
import ProgressSummaryValue from "./ProgressSummaryValue";

interface SeriesSummaryRowProps {
  seriesComparison: SeriesComparison;
}

const SeriesSummaryRow: React.FC<SeriesSummaryRowProps> = ({ seriesComparison }) => {
  const { series, currentResult, previousResult } = seriesComparison;

  const repsDiff = previousResult ? currentResult.reps - previousResult.reps : null;
  const weightDiff = previousResult ? currentResult.weight - previousResult.weight : null;

  return (
    <View className="flex-row justify-between w-full mt-2 border-t border-gray-600 pt-2">
      <Text className="text-textColor text-base smallPhone:text-sm w-1/4">
        Series: {series}
      </Text>
      <View className="flex-row items-baseline w-1/3">
        <Text className="text-textColor text-base smallPhone:text-sm">
          {currentResult.reps} reps.
        </Text>
        <ProgressSummaryValue value={repsDiff} />
      </View>
       <View className="flex-row items-baseline w-1/3">
         <Text className="text-textColor text-base smallPhone:text-sm">
           {currentResult.weight}{currentResult.unit}
         </Text>
         <ProgressSummaryValue value={weightDiff} unit={currentResult.unit} />
       </View>
    </View>
  );
};

export default SeriesSummaryRow;
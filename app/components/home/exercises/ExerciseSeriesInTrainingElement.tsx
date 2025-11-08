import { View, Text } from "react-native";
import React from "react";
import { ExerciseTrainingHistoryItem } from "../../../../interfaces/Exercise";
import GymIcon from "./../../../../img/icons/gymIcon.svg";

interface ExerciseSeriesInTrainingElementProps {
  exerciseSeriesInTraining: ExerciseTrainingHistoryItem;
}

const ExerciseSeriesInTrainingElement: React.FC<
  ExerciseSeriesInTrainingElementProps
> = ({ exerciseSeriesInTraining }) => {
  return (
    <View className="flex flex-col border border-textColor rounded-lg ">
      <View
        className="flex flex-row justify-between px-2 py-1 items-center"
        style={{ gap: 8 }}
      >
        <View
          className="flex flex-row items-center flex-1 flex-wrap"
          style={{ gap: 4 }}
        >
          <GymIcon width={14} height={14} />

          <Text
            className="text-textColor text-xs "
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {exerciseSeriesInTraining.gymName}:
          </Text>

          <Text
            className="text-primaryColor text-xs "
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {exerciseSeriesInTraining.trainingName}
          </Text>
        </View>

        <Text
          className="text-sm font-light text-textColor"
          style={{ fontFamily: "OpenSans_300Light" }}
        >
          {new Date(exerciseSeriesInTraining.date).toLocaleDateString()}
        </Text>
      </View>
      {exerciseSeriesInTraining.seriesScores.map((seriesScores) => (
        <View
          key={seriesScores.series}
          className="flex flex-row justify-between py-1 px-2 border-t border-textColor"
        >
          <Text
            className="text-textColor font-normal"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            Series: {seriesScores.series}
          </Text>
          <Text
            className="text-textColor font-normal"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {seriesScores.score?.reps} x {seriesScores.score?.weight}
            {seriesScores.score?.unit}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default ExerciseSeriesInTrainingElement;

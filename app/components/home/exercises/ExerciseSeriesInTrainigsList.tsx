import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ExerciseTrainingHistoryItem } from "../../../../interfaces/Exercise";
import ExerciseSeriesInTrainingElement from "./ExerciseSeriesInTrainingElement";

interface ExerciseSeriesInTrainigsListProps {
  listOfExerciseSeriesInTrainigs: ExerciseTrainingHistoryItem[];
}

const ExerciseSeriesInTrainigsList: React.FC<
  ExerciseSeriesInTrainigsListProps
> = ({ listOfExerciseSeriesInTrainigs }) => {
  return (
    <View className="flex flex-col pt-2" style={{ gap: 4 }}>
      <Text
        className="font-normal text-base text-textColor"
        style={{ fontFamily: "OpenSans_400Regular" }}
      >
        History
      </Text>
      <View className="flex flex-col" style={{ gap: 16 }}>
        {listOfExerciseSeriesInTrainigs &&
          listOfExerciseSeriesInTrainigs.length ?
          listOfExerciseSeriesInTrainigs.map((x) => (
            <ExerciseSeriesInTrainingElement
              key={x._id}
              exerciseSeriesInTraining={x}
            />
          )) : <Text className="text-textColor text-xs" style={{fontFamily: "OpenSans_300Light", }}>No history available</Text>}
      </View>
    </View>
  );
};

export default ExerciseSeriesInTrainigsList;

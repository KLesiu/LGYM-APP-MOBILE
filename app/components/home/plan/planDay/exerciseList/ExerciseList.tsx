import { View, Text, ScrollView } from "react-native";
import { ExerciseForPlanDay } from "./../../../../../../interfaces/Exercise";
import ExerciseListItem from "./ExerciseListItem";
import React from "react";

interface ExerciseListProps {
  exerciseList: ExerciseForPlanDay[];
  removeExerciseFromList?: (item: ExerciseForPlanDay) => void;
  editExerciseFromList?: (item: ExerciseForPlanDay) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = (props) => {
  return (
    <View className="flex flex-col flex-1 " style={{ gap: 8 }}>
      <View className="flex flex-row justify-between">
        <Text
          style={{ fontFamily: "OpenSans_700Bold" }}
          className="text-textColor text-base smallPhone:text-sm"
        >
          Exercises List:
        </Text>
        <Text
          style={{ fontFamily: "OpenSans_400Regular" }}
          className="text-textColor  text-base smallPhone:text-sm"
        >
          {props.exerciseList.length} Total
        </Text>
      </View>
      <View className="flex flex-col " style={{ gap: 10 }}>
          {props.exerciseList.length > 0 ? (
            props.exerciseList.map((item, index) => (
              <ExerciseListItem
                key={index}
                exerciseListItem={item}
                removeExerciseFromList={props.removeExerciseFromList} 
                editExerciseFromList={props.editExerciseFromList}
              />
            ))
          ) : (
            <Text
              className="text-textColor"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              No exercises added yet.
            </Text>
          )}
        </View>
    </View>
  );
};

export default ExerciseList;

import { View, Text, ScrollView } from "react-native";
import { ExerciseForPlanDay } from "../../../../../interfaces/Exercise";
import ExerciseListItem from "./ExerciseListItem";
import { useEffect } from "react";

interface ExerciseListProps {
  exerciseList: ExerciseForPlanDay[];
  removeExerciseFromList?: (item: ExerciseForPlanDay) => void;
  editExerciseFromList?: (item: ExerciseForPlanDay) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = (props) => {
  return (
    <View className="flex flex-col flex-1 p-5" style={{ gap: 8 }}>
      <View className="flex flex-row justify-between">
        <Text
          style={{ fontFamily: "OpenSans_700Bold" }}
          className="text-white text-base"
        >
          Exercises List:
        </Text>
        <Text
          style={{ fontFamily: "OpenSans_400Regular" }}
          className="text-white text-base"
        >
          {props.exerciseList.length} Total
        </Text>
      </View>
      <ScrollView className="h-full">
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
              className="text-white"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              No exercises added yet.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ExerciseList;

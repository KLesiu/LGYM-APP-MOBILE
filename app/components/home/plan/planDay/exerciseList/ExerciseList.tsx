import { View, Text, ScrollView } from "react-native";
import { ExerciseForPlanDay } from "./../../../../../../interfaces/Exercise";
import ExerciseListItem from "./ExerciseListItem";
import React from "react";
import { useTranslation } from "react-i18next";

interface ExerciseListProps {
  exerciseList: ExerciseForPlanDay[];
  removeExerciseFromList?: (item: ExerciseForPlanDay) => void;
  editExerciseFromList?: (item: ExerciseForPlanDay) => void;
  moveExercise?:(exercise:ExerciseForPlanDay, direction: 'up' | 'down')=>void;
}

const ExerciseList: React.FC<ExerciseListProps> = (props) => {
  const { t } = useTranslation();

  const findExercisePosition = (exercise: ExerciseForPlanDay): number => {
    return props.exerciseList.findIndex(item => item.exercise.value === exercise.exercise.value);
  }

  return (
    <View className="flex flex-col flex-1 " style={{ gap: 8 }}>
      <View className="flex flex-row justify-between">
        <Text
          style={{ fontFamily: "OpenSans_700Bold" }}
          className="text-textColor text-base smallPhone:text-sm"
        >
          {t('plans.exercisesList')}
        </Text>
        <Text
          style={{ fontFamily: "OpenSans_400Regular" }}
          className="text-textColor  text-base smallPhone:text-sm"
        >
          {t('plans.total', { count: props.exerciseList.length })}
        </Text>
      </View>
      <View className="flex flex-col w-full " style={{ gap: 16 }}>
          {props.exerciseList.length > 0 ? (
            props.exerciseList.map((item, index) => (
              <ExerciseListItem
                key={index}
                exerciseListItem={item}
                exerciseListItemPosition={findExercisePosition(item)}
                removeExerciseFromList={props.removeExerciseFromList} 
                editExerciseFromList={props.editExerciseFromList}
                moveExerciseUp={props.moveExercise ? () => props.moveExercise!(item, 'up') : undefined}
                moveExerciseDown={props.moveExercise ? () => props.moveExercise!(item, 'down') : undefined}
              />
            ))
          ) : (
            <Text
              className="text-textColor"
              style={{ fontFamily: "OpenSans_300Light" }}
            >
              {t('plans.noExercisesYet')}
            </Text>
          )}
        </View>
    </View>
  );
};

export default ExerciseList;

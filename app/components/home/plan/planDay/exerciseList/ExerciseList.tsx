import { View, Text } from 'react-native';
import { ExerciseForPlanDay } from './../../../../../../types/models';
import ExerciseListItem from './ExerciseListItem';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ExerciseListProps {
  exerciseList: ExerciseForPlanDay[];
  removeExerciseFromList?: ((item: ExerciseForPlanDay) => void) | undefined;
  editExerciseFromList?: ((item: ExerciseForPlanDay) => void) | undefined;
  moveExercise?: (exercise: ExerciseForPlanDay, direction: 'up' | 'down') => void;
  onInputFocus?: () => void;
}

const ExerciseList: React.FC<ExerciseListProps> = (props) => {
  const { t } = useTranslation();

  const findExercisePosition = (exercise: ExerciseForPlanDay): number => {
    return props.exerciseList.findIndex((item) => item.exercise.value === exercise.exercise.value);
  };

  return (
    <View className="flex flex-col flex-1 " style={{ gap: 8 }}>
      <View className="flex flex-row justify-between w-full">
        <Text
          style={{ fontFamily: 'OpenSans_700Bold' }}
          className="text-textColor text-base smallPhone:text-sm"
        >
          {t('plans.exercisesList')}
        </Text>
        <Text
          style={{ fontFamily: 'OpenSans_400Regular' }}
          className="text-textColor  text-base smallPhone:text-sm"
        >
          {t('plans.total', { count: props.exerciseList.length })}
        </Text>
      </View>
      <View className="flex flex-col w-full " style={{ gap: 16 }}>
        {props.exerciseList.length > 0 ? (
          props.exerciseList.map((item) => (
            <ExerciseListItem
              key={item.exercise.value}
              exerciseListItem={item}
              exerciseListItemPosition={findExercisePosition(item)}
              {...(props.removeExerciseFromList ? { removeExerciseFromList: props.removeExerciseFromList } : {})}
              {...(props.editExerciseFromList ? { editExerciseFromList: props.editExerciseFromList } : {})}
              {...(props.moveExercise
                ? { moveExerciseUp: () => props.moveExercise!(item, 'up') }
                : {})}
              {...(props.moveExercise
                ? { moveExerciseDown: () => props.moveExercise!(item, 'down') }
                : {})}
              {...(props.onInputFocus ? { onInputFocus: props.onInputFocus } : {})}
            />
          ))
        ) : (
          <Text className="text-textColor" style={{ fontFamily: 'OpenSans_300Light' }}>
            {t('plans.noExercisesYet')}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ExerciseList;

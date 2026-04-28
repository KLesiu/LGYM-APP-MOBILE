import React from 'react';
import { ExerciseForPlanDay } from '../../../../types/models';
import Card from '../../elements/Card';
import { View, Text, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EditIcon from './../../../../img/icons/editIcon.svg';
import Checkbox from '../../elements/Checkbox';
import { ExerciseResponseDto } from '../../../../api/generated/model';
import { isAdminUser } from '../../../../lib/domain/authorization';
import { useAuthStore } from '../../../../stores/useAuthStore';

interface ExercisesListElementProps {
  exercise: ExerciseResponseDto;
  onPress: (exercise: ExerciseResponseDto) => void;
  isGlobal?: boolean;
  editExercise: (exercise: ExerciseResponseDto) => void;
  addTranslation?: (exercise: ExerciseResponseDto) => void;
  isCreatePlanDayMode?: boolean;
  addExerciseToList?: (exercise: ExerciseResponseDto) => void;
  exercisesList?: ExerciseForPlanDay[];
}

const ExercisesListElement: React.FC<ExercisesListElementProps> = ({
  exercise,
  onPress,
  isGlobal = false,
  editExercise,
  addTranslation,
  isCreatePlanDayMode,
  addExerciseToList,
  exercisesList,
}) => {
  const userInfo = useAuthStore((state) => state.user);
  const isAdmin = isAdminUser(userInfo);

  return (
    <Card customClasses="flex flex-row items-center mb-2">
      <View className="flex flex-row items-center flex-1" style={{ gap: 8 }}>
        <View className="flex flex-col flex-1">
          <Text
            className="font-bold text-xl text-textColor"
            style={{ fontFamily: 'OpenSans_700Bold' }}
          >
            {exercise.name}
          </Text>

          <Text
            className="font-light text-xs text-textColor"
            style={{ fontFamily: 'OpenSans_300Light' }}
          >
            {exercise.bodyPart?.displayName}
          </Text>
        </View>
      </View>
      {isCreatePlanDayMode && addExerciseToList && exercisesList ? (
        <View>
          <Checkbox
            value={exercisesList.some((x) => x.exercise.value === exercise._id)}
            setValue={() => addExerciseToList(exercise)}
          />
        </View>
      ) : (
        <View className="flex flex-row items-center" style={{ gap: 8 }}>
          {isGlobal && isAdmin && addTranslation && (
            <Pressable onPress={() => addTranslation(exercise)}>
              <Ionicons name="language-outline" size={24} color="white" />
            </Pressable>
          )}
          {((isGlobal && isAdmin) || !isGlobal) && (
            <Pressable onPress={() => editExercise(exercise)}>
              <EditIcon fill={'white'} width={24} height={24} />
            </Pressable>
          )}

          <Pressable onPress={() => onPress(exercise)}>
            <Ionicons name="information-circle" size={24} color="white" />
          </Pressable>
        </View>
      )}
    </Card>
  );
};

export default ExercisesListElement;

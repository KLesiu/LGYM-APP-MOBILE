import React from 'react';
import { View, Text, TextInput } from 'react-native';
import CustomDropdown from '../../elements/Dropdown';
import { ExerciseForm } from './../../../../types/models';
import CustomButton, { ButtonStyle } from '../../elements/CustomButton';
import Dialog from '../../elements/Dialog';
import ExerciseIcon from './../../../../img/icons/exercisesIcon.svg';
import { useExerciseForm } from './hooks/useExerciseForm';

interface CreateExerciseProps {
  closeForm: () => void;
  form?: ExerciseForm;
  isGlobal?: boolean;
  isAdmin?: boolean;
}

const CreateExercise: React.FC<CreateExerciseProps> = (props) => {
  const {
    exerciseName,
    setExerciseName,
    bodyPart,
    setBodyPart,
    description,
    setDescription,
    isBlocked,
    bodyPartsToSelect,
    isLoading,
    handleSubmit,
    deleteExercise,
  } = useExerciseForm({ ...props, closeForm: props.closeForm });

  return (
    <Dialog>
      <View className="w-full h-full">
        <View className="px-5 py-2">
          <Text className=" text-3xl smallPhone:text-2xl text-textColor" style={{ fontFamily: 'OpenSans_700Bold' }}>
            {props.form ? 'Edit exercise' : 'New exercise'}
          </Text>
        </View>
        <View className="px-5" style={{ gap: 16 }}>
          <View className="flex flex-row items-center" style={{ gap: 8 }}>
            <ExerciseIcon />
            <Text className=" text-xl smallPhone:text-lg text-textColor" style={{ fontFamily: 'OpenSans_400Regular' }}>
              Set exercise
            </Text>
          </View>
          <View style={{ gap: 4 }} className="flex flex-col">
            <View className="flex flex-row gap-1">
              <Text style={{ fontFamily: 'OpenSans_300Light' }} className="  text-textColor text-base smallPhone:text-sm">Name:</Text>
              <Text className="text-redColor">*</Text>
            </View>
            <TextInput style={{ fontFamily: 'OpenSans_400Regular', backgroundColor: 'rgb(30, 30, 30)', borderRadius: 8 }} className=" w-full  px-2 py-4 text-textColor  " onChangeText={setExerciseName} value={exerciseName} readOnly={isBlocked} />
          </View>
          <View style={{ gap: 4 }} className="flex flex-col">
            <View className="flex flex-row gap-1">
              <Text style={{ fontFamily: 'OpenSans_300Light' }} className="  text-textColor text-base smallPhone:text-sm">Body part:</Text>
              <Text className="text-redColor">*</Text>
            </View>
            <View>
              {isBlocked ? (
                <Text style={{ fontFamily: 'OpenSans_300Light' }} className="text-textColor text-base smallPhone:text-sm">
                  {bodyPart?.displayName || ''}
                </Text>
              ) : (
                <CustomDropdown
                  value={bodyPart?.name || ''}
                  data={bodyPartsToSelect}
                  onSelect={(item) => {
                    if (!item) {
                      setBodyPart(undefined);
                      return;
                    }
                    const selected = bodyPartsToSelect.find((bp: { label: string; value: string }) => bp.value === item.value);
                    setBodyPart(selected ? ({ name: selected.value, displayName: selected.label } as never) : undefined);
                  }}
                />
              )}
            </View>
          </View>
          <View style={{ gap: 4 }} className="flex flex-col">
            <Text style={{ fontFamily: 'OpenSans_300Light' }} className="  text-textColor text-base smallPhone:text-sm">Description:</Text>
            <TextInput style={{ fontFamily: 'OpenSans_300Light', borderRadius: 8, backgroundColor: 'rgb(30, 30, 30)' }} className="w-full px-2 py-4  text-textColor " multiline onChangeText={setDescription} value={description} readOnly={isBlocked} />
          </View>
        </View>
        <View className="p-5 flex flex-row justify-between" style={{ gap: 20 }}>
          <CustomButton onPress={props.closeForm} text="Cancel" buttonStyleType={ButtonStyle.outlineBlack} width="flex-1" />
          {!isBlocked && (
            <>
              {props.form?._id && <CustomButton onPress={deleteExercise} disabled={isLoading} text="Delete" buttonStyleType={ButtonStyle.default} width="flex-1" />}
              <CustomButton onPress={handleSubmit} disabled={isLoading} text={props.form ? 'Update' : 'Create'} buttonStyleType={ButtonStyle.success} width="flex-1" />
            </>
          )}
        </View>
      </View>
    </Dialog>
  );
};

export default CreateExercise;

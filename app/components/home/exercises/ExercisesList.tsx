import React, { useMemo, useState } from "react";
import { Pressable, View, Text, Switch, ScrollView } from "react-native";
import { BodyParts } from "../../../../enums/BodyParts";
import BackIcon from "./../../../../img/icons/backIcon.svg";
import SearchBox from "../../elements/SearchBox";
import TypeOfExercises from "../../../../enums/TypeOfExercises";
import {
  ExerciseForm,
  ExerciseForPlanDay,
} from "../../../../interfaces/Exercise";
import Ionicons from "react-native-vector-icons/Ionicons";
import ExercisesListElement from "./ExercisesListElement";

interface ExercisesListProps {
  bodyPart: BodyParts;
  goBack: () => void;
  userExercises: ExerciseForm[];
  globalExercises: ExerciseForm[];
  selectExercise: (exercise: ExerciseForm, isEditing: boolean) => void;
  isCreatePlanDayMode?: boolean;
  addExerciseToList?: (exercise: ExerciseForm) => void;
  exercisesList?: ExerciseForPlanDay[];
}

const ExercisesList: React.FC<ExercisesListProps> = ({
  bodyPart,
  goBack,
  userExercises,
  globalExercises,
  selectExercise,
  isCreatePlanDayMode,
  addExerciseToList,
  exercisesList,
}) => {
  const [currentTypeOfExercises, setCurrentTypeOfExercises] =
    useState<TypeOfExercises>(TypeOfExercises.GLOBAL);
  const [searchText, setSearchText] = useState<string>("");

  const toggleCurrentTypeOfExercises = () => {
    if (currentTypeOfExercises === TypeOfExercises.GLOBAL) {
      setCurrentTypeOfExercises(TypeOfExercises.USER);
    } else {
      setCurrentTypeOfExercises(TypeOfExercises.GLOBAL);
    }
  };

  const filteredGlobalExercises = useMemo(() => {
    const lowercasedSearchText = searchText.toLowerCase();
    return globalExercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(lowercasedSearchText)
    );
  }, [globalExercises, searchText]);

  const filteredUserExercises = useMemo(() => {
    const lowercasedSearchText = searchText.toLowerCase();
    return userExercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(lowercasedSearchText)
    );
  }, [userExercises, searchText]);

  return (
    <View className="flex flex-col p-4 flex-1 w-full" style={{ gap: 16 }}>
      <View className="flex flex-row items-center justify-between">
        <Pressable
          style={{ borderRadius: 10000 }}
          onPress={goBack}
          className="flex items-center justify-center w-8 h-8  bg-secondaryColor "
        >
          <BackIcon />
        </Pressable>
        <View className="flex flex-row items-center" style={{ gap: 8 }}>
          <Text
            style={{ fontFamily: "OpenSans_300Light" }}
            className="text-textColor text-base"
          >
            Body part:
          </Text>
          <Text
            style={{ fontFamily: "OpenSans_700Bold" }}
            className="font-bold text-primaryColor text-xl"
          >
            {bodyPart}
          </Text>
        </View>
        <View
          className="flex flex-row justify-end items-center"
          style={{ gap: 2 }}
        >
          {currentTypeOfExercises === TypeOfExercises.GLOBAL ? (
            <Ionicons name="globe-outline" size={24} color="white" />
          ) : (
            <Ionicons name="person-outline" size={24} color="white" />
          )}
          <Switch
            value={currentTypeOfExercises !== TypeOfExercises.GLOBAL}
            onValueChange={toggleCurrentTypeOfExercises}
          />
        </View>
      </View>

      <SearchBox value={searchText} onChangeText={setSearchText} />
      <ScrollView className="pb-10 flex-1">
        {currentTypeOfExercises === TypeOfExercises.GLOBAL
          ? filteredGlobalExercises.map((exercise) => (
              <ExercisesListElement
                isGlobal={true}
                key={exercise._id}
                exercise={exercise}
                isCreatePlanDayMode={isCreatePlanDayMode}
                onPress={() => selectExercise(exercise, false)}
                addExerciseToList={addExerciseToList}
                exercisesList={exercisesList}
                editExercise={() => selectExercise(exercise, true)}
              />
            ))
          : filteredUserExercises.map((exercise) => (
              <ExercisesListElement
                key={exercise._id}
                exercise={exercise}
                isCreatePlanDayMode={isCreatePlanDayMode}
                onPress={() => selectExercise(exercise, false)}
                addExerciseToList={addExerciseToList}
                exercisesList={exercisesList}
                editExercise={() => selectExercise(exercise, true)}
              />
            ))}
      </ScrollView>
    </View>
  );
};
export default ExercisesList;

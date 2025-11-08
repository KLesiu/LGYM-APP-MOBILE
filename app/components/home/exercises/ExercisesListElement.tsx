import React from "react";
import { ExerciseForm } from "../../../../interfaces/Exercise";
import Card from "../../elements/Card";
import { View, Text, Image, Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import EditIcon from "./../../../../img/icons/editIcon.svg";
import { useHomeContext } from "../HomeContext";
import { useAppContext } from "../../../AppContext";

interface ExercisesListElementProps {
  exercise: ExerciseForm;
  onPress: (exercise: ExerciseForm) => void;
  isGlobal?: boolean;
  editExercise: (exercise: ExerciseForm) => void;
}

const ExercisesListElement: React.FC<ExercisesListElementProps> = ({
  exercise,
  onPress,
  isGlobal = false,
  editExercise
}) => {
  const { userInfo } = useAppContext();
  return (
    <Card customClasses="flex flex-row items-center mb-2">
      <View className="flex flex-row items-center flex-1" style={{ gap: 8 }}>
        <View className="flex flex-col flex-1">
          <Text
            className="font-bold text-xl text-textColor"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {exercise.name}
          </Text>

          <Text
            className="font-light text-xs text-textColor"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            {exercise.bodyPart}
          </Text>
        </View>
      </View>
      <View className="flex flex-row items-center" style={{ gap: 8 }}>
        {((isGlobal && userInfo && userInfo.admin) || !isGlobal) && (
          <Pressable onPress={() => editExercise(exercise)}>
            <EditIcon fill={"white"} width={24} height={24} />
          </Pressable>
        )}

        <Pressable onPress={() => onPress(exercise)}>
          <Ionicons name="information-circle" size={24} color="white" />
        </Pressable>
      </View>
    </Card>
  );
};

export default ExercisesListElement;

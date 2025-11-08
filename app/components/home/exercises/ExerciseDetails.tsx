import React from "react";
import { View, Text, Pressable, Switch } from "react-native";
import BodyPartImage from "../../elements/BodyPartImage";
import { ExerciseForm } from "../../../../interfaces/Exercise";

import BackIcon from "./../../../../img/icons/backIcon.svg";

interface ExerciseDetailsProps {
  exercise: ExerciseForm;
  goBack: () => void;
}

const ExerciseDetails: React.FC<ExerciseDetailsProps> = ({
  exercise,
  goBack,
}) => {
  return (
    <View className="flex flex-col px-2 pt-4 " style={{ gap: 16 }}>
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
            {exercise.bodyPart}
          </Text>
        </View>
        <View></View>
      </View>
      <View className="flex flex-col items-center bg-cardColor rounded-lg px-4 py-2 ">
        <BodyPartImage bodyPart={exercise.bodyPart} showBig={true} />
        <View className="flex flex-col w-full">
          <Text
            className="text-2xl font-bold text-textColor"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {exercise.name}
          </Text>
          <Text
            className="text-xs font-light"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            {exercise.description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ExerciseDetails;

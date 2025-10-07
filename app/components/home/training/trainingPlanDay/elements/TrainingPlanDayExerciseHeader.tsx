import { View, Text, Linking, Alert, Pressable } from "react-native";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

interface TrainingPlanDayExerciseHeaderProps {}

const TrainingPlanDayExerciseHeader: React.FC<
  TrainingPlanDayExerciseHeaderProps
> = () => {
  const { currentExercise } = useTrainingPlanDay();
  const openSearch = async (exerciseName?: string) => {
    if (!exerciseName) return Alert.alert("Exercise name is required");
    const query = encodeURIComponent(exerciseName);
    const url = `https://www.google.com/search?q=${query}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Can't open browser");
    }
  };
  return (
    <View className="flex flex-col px-5">
      <View className="flex flex-row items-center" style={{ gap: 8 }}>
        <Text
          className="text-3xl smallPhone:text-xl text-textColor  font-bold flex-1 "
          style={{
            fontFamily: "OpenSans_700Bold",
          }}
        >
          {currentExercise?.exercise.name}
        </Text>
        <Pressable
          className="w-10"
          onPress={() => openSearch(currentExercise?.exercise.name)}
          hitSlop={8}
        >
          <Ionicons name="search-outline" size={24} color="white" />
        </Pressable>
      </View>

      <Text
        className=" text-base smallPhone:text-sm text-textColor "
        style={{
          fontFamily: "OpenSans_400Regular",
        }}
      >
        {currentExercise?.series}x{currentExercise?.reps}
      </Text>
    </View>
  );
};

export default TrainingPlanDayExerciseHeader;

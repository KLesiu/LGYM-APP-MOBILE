import { View, Text, TextInput } from "react-native";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import { ExerciseForm } from "../../../../../../interfaces/Exercise";
import { TrainingSessionScores } from "../../../../../../interfaces/Training";
import { useEffect, useState } from "react";
import React from "react";

interface TrainingPlanDayExerciseViewProps {}

const TrainingPlanDayExerciseView: React.FC<
  TrainingPlanDayExerciseViewProps
> = () => {
  const { currentExercise, setTrainingSessionScores, trainingSessionScores } =
    useTrainingPlanDay();

  const updateExerciseScore = async (
    exercise: ExerciseForm,
    series: number,
    value: string,
    isWeight: boolean
  ) => {
    const scoreIndex = trainingSessionScores.findIndex(
      (score) => score.exercise._id === exercise._id && score.series === series
    );

    const newScore: TrainingSessionScores = {
      exercise,
      series,
      reps: isWeight ? "" : value,
      weight: isWeight ? value : "",
    };

    let updatedScores = [...trainingSessionScores];

    if (scoreIndex !== -1) {
      updatedScores[scoreIndex] = {
        ...updatedScores[scoreIndex],
        ...(isWeight ? { weight: value } : { reps: value }),
      };
    } else {
      updatedScores.push(newScore);
    }
    setTrainingSessionScores(updatedScores);
  };

  return (
    <View className="w-full px-5 flex flex-col flex-1" style={{ gap: 4 }}>
      <View className="flex flex-row justify-between">
        <Text
          className=" text-sm smallPhone:text-xs text-textColor "
          style={{
            fontFamily: "OpenSans_300Light",
          }}
        >
          Series
        </Text>
        <Text
          className="text-sm smallPhone:text-xs  text-textColor  w-2/5"
          style={{
            fontFamily: "OpenSans_300Light",
          }}
        >
          Reps
        </Text>
        <Text
          className=" text-sm smallPhone:text-xs text-textColor  w-2/5 "
          style={{
            fontFamily: "OpenSans_300Light",
          }}
        >
          Weight (kg)
        </Text>
      </View>
      <View className="w-full flex-1">
        <View style={{ gap: 10 }} className="flex flex-col">
          {Array.from({ length: currentExercise!.series }).map((_, index) => {
            const savedScore = trainingSessionScores.find(
              (score) =>
                score.exercise._id === currentExercise!.exercise._id &&
                score.series === index + 1
            );
            return (
              <View
                className="flex w-full flex-row justify-between"
                key={`${currentExercise!.exercise._id}-${index + 1}`}
                style={{ gap: 10 }}
              >
                <View className="bg-secondaryColor   px-4 py-3 smallPhone:px-3 smallPhone:py-2  rounded-lg ">
                  <Text className="text-textColor">{index + 1}</Text>
                </View>
                <TextInput
                  onChangeText={(value) => {
                    const normalized = value.replace(",", ".");
                    updateExerciseScore(
                      currentExercise!.exercise,
                      index + 1,
                      normalized,
                      false
                    );
                  }}
                  value={savedScore?.reps.toString() ?? ""}
                  keyboardType="decimal-pad"
                  style={{ borderRadius: 8 }}
                  className=" text-sm smallPhone:text-[11px]  bg-secondaryColor w-2/5    px-4 py-3 smallPhone:px-3 smallPhone:py-2  text-textColor"
                />
                <TextInput
                  onChangeText={(value) => {
                    const normalized = value.replace(",", ".");
                    updateExerciseScore(
                      currentExercise!.exercise,
                      index + 1,
                      normalized,
                      true
                    );
                  }}
                  style={{ borderRadius: 8 }}
                  value={savedScore?.weight.toString() ?? ""}
                  keyboardType="decimal-pad"
                  className=" text-sm  smallPhone:text-xs  bg-secondaryColor  text-textColor    px-4 py-3 smallPhone:px-3 smallPhone:py-2 w-2/5 "
                />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
export default TrainingPlanDayExerciseView;

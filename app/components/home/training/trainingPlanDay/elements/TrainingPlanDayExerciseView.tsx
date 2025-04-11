import { View, Text, TextInput, ScrollView } from "react-native";
import { useTrainingPlanDay } from "../TrainingPlanDayContext";
import { useEffect } from "react";
import { ExerciseForm } from "../../../../../../interfaces/Exercise";
import { TrainingSessionScores } from "../../../../../../interfaces/Training";

interface TrainingPlanDayExerciseViewProps {}

const TrainingPlanDayExerciseView: React.FC<
  TrainingPlanDayExerciseViewProps
> = () => {
  const { currentExercise, trainingSessionScores, setTrainingSessionScores } =
    useTrainingPlanDay();

  useEffect(() => {
    console.log("currentExercise", currentExercise);
  }, [currentExercise]);

  const updateExerciseScore = async (
    exercise: ExerciseForm,
    series: number,
    value: string,
    isWeight: boolean
  ) => {
    const updatedScores = trainingSessionScores.map((score) => {
      if (score.exercise._id === exercise._id && score.series === series) {
        if (isWeight) {
          return {
            ...score,
            weight: value,
          };
        }
        return {
          ...score,
          reps: value,
        };
      }
      return score;
    });

    setTrainingSessionScores(updatedScores as Array<TrainingSessionScores>);
  };
  return (
    <View className="w-full px-5 flex flex-col" style={{ gap: 4 }}>
      <View className="flex flex-row justify-between">
        <Text
          className="text-sm text-white "
          style={{
            fontFamily: "OpenSans_300Light",
          }}
        >
          Series
        </Text>
        <Text
          className="text-sm text-white  w-2/5"
          style={{
            fontFamily: "OpenSans_300Light",
          }}
        >
          Reps
        </Text>
        <Text
          className="text-sm text-white  w-2/5 "
          style={{
            fontFamily: "OpenSans_300Light",
          }}
        >
          Weight (kg)
        </Text>
      </View>
      <ScrollView
        className="w-full max-h-44"
        contentContainerStyle={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
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
                key={index}
                style={{ gap: 10 }}
              >
                <View className="bg-secondaryColor p-4 py-3 rounded-lg ">
                  <Text className="text-white">{index + 1}</Text>
                </View>
                <TextInput
                  onChangeText={(value) =>
                    updateExerciseScore(
                      currentExercise!.exercise,
                      index + 1,
                      value,
                      false
                    )
                  }
                  value={savedScore ? `${savedScore.reps}` : ""}
                  keyboardType="numeric"
                  style={{ borderRadius: 8 }}
                  className="text-sm  bg-secondaryColor w-2/5  px-4 py-3  text-white"
                />
                <TextInput
                  onChangeText={(value) =>
                    updateExerciseScore(
                      currentExercise!.exercise,
                      index + 1,
                      value,
                      true
                    )
                  }
                  style={{ borderRadius: 8 }}
                  value={savedScore ? `${savedScore.weight}` : ""}
                  keyboardType="numeric"
                  className="text-sm   bg-secondaryColor  text-white px-4 py-3 w-2/5 "
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};
export default TrainingPlanDayExerciseView;

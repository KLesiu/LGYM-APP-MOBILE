import { View, Text, ScrollView, Image } from "react-native";
import { TrainingByDateDetails } from "../../../interfaces/Training";
import gym from "./../../../img/icons/gym.png";

interface TrainingSessionProps {
  trainings: TrainingByDateDetails[];
}

const TrainingSession: React.FC<TrainingSessionProps> = (props) => {
  return (
    <ScrollView
      contentContainerStyle={{ gap: 16 }}
      className="w-full flex flex-col flex-1 pt-2"
    >
      {props.trainings.map((training: TrainingByDateDetails, index: number) => {
        return (
          <View style={{ gap: 8 }} key={index} className="flex flex-col ">
            <View className="flex flex-col justify-between gap-1">
              <Text
                style={{ fontFamily: "OpenSans_700Bold" }}
                className="text-lg text-primaryColor"
              >
                Training {training.planDay.name}
              </Text>
              <View className="flex flex-row items-center">
                <Image source={gym} className="w-4 h-4" />
                <Text
                  className="text-[11px] text-white"
                  style={{
                    fontFamily: "OpenSans_400Regular",
                  }}
                >
                  {training.gym}
                </Text>
              </View>
            </View>

            <ScrollView contentContainerStyle={{ gap: 8 }}>
              {training.exercises.map((exercise, key) => {
                return (
                  <View
                    style={{ gap: 8, borderRadius: 8 }}
                    key={`exercise_${key}`}
                    className="w-full flex flex-col p-4  bg-[#282828]  border-b-[1px] border-b-white"
                  >
                    <Text
                      style={{
                        fontFamily: "OpenSans_700Bold",
                      }}
                      className="text-base font-bold text-white  border-b-[1px] border-b-white"
                    >
                      {exercise.exerciseDetails.name}:{" "}
                      {exercise.exerciseDetails.bodyPart}
                    </Text>
                    <View style={{ gap: 8 }} className="flex flex-col ">
                      {exercise.scoresDetails.map((score,key) => {
                        return (
                          <View key={`series-${key}`} className="flex flex-row justify-between">
                            <Text
                              style={{ fontFamily: "OpenSans_400Regular" }}
                              className="text-white"
                            >
                              Series: {score.series}
                            </Text>
                            <Text
                              style={{ fontFamily: "OpenSans_400Regular" }}
                              className="text-white"
                            >
                              {score.reps} x {score.weight} {score.unit}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
};
export default TrainingSession;

import { View, Text, ScrollView } from "react-native";
import TrainingSessionProps from "./props/TrainingSessionProps";
import {  TrainingByDateDetails } from "./interfaces/Training";
const TrainingSession: React.FC<TrainingSessionProps> = (props) => {
  return (
    <ScrollView contentContainerStyle={{gap:16}} className="w-full flex flex-col flex-1 pt-2">
      {props.trainings.map((training: TrainingByDateDetails) => {
        return (
          <View style={{gap:8}} className="flex flex-col ">
            <Text
              style={{ fontFamily: "OpenSans_700Bold" }}
              className="text-lg text-[#94e798]"
            >
              Training {training.planDay.name}
            </Text>
            <ScrollView  contentContainerStyle={{gap:8}}>
              {training.exercises.map((exercise) => {
                return (
                  <View style={{gap:8,borderRadius:8}} className="w-full flex flex-col p-4  bg-[#282828]  border-b-[1px] border-b-white">
                    <Text
                      style={{
                        fontFamily: "OpenSans_700Bold",
                      }}
                      className="text-base font-bold text-white  border-b-[1px] border-b-white"
                    >
                      {exercise.exerciseDetails.name}: {exercise.exerciseDetails.bodyPart}
                    </Text>
                    <View style={{gap:8}} className="flex flex-col ">
                        {exercise.scoresDetails.map(score=>{
                          return(
                            <View className="flex flex-row justify-between">
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
                          )
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

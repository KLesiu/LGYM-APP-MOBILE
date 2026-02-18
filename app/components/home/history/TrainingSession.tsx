import { View, Text, ScrollView, Image } from "react-native";
import { TrainingByDateDetails } from "./../../../../interfaces/Training";
import GymIcon from "./../../../../img/icons/gymIcon.svg";
import Card from "../../elements/Card";
import React from "react";
import { useTranslation } from "react-i18next";

interface TrainingSessionProps {
  trainings: TrainingByDateDetails[];
}

const TrainingSession: React.FC<TrainingSessionProps> = (props) => {
  const { t } = useTranslation();
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
                {t('history.trainingWithPlan', { planName: training.planDay.name })}
              </Text>
              <View className="flex flex-row items-center">
                <GymIcon />
                <Text
                  className="text-[11px] text-textColor"
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
                  <Card key={key}>
                    <View
                      style={{ gap: 8 }}
                      key={`exercise_${key}`}
                      className=" w-full flex flex-col border-b-[1px] border-b-white"
                    >
                      <Text
                        style={{
                          fontFamily: "OpenSans_700Bold",
                        }}
                        className="text-base font-bold text-textColor  border-b-[1px] border-b-white"
                      >
                        {exercise.exerciseDetails.name}:
                        {exercise.exerciseDetails.bodyPart}
                      </Text>
                      <View style={{ gap: 8 }} className="flex flex-col ">
                        {exercise.scoresDetails.map((score, key) => {
                          return (
                            <View
                              key={`series-${key}`}
                              className="flex flex-row justify-between"
                            >
                              <Text
                                style={{ fontFamily: "OpenSans_400Regular" }}
                                className="text-textColor"
                              >
                                {t('history.seriesWithValue', { series: score.series })}
                              </Text>
                              <Text
                                style={{ fontFamily: "OpenSans_400Regular" }}
                                className="text-textColor"
                              >
                                {score.reps} x {score.weight} {score.unit}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  </Card>
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

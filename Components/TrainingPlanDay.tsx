import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";
import TrainingPlanDayProps from "./props/TrainingPlanDayProps";
import { useEffect, useState } from "react";
import { PlanDayVm } from "./interfaces/PlanDay";
import { ExerciseForm } from "./interfaces/Exercise";

const TrainingPlanDay: React.FC<TrainingPlanDayProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [planDay, setPlanDay] = useState<PlanDayVm>();

  useEffect(() => {
    props.hideChooseDaySection();
    getInformationAboutPlanDay();
  }, []);

  const getInformationAboutPlanDay = async () => {
    const response = await fetch(
      `${apiURL}/api/planDay/${props.dayId}/getPlanDay`
    )
      .then((res) => res.json())
      .catch((err) => err);
    setPlanDay(response);
  };
  const renderExerciseItem = (item: {
    series: number;
    reps: string;
    exercise: ExerciseForm;
  }) => {
    return (
      <Pressable className="flex flex-col mt-4 w-[95%]  min-h-[100px] rounded-lg bg-[#4cd963b6] p-2  ">
        <Text
          className="text-base text-white font-bold"
          style={{
            fontFamily: "OpenSans_700Bold",
          }}
        >
          {item.exercise.name}
        </Text>
        <View>
          <Text
            className="text-gray-300 text-[12px] pb-1 border-b-[1px] mb-1 border-white"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Last training scores:
          </Text>
          <View className="flex flex-col gap-2">
          {Array.from({ length: item.series }).map((_, index) => (
            <View className="flex flex-col">
              <Text
                className="text-white text-sm"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                Series {index + 1}
              </Text>

              <View className="flex flex-row">
                <View className="flex flex-row gap-2 w-1/2">
                  <Text
                    key={index}
                    className="text-black text-sm"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    Reps:
                  </Text>
                  <TextInput className="text-[15px] rounded w-[45%] border-white border-[2px] text-white" />
                </View>
                <View className="flex flex-row gap-2 w-1/2">
                  <Text
                    key={index}
                    className="text-black text-sm"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    Weight:
                  </Text>
                  <TextInput className="text-[15px] rounded w-[45%] border-white border-[2px] text-white " />
                </View>
              </View>
            </View>
          ))}
          </View>
        
        </View>
      </Pressable>
    );
  };

  return (
    <View className="absolute w-full h-full text-white bg-[#000000fa] flex flex-col">
      {planDay && Object.keys(planDay).length ? (
        <View className="flex flex-col items-center p-4">
          <Text
            className="text-4xl text-white  font-bold "
            style={{
              fontFamily: "OpenSans_700Bold",
            }}
          >
            {planDay.name}
          </Text>
          <ScrollView
            className="smh:h-56 xsmh:h-72 mdh:h-[590px] lgh:h-[620px] w-full"
            contentContainerStyle={{ display: "flex", alignItems: "center" }}
          >
            {planDay.exercises.map((exercise) => renderExerciseItem(exercise))}
          </ScrollView>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default TrainingPlanDay;

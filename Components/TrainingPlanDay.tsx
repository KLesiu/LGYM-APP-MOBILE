import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import TrainingPlanDayProps from "./props/TrainingPlanDayProps";
import { useEffect, useState } from "react";
import { PlanDayVm } from "./interfaces/PlanDay";
import { ExerciseForm } from "./interfaces/Exercise";
import Switch from "./img/icons/switch.png";
import Remove from "./img/icons/remove.png";

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
      <Pressable className="flex flex-col w-full  min-h-[100px] rounded-lg bg-[#282828] p-2  ">
        <View className="flex flex-row justify-between">
          <Text
            className="text-base text-white font-bold"
            style={{
              fontFamily: "OpenSans_700Bold",
            }}
          >
            {item.exercise.name}
          </Text>
          <View style={{ gap: 8 }} className="flex flex-row">
            <Image className="w-6 h-6" source={Switch} />
            <Image className="w-6 h-6" source={Remove} />
          </View>
        </View>

        <View style={{ gap: 8 }} className="flex flex-col">
          <Text
            className="text-gray-300 text-[12px] pb-1 border-b-[1px] mb-1 border-white"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Last training scores:
          </Text>
          <View style={{ gap: 8 }} className="flex flex-col">
            {Array.from({ length: item.series }).map((_, index) => (
              <View className="flex flex-col">
                <View className="flex flex-row">
                  <View style={{ gap: 8 }} className="flex flex-row  w-1/2">
                    <Text
                      key={index}
                      className="text-white text-sm"
                      style={{ fontFamily: "OpenSans_400Regular" }}
                    >
                      Reps:
                    </Text>
                    <TextInput className="text-[15px] rounded w-[45%] border-[#575757] border-[1px] text-white" />
                  </View>
                  <View style={{ gap: 8 }} className="flex flex-row  w-1/2">
                    <Text
                      key={index}
                      className="text-white text-sm"
                      style={{ fontFamily: "OpenSans_400Regular" }}
                    >
                      Weight:
                    </Text>
                    <TextInput className="text-[15px] rounded w-[45%] border-[#575757] border-[1px] text-white " />
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
    <View className="absolute w-full h-full text-white bg-[#121212] flex flex-col">
      {planDay && Object.keys(planDay).length ? (
        <View style={{ gap: 16 }} className="flex flex-col items-center p-4">
          <View className="flex flex-col w-full">
            <Pressable onPress={props.hideDaySection} className="rounded-md flex flex-row justify-center items-center w-20 h-8 bg-[#3f3f3f]">
              <Text
                className="text-center text-sm text-white"
                style={{
                  fontFamily: "OpenSans_400Regular",
                }}
              >
                BACK
              </Text>
            </Pressable>
            <Text
              className="text-4xl text-white w-full text-center  font-bold "
              style={{
                fontFamily: "OpenSans_700Bold",
              }}
            >
              {planDay.name}
            </Text>
          </View>

          <ScrollView
            className="smh:h-56 xsmh:h-72 mdh:h-[590px] lgh:h-[620px] w-full"
            contentContainerStyle={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {planDay.exercises.map((exercise) => renderExerciseItem(exercise))}
          </ScrollView>
          <View className="w-full flex flex-row justify-between">
            <Pressable className="rounded-lg flex flex-row justify-center items-center w-28 h-14 bg-[#94e798]">
              <Text
                className="text-center text-xl text-black"
                style={{
                  fontFamily: "OpenSans_400Regular",
                }}
              >
                ADD
              </Text>
            </Pressable>
            <Pressable className="rounded-lg flex flex-row justify-center items-center w-28 h-14 bg-[#3f3f3f]">
              <Text
                className="text-center text-xl text-white"
                style={{
                  fontFamily: "OpenSans_400Regular",
                }}
              >
                DELETE
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default TrainingPlanDay;

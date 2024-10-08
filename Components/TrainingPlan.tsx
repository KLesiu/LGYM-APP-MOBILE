import {
  Text,
  View,
  TouchableOpacity,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ViewLoading from "./ViewLoading";
import ImportPlanPopUp from "./ImportPlanPopUp";
import CreatePlanConfig from "./CreatePlanConfig";
import CreatePlanDay from "./CreatePlanDay";
import { PlanDayVm } from "./interfaces/PlanDay";
import { TrainingPlanProps } from "./props/TrainingPlanProps";

const TrainingPlan: React.FC<TrainingPlanProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [planConfig, setPlanConfig] = useState<{
    name: string;
    trainingDays: number;
    _id: string;
  }>();
  const [planDays, setPlanDays] = useState<PlanDayVm[]>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [isPlanSet, setIsPlanSet] = useState<boolean>(false);
  const [isPlanDayFormVisible, setIsPlanDayFormVisible] =
    useState<boolean>(false);
  const [showPlanConfig, setShowPlanConfig] = useState<boolean>(false);
  useEffect(() => {
    init()
  }, [isPlanSet]);
  useEffect(() => {
    getPlanDays();
  }, [planConfig]);


  const init = async () => {
    setViewLoading(true);
    await getUserPlanConfig();
    setViewLoading(false);
  }

  const getPlanDays = async (): Promise<void> => {
    if (!planConfig) return;
    try {
      const response = await fetch(
        `${apiURL}/api/planDay/${planConfig._id}/getPlanDays`
      );
      if (!response.ok) return console.error("Failed to fetch plan days");
      const data = await response.json();
      setPlanDays(data);
    } catch (error) {
      console.error("Failed to fetch plan days", error);
    }
  };
  const showPlanConfigPopUp = (): void => {
    props.hideMenuButton(true);
    setShowPlanConfig(true);
  };
  const hidePlanConfigPopUp = (): void => {
    props.hideMenuButton(false);
    setShowPlanConfig(false);
  }
  const showPlanDayForm = (): void => {
    props.hideMenuButton(true);
    setIsPlanDayFormVisible(true);
  };
  const hidePlanDayForm = (): void => {
    setIsPlanDayFormVisible(false);
    props.hideMenuButton(false);
  };
  const reloadSection = (): void => {
    setIsPlanSet(true);
    setShowPlanConfig(false);
    props.hideMenuButton(false);
  };
  const renderPlanDay = ({ item }: { item: PlanDayVm }) => {
    return (
      <View
        key={item._id}
        className="flex flex-col p-4  bg-[#282828] rounded-lg w-full"
      >
        <Text
          style={{
            fontFamily: "OpenSans_700Bold",
          }}
          className="text-2xl font-bold text-[#94e798]"
        >
          {item.name}
        </Text>
        {item.exercises.map((exercise, index) => (
          <View key={index}>
            <Text
              style={{ fontFamily: "OpenSans_400Regular" }}
              className="text-lg text-white"
            >
              {exercise.exercise.name} - {exercise.series} x {exercise.reps}
            </Text>
          </View>
        ))}
      </View>
    );
  };
  const getUserPlanConfig = async (): Promise<void> => {
    const id = await AsyncStorage.getItem("id");
    try {
      const response = await fetch(`${apiURL}/api/${id}/getPlanConfig`)
      if(!response.ok) return console.error("Failed to fetch plan config")
      const result = await response.json()
      if (Object.keys(result)[0] === "msg") setPlanConfig(undefined);
      else setPlanConfig(result);
    } catch (error) {
      console.error("Failed to fetch plan config", error);
    }
  };

  return (
    <View className="flex flex-1 relative w-full bg-[#121212]">
      <View className="w-full h-full p-4 flex flex-col">
        {!planConfig ? (
          <View className="flex flex-row w-full ">
            <TouchableOpacity
              onPress={showPlanConfigPopUp}
              className="bg-[#94e798] w-40 h-12 flex items-center justify-center rounded-lg"
            >
              <Text
                className="text-black text-md w-full text-center"
                style={{
                  fontFamily: "OpenSans_700Bold",
                }}
              >
                Create plan
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text></Text>
        )}
        {planConfig && Object.keys(planConfig).length ? (
          <View
            style={{ gap: 16 }}
            className="flex flex-col h-full items-center"
          >
            <View className="flex flex-row w-full justify-around items-center">
              <Text
                className="w-full text-lg text-white  font-bold "
                style={{
                  fontFamily: "OpenSans_700Bold",
                }}
              >
                Current training plan: {planConfig.name}
              </Text>
            </View>
            <View>
              <Pressable
                className="w-40  h-12 flex items-center justify-center bg-[#94e798] rounded-lg"
                onPress={showPlanDayForm}
              >
                <Text
                  className="text-lg text-black"
                  style={{
                    fontFamily: "OpenSans_700Bold",
                  }}
                >
                  Add plan day
                </Text>
              </Pressable>
            </View>
            {planDays && planDays.length ? (
              <ScrollView className="w-full">
                <View style={{ gap: 8 }} className="flex flex-col pb-12">
                  {planDays.map((planDay) => renderPlanDay({ item: planDay }))}
                </View>
              </ScrollView>
            ) : (
              <Text></Text>
            )}
          </View>
        ) : (
          <Text></Text>
        )}
      </View>
      {viewLoading ? <ViewLoading /> : <Text></Text>}
      {showPlanConfig ? (
        <CreatePlanConfig reloadSection={reloadSection} hidePlanConfig={hidePlanConfigPopUp} />
      ) : (
        <Text></Text>
      )}
      {isPlanDayFormVisible && planConfig ? (
        <CreatePlanDay planId={planConfig._id} closeForm={hidePlanDayForm} />
      ) : (
        <Text></Text>
      )}
    </View>
  );
};
export default TrainingPlan;

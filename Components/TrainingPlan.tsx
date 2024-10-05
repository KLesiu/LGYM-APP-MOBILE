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
import {  PlanDayVm } from "./interfaces/PlanDay";
import {TrainingPlanProps} from "./props/TrainingPlanProps"

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
  const [showImportPlanPopUp, setShowImportPlanPopUp] =
    useState<boolean>(false);
  const [showPlanConfig, setShowPlanConfig] = useState<boolean>(false);
  useEffect(() => {
    setViewLoading(true);
    getUserPlanConfig();
  }, [isPlanSet]);
  useEffect(() => {
    getPlanDays();
  }, [planConfig]);

  const getPlanDays = async (): Promise<void> => {
    if (!planConfig) return;
    const response = await fetch(
      `${apiURL}/api/planDay/${planConfig._id}/getPlanDays`
    )
      .then((res) => res.json())
      .catch((err) => err);
    setPlanDays(response);
  };
  const showImportPlanPopUpFn = (): void => {
    setShowImportPlanPopUp(true);
  };
  const showPlanConfigPopUp = (): void => {
    setShowPlanConfig(true);
  };
  const showPlanDayForm = (): void => {
    props.hideMenuButton(true);
    setIsPlanDayFormVisible(true);
  };
  const hidePlanDayForm = (): void => {
    setIsPlanDayFormVisible(false);
    props.hideMenuButton(false);
  };
  const showPlanSetPopUp = (): void => {
    setShowPlanConfig(false);
  };
  const setImportPlan = async (userName: string): Promise<void> => {
    if (!userName) return;
    const id = await AsyncStorage.getItem("id");

    await fetch(`https://lgym-app-api-v2.vercel.app/api/${id}/setSharedPlan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
      }),
    })
      .then(() => {
        setShowImportPlanPopUp(false);
        setIsPlanSet(true);
      })
      .catch((err) => err);
  };
  const renderPlanDay = ({ item }: { item: PlanDayVm }) => {
    return (
      <View className="flex flex-col p-4  bg-[#1E1E1E73] rounded-lg w-full">
        <Text
          style={{
            fontFamily: "OpenSans_700Bold",
          }}
          className="text-2xl font-bold text-[#4CD964]"
        >
          {item.name}
        </Text>
        {item.exercises.map((exercise, index) => (
          <View key={index}>
            <Text  style={{ fontFamily: "OpenSans_400Regular" }} className="text-lg text-white">
              {exercise.exercise.name} - {exercise.series} x {exercise.reps}
            </Text>
          </View>
        ))}
      </View>
    );
  };
  const getUserPlanConfig = async (): Promise<void> => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${apiURL}/api/${id}/getPlanConfig`)
      .then((res) => res.json())
      .catch((err) => err);
    if (Object.keys(response)[0] === "msg") return;
    setPlanConfig(response);
    setViewLoading(false);
  };

  return (
    <View className="flex flex-1 relative w-full bg-[#131313]">
      <View className="w-full h-full p-4 flex flex-col">
        {!planConfig ? (
          <View className="flex flex-row w-full justify-around">
            <TouchableOpacity
              onPress={showPlanConfigPopUp}
              className="bg-[#4CD964] w-40 h-12 flex items-center justify-center rounded-lg"
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
            <TouchableOpacity
              className="bg-[#4CD964] w-40 h-12 flex items-center justify-center rounded-lg"
              onPress={() => showImportPlanPopUpFn()}
            >
              <Text
                className="text-black text-md w-full text-center"
                style={{
                  fontFamily: "OpenSans_700Bold",
                }}
              >
                Import plan
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text></Text>
        )}
        {planConfig && Object.keys(planConfig).length ? (
          <View style={{gap:16}} className="flex flex-col h-full items-center">
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
                className="w-40  h-12 flex items-center justify-center bg-[#4CD964] rounded-lg"
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
                <View style={{gap:8}} className="flex flex-col">
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
      {showImportPlanPopUp ? (
        <ImportPlanPopUp setImportPlan={setImportPlan} />
      ) : (
        <Text></Text>
      )}
      {showPlanConfig ? (
        <CreatePlanConfig showPlanSetPopUp={showPlanSetPopUp} />
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

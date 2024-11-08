import {
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewLoading from "../../elements/ViewLoading";
import CreatePlanConfig from "./CreatePlanConfig";
import CreatePlanDay from "./CreatePlanDay";
import { PlanDayVm } from "../../../interfaces/PlanDay";
import RemoveIcon from "./../../../img/icons/remove.png";
import { Message } from "../../../enums/Message";
import CustomButton, { ButtonSize, ButtonStyle } from "../../elements/CustomButton";
import { FontWeights } from "../../../enums/FontsProperties";

interface TrainingPlanProps{
  hideMenuButton:(hide:boolean)=>void
}

const TrainingPlan: React.FC<TrainingPlanProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [planConfig, setPlanConfig] = useState<{
    name: string;
    trainingDays: number;
    _id: string;
  }>();
  const [planDays, setPlanDays] = useState<PlanDayVm[]>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [isPlanDayFormVisible, setIsPlanDayFormVisible] =
    useState<boolean>(false);
  const [showPlanConfig, setShowPlanConfig] = useState<boolean>(false);
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setViewLoading(true);
    const result = await getUserPlanConfig();
    if (result) await getPlanDays(result);
    setViewLoading(false);
  };

  const getPlanDays = async (planConfig: {
    name: string;
    trainingDays: number;
    _id: string;
  }): Promise<void> => {
    try {
      const response = await fetch(
        `${apiURL}/api/planDay/${planConfig._id}/getPlanDays`
      );
      if (!response.ok) {
        setPlanDays([]);
        return;
      }
      const data = await response.json();
      setPlanDays(data);
    } catch (error) {
      console.error("Failed to fetch plan days", error);
    }
  };
  const deletePlanDay = async (planDayId: string): Promise<void> => {
    const response = await fetch(
      `${apiURL}/api/planDay/${planDayId}/deletePlanDay`
    );
    if (!response.ok) return console.error("Failed to delete plan day");
    const data = await response.json();
    if (data.msg === Message.Deleted) {
      init();
    }
  };
  const showPlanConfigPopUp = (): void => {
    props.hideMenuButton(true);
    setShowPlanConfig(true);
  };
  const hidePlanConfigPopUp = (): void => {
    props.hideMenuButton(false);
    setShowPlanConfig(false);
  };
  const showPlanDayForm = (): void => {
    props.hideMenuButton(true);
    setIsPlanDayFormVisible(true);
  };

  const hidePlanDayForm = async (): Promise<void> => {
    setViewLoading(true);
    setIsPlanDayFormVisible(false);
    props.hideMenuButton(false);
    setViewLoading(false);
    init();
  };
  const reloadSection = (): void => {
    setShowPlanConfig(false);``
    props.hideMenuButton(false);
    init();
  };

  const renderPlanDay = ({ item }: { item: PlanDayVm }) => {
    const imageSlot: JSX.Element[] = [<Image className="w-6 h-6" source={RemoveIcon} />]
    return (
      <View
        key={item._id}
        style={{ borderRadius: 8 }}
        className="flex flex-col p-4  bg-[#282828]  w-full"
      >
        <View className="flex flex-row justify-between w-full">
          <Text
            style={{
              fontFamily: "OpenSans_700Bold",
            }}
            className="text-2xl font-bold text-[#94e798]"
          >
            {item.name}
          </Text>
            <CustomButton buttonStyleSize={ButtonSize.small}  onPress={()=>deletePlanDay(item._id)} customSlots={imageSlot}/>
        </View>

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
  const getUserPlanConfig = async () => {
    const id = await AsyncStorage.getItem("id");
    try {
      const response = await fetch(`${apiURL}/api/${id}/getPlanConfig`);
      if (!response.ok) return console.error("Failed to fetch plan config");
      const result = await response.json();
      if (Object.keys(result)[0] === "msg") setPlanConfig(undefined);
      else {
        setPlanConfig(result);
        return result;
      }
    } catch (error) {
      console.error("Failed to fetch plan config", error);
    }
  };

  return (
    <View className="flex flex-1 relative w-full bg-[#121212]">
      <View className="w-full h-full p-4 flex flex-col">
        {!planConfig ? (
          <View className="flex flex-row w-full">
            <CustomButton  onPress={showPlanConfigPopUp} text="Create plan" textWeight={FontWeights.bold} buttonStyleType={ButtonStyle.success}/>
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
              <CustomButton  text="Add plan day" onPress={showPlanDayForm} buttonStyleType={ButtonStyle.success} textWeight={FontWeights.bold}/>
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
        <CreatePlanConfig
          reloadSection={reloadSection}
          hidePlanConfig={hidePlanConfigPopUp}
        />
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

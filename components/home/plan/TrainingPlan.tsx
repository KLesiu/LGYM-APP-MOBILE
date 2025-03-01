import { Text, View, Image, ScrollView, Pressable } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewLoading from "../../elements/ViewLoading";
import CreatePlanConfig from "./CreatePlanConfig";
import CreatePlanDay from "./planDay/CreatePlanDay";
import { PlanDayBaseInfoVm, PlanDayVm } from "../../../interfaces/PlanDay";
import RemoveIcon from "./../../../img/icons/remove.png";
import { Message } from "../../../enums/Message";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import { FontWeights } from "../../../enums/FontsProperties";
import ConfirmDialog from "../../elements/ConfirmDialog";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
interface TrainingPlanProps {
  hideMenuButton: (hide: boolean) => void;
}

const TrainingPlan: React.FC<TrainingPlanProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [planConfig, setPlanConfig] = useState<{
    name: string;
    trainingDays: number;
    _id: string;
  }>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [planDaysBaseInfo,setPlanDaysBaseInfo] = useState<PlanDayBaseInfoVm[]>([]);
  const [isPlanDayFormVisible, setIsPlanDayFormVisible] =
    useState<boolean>(false);
  const [showPlanConfig, setShowPlanConfig] = useState<boolean>(false);
  const [currentPlanDay, setCurrentPlanDay] = useState<PlanDayBaseInfoVm>();
  const [
    isDeletePlanDayConfirmationDialogVisible,
    setIsDeletePlanDayConfirmationDialogVisible,
  ] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setViewLoading(true);
    const result = await getUserPlanConfig();
    if(result)await getPlanDaysBaseInfo(result);
    setViewLoading(false);
  };

  const getPlanDaysBaseInfo = async (planConfig: {
    name: string;
    trainingDays: number;
    _id: string;
  }):Promise<void> =>{
    if(!planConfig || !planConfig._id) return;
    const response = await fetch(`${apiURL}/api/planDay/${planConfig._id}/getPlanDaysInfo`);
    const result = await response.json();
    setPlanDaysBaseInfo(result);
  }

  const deletePlanDay = async (): Promise<void> => {
    if (!currentPlanDay) return;
    const response = await fetch(
      `${apiURL}/api/planDay/${currentPlanDay._id}/deletePlanDay`
    );
    if (!response.ok) return console.error("Failed to delete plan day");
    const data = await response.json();
    if (data.msg === Message.Deleted) {
      init();
    }
    deletePlanDayVisible(false);
  };
  const togglePlanConfigPopUp = (value:boolean): void => {
    props.hideMenuButton(value);
    setShowPlanConfig(value);
  }
  const showPlanDayForm = (planDay?:PlanDayBaseInfoVm): void => {
    setCurrentPlanDay(planDay);
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
    setShowPlanConfig(false);
    props.hideMenuButton(false);
    init();
  };
  const renderPlanDay = ({ item }: { item: PlanDayBaseInfoVm }) => {
    const removeSlot: JSX.Element[] = [
      <Image className="w-6 h-6" source={RemoveIcon} />,
    ];
    return (
      <View key={item._id} className="w-full" style={{ gap: 10 }}>
        <Text
          style={{ fontFamily: "OpenSans_400Regular" }}
          className="text-base text-white"
        >
          Last training: {item.lastTrainingDate ? new Date(item.lastTrainingDate).toLocaleDateString() : "No training yet" }
        </Text>
        <Pressable
          className="w-full bg-fourthColor flex flex-row p-2 rounded-lg justify-between items-start"
          style={{ gap: 20 }}
          onPress={() => showPlanDayForm(item)}
        >
          <View className="flex flex-col" style={{ gap: 4 }}>
            <Text
              style={{
                fontFamily: "OpenSans_700Bold",
              }}
              className="text-xl font-bold text-white"
            >
              {item.name}
            </Text>
            <Text
              style={{
                fontFamily: "OpenSans_400Regular",
              }}
              className="text-base  text-fifthColor"
            >
              Exercises: {item.totalNumberOfExercises}
            </Text>
            <View className="flex flex-row w-full " style={{ gap: 16 }}>
              <Text
                style={{
                  fontFamily: "OpenSans_400Regular",
                }}
                className="text-base  text-fifthColor"
              >
                Total series: {item.totalNumberOfSeries}
              </Text>
            </View>
          </View>
          <View className="flex justify-center items-center w-12 h-12 bg-secondaryColor70 rounded-lg ">
            <CustomButton
              buttonStyleSize={ButtonSize.small}
              onPress={() => deletePlanDayVisible(true, item)}
              customSlots={removeSlot}
            />
          </View>
        </Pressable>
      </View>
    );
  };
  const getUserPlanConfig = async () => {
    const id = await AsyncStorage.getItem("id");

    const response = await fetch(`${apiURL}/api/${id}/getPlanConfig`);
    const result = await response.json();
    if (Object.keys(result)[0] === "msg") setPlanConfig(undefined);
    else {
      setPlanConfig(result);
      return result;
    }
  };
  const deletePlanDayVisible = (visible: boolean, planDay?: PlanDayBaseInfoVm) => {
    if (visible) setCurrentPlanDay(planDay);
    else setCurrentPlanDay(undefined);
    setIsDeletePlanDayConfirmationDialogVisible(visible);
  };

  return (
    <BackgroundMainSection>
      <View className="w-full h-full flex flex-col">
        {!planConfig ? (
          <View className="flex flex-row w-full">
            <CustomButton
              onPress={()=>togglePlanConfigPopUp(true)}
              text="Create plan"
              textWeight={FontWeights.bold}
              buttonStyleType={ButtonStyle.success}
            />
          </View>
        ) : (
          <View className="flex flex-col h-full">
            <View className="p-5" style={{ gap: 32 }}>
              <View>
                <Text
                  className="text-base text-primaryColor  font-bold"
                  style={{
                    fontFamily: "OpenSans_700Bold",
                  }}
                >
                  Current training plan:
                </Text>
                <Text
                  style={{
                    fontFamily: "OpenSans_700Bold",
                  }}
                  className="text-3xl text-white font-bold"
                >
                  {planConfig.name}
                </Text>
              </View>
              <CustomButton
                text="Add plan day"
                onPress={showPlanDayForm}
                buttonStyleType={ButtonStyle.success}
                textWeight={FontWeights.bold}
                buttonStyleSize={ButtonSize.regular}
                width="w-44"
              />
            </View>

            {planDaysBaseInfo && planDaysBaseInfo.length ? (
              <ScrollView className="w-full">
                <View style={{ gap: 16 }} className="flex flex-col p-5 pb-12">
                  {planDaysBaseInfo.map((planDay) => renderPlanDay({ item: planDay }))}
                </View>
              </ScrollView>
            ) : (
              <Text></Text>
            )}
          </View>
        )}
      </View>
      {viewLoading ? <ViewLoading /> : <Text></Text>}
      {showPlanConfig ? (
        <CreatePlanConfig
          reloadSection={reloadSection}
          hidePlanConfig={()=>togglePlanConfigPopUp(false)}
        />
      ) : (
        <Text></Text>
      )}
      {isPlanDayFormVisible && planConfig ? (
        <CreatePlanDay
          planId={planConfig._id}
          closeForm={hidePlanDayForm}
          planDayId={currentPlanDay ? currentPlanDay._id : ""}
        />
      ) : (
        <Text></Text>
      )}
      <ConfirmDialog
        visible={isDeletePlanDayConfirmationDialogVisible}
        title={`Delete: ${currentPlanDay ? currentPlanDay.name : ""}`}
        message={`Are you sure you want to delete?`}
        onConfirm={deletePlanDay}
        onCancel={() => deletePlanDayVisible(false)}
      />
    </BackgroundMainSection>
  );
};
export default TrainingPlan;

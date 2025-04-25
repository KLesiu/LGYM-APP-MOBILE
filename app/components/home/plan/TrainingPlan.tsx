import { Text, View, Image, ScrollView, Pressable } from "react-native";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewLoading from "../../elements/ViewLoading";
import CreatePlanConfig from "./CreatePlanConfig";
import CreatePlanDay from "./planDay/CreatePlanDay";
import { PlanDayBaseInfoVm, PlanDayVm } from "./../../../../interfaces/PlanDay";
import { Message } from "./../../../../enums/Message";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import { FontWeights } from "./../../../../enums/FontsProperties";
import ConfirmDialog from "../../elements/ConfirmDialog";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import TrainingPlanItem from "./TrainingPlanItem";
import PlanDayProvider from "./planDay/CreatePlanDayContext";
import { useHomeContext } from "../HomeContext";

const TrainingPlan: React.FC = () => {
  const { apiURL, toggleMenuButton,hideMenu } = useHomeContext();
  const [planConfig, setPlanConfig] = useState<{
    name: string;
    trainingDays: number;
    _id: string;
  }>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [planDaysBaseInfo, setPlanDaysBaseInfo] = useState<PlanDayBaseInfoVm[]>(
    []
  );
  const [isPlanDayFormVisible, setIsPlanDayFormVisible] =
    useState<boolean>(false);
  const [isPreviewPlanDay, setIsPreviewPlanDay] = useState<boolean | undefined>(
    false
  );
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
    if (result) await getPlanDaysBaseInfo(result);
    setViewLoading(false);
  };

  const getPlanDaysBaseInfo = async (planConfig: {
    name: string;
    trainingDays: number;
    _id: string;
  }): Promise<void> => {
    if (!planConfig || !planConfig._id) return;
    const response = await fetch(
      `${apiURL}/api/planDay/${planConfig._id}/getPlanDaysInfo`
    );
    const result = await response.json();
    setPlanDaysBaseInfo(result);
  };

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

  const togglePlanConfigPopUp = useCallback((value: boolean): void => {
    toggleMenuButton(value);
    setShowPlanConfig(value);
  }, []);

  const showPlanDayForm = useCallback(
    (planDay?: PlanDayBaseInfoVm, isPreview?: boolean): void => {
      setCurrentPlanDay(planDay);
      setIsPreviewPlanDay(isPreview);
      toggleMenuButton(true);
      setIsPlanDayFormVisible(true);
    },
    []
  );

  const hidePlanDayForm = useCallback(async (): Promise<void> => {
    setViewLoading(true);
    setIsPlanDayFormVisible(false);
    toggleMenuButton(false);
    setViewLoading(false);
    hideMenu()
    await init();
  }, []);

  const reloadSection = useCallback(async (): Promise<void> => {
    setShowPlanConfig(false);
    toggleMenuButton(false);
    await init();
  }, []);

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

  const deletePlanDayVisible = useCallback(
    (visible: boolean, planDay?: PlanDayBaseInfoVm) => {
      if (visible) setCurrentPlanDay(planDay);
      else setCurrentPlanDay(undefined);
      setIsDeletePlanDayConfirmationDialogVisible(visible);
    },
    []
  );

  return (
    <BackgroundMainSection>
      <View className="w-full h-full flex flex-col">
        {!planConfig ? (
          <View className="flex flex-row w-full justify-center items-center h-full">
            <CustomButton
              onPress={() => togglePlanConfigPopUp(true)}
              text="Create plan"
              textWeight={FontWeights.bold}
              buttonStyleType={ButtonStyle.success}
            />
          </View>
        ) : (
          <View className="flex flex-col h-full">
            <View className="p-5" style={{ gap: 16 }}>
              <View>
                <Text
                  className="smallPhone:text-sm midPhone:text-base text-primaryColor  font-bold"
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
                  className="smallPhone:text-xl midPhone:text-3xl text-white font-bold"
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
                  {planDaysBaseInfo.map((planDay) => (
                    <TrainingPlanItem
                      key={planDay._id}
                      item={planDay}
                      showPlanDayForm={showPlanDayForm}
                      deletePlanDayVisible={deletePlanDayVisible}
                    />
                  ))}
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
          hidePlanConfig={() => togglePlanConfigPopUp(false)}
        />
      ) : (
        <Text></Text>
      )}
      {isPlanDayFormVisible && planConfig ? (
        <PlanDayProvider closeForm={hidePlanDayForm}>
          <CreatePlanDay
            isPreview={isPreviewPlanDay}
            planId={planConfig._id}
            planDayId={currentPlanDay ? currentPlanDay._id : ""}
          />
        </PlanDayProvider>
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

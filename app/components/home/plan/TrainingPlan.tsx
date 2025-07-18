import { Text, View, ScrollView } from "react-native";
import { useState, useEffect, useCallback } from "react";
import ViewLoading from "../../elements/ViewLoading";
import CreatePlanConfig from "./CreatePlanConfig";
import CreatePlanDay from "./planDay/CreatePlanDay";
import { PlanDayBaseInfoVm } from "./../../../../interfaces/PlanDay";
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
import { useAppContext } from "../../../AppContext";

const TrainingPlan: React.FC = () => {
  const { toggleMenuButton, hideMenu, userId } = useHomeContext();
  const { getAPI } = useAppContext();
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
    await getUserPlanConfig();
  };

  const getPlanDaysBaseInfo = async (planConfig: {
    name: string;
    trainingDays: number;
    _id: string;
  }): Promise<void> => {
    if (!planConfig || !planConfig._id) return;
    await getAPI(
      `/planDay/${planConfig._id}/getPlanDaysInfo`,
      (result: PlanDayBaseInfoVm[]) => {
        setPlanDaysBaseInfo(result);
      },
      undefined,
      false
    );
  };

  const deletePlanDay = async (): Promise<void> => {
    if (!currentPlanDay) return;
    await getAPI(
      `/planDay/${currentPlanDay._id}/deletePlanDay`,
      () => init(),
      undefined,
      false
    );
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
    hideMenu();
    await init();
  }, []);

  const reloadSection = useCallback(async (): Promise<void> => {
    setShowPlanConfig(false);
    toggleMenuButton(false);
    await init();
  }, []);

  const getUserPlanConfig = async () => {
    try {
      await getAPI(
        `/${userId}/getPlanConfig`,
        async (result: { name: string; trainingDays: number; _id: string }) => {
          setPlanConfig(result);
          await getPlanDaysBaseInfo(result);
        },
        undefined,
        false
      );
    } finally {
      setViewLoading(false);
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
        {viewLoading ? (
          <ViewLoading />
        ) : !planConfig ? (
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
                  className="text-base smallPhone:text-sm text-primaryColor  font-bold"
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
                  className="text-3xl smallPhone:text-xl text-white font-bold"
                >
                  {planConfig.name}
                </Text>
              </View>
              <CustomButton
                text="Add plan day"
                textSize="smallPhone:text-sm"
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
              <ViewLoading />
            )}
          </View>
        )}
      </View>
      {showPlanConfig && (
        <CreatePlanConfig
          reloadSection={reloadSection}
          hidePlanConfig={() => togglePlanConfigPopUp(false)}
        />
      )}
      {isPlanDayFormVisible && planConfig && (
        <PlanDayProvider closeForm={hidePlanDayForm}>
          <CreatePlanDay
            isPreview={isPreviewPlanDay}
            planId={planConfig._id}
            planDayId={currentPlanDay ? currentPlanDay._id : ""}
          />
        </PlanDayProvider>
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

import { Text, View, ScrollView } from "react-native";
import { useState, useCallback, useMemo } from "react";
import ViewLoading from "../../elements/ViewLoading";
import CreatePlanConfig from "./CreatePlanConfig";
import CreatePlanDay from "./planDay/CreatePlanDay";
import { PlanDayBaseInfoVm } from "./../../../../interfaces/PlanDay";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import PlanIcon from "./../../../../img/icons/planIcon.svg";
import ShareIcon from "./../../../../img/icons/shareIcon.svg";
import { FontWeights } from "./../../../../enums/FontsProperties";
import ConfirmDialog from "../../elements/ConfirmDialog";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import TrainingPlanItem from "./TrainingPlanItem";
import PlanDayProvider from "./planDay/CreatePlanDayContext";
import { useHomeContext } from "../HomeContext";
import PlansList from "./PlansList";
import { PlanForm } from "../../../../interfaces/Plan";
import DeleteIcon from "./../../../../img/icons/deleteIcon.svg";
import React from "react";
import PlanShareDialog from "./PlanShareDialog";
import PlanCopyDialog from "./PlanCopyDialog";
import {
  useGetApiIdGetPlanConfig,
  usePostApiCopy,
  usePostApiIdSetNewActivePlan,
  usePostApiIdDeletePlan,
} from "../../../../api/generated/plan/plan";
import {
  useGetApiPlanDayIdGetPlanDaysInfo,
  useGetApiPlanDayIdDeletePlanDay,
} from "../../../../api/generated/plan-day/plan-day";
import { useAppContext } from "../../../AppContext";
import { useQueryClient } from "@tanstack/react-query";
import { getGetApiIdGetPlanConfigQueryKey } from "../../../../api/generated/plan/plan";

import Toast from "react-native-toast-message";

const TrainingPlan: React.FC = () => {
  const { toggleMenuButton, hideMenu, userId } = useHomeContext();
  const queryClient = useQueryClient();

  const [isSwitchingPlan, setIsSwitchingPlan] = useState<boolean>(false);

  const {
    data: planConfigData,
    isLoading: isPlanConfigLoading,
  } = useGetApiIdGetPlanConfig(userId, { query: { enabled: !!userId } });

  const planConfig = useMemo(
    () => (planConfigData?.data as PlanForm) || undefined,
    [planConfigData]
  );

  const {
    data: planDaysData,
    isLoading: isPlanDaysLoading,
    refetch: refetchPlanDays,
  } = useGetApiPlanDayIdGetPlanDaysInfo(planConfig?._id || "", {
    query: { enabled: !!planConfig?._id },
  });

  const planDaysBaseInfo = useMemo(
    () => (planDaysData?.data as PlanDayBaseInfoVm[]) || [],
    [planDaysData]
  );

  const { mutateAsync: copyPlanMutation } = usePostApiCopy();
  const { mutateAsync: setNewActivePlanMutation } = usePostApiIdSetNewActivePlan();
  const { mutateAsync: deletePlanMutation } = usePostApiIdDeletePlan();

  const [isPlanDayFormVisible, setIsPlanDayFormVisible] =
    useState<boolean>(false);
  const [isPlansListVisible, setIsPlansListVisible] = useState<boolean>(false);
  const [isPreviewPlanDay, setIsPreviewPlanDay] = useState<boolean | undefined>(
    false
  );
  const [showPlanConfig, setShowPlanConfig] = useState<boolean>(false);
  const [currentPlanDay, setCurrentPlanDay] = useState<PlanDayBaseInfoVm>();
  const [
    isDeletePlanDayConfirmationDialogVisible,
    setIsDeletePlanDayConfirmationDialogVisible,
  ] = useState<boolean>(false);
  const [isShareCodeDialogShowed, setIsShareCodeDialogShowed] =
    useState<boolean>(false);
  const [isCopyPlanDialogShowed, setIsCopyPlanDialogShowed] =
    useState<boolean>(false);
  const [
    isDeletePlanConfirmationDialogVisible,
    setIsDeletePlanConfirmationDialogVisible,
  ] = useState<boolean>(false);

  const isLoading = isPlanConfigLoading || isPlanDaysLoading || isSwitchingPlan;

  const refetchAll = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetApiIdGetPlanConfigQueryKey(userId) });
    if (planConfig?._id) {
        // We rely on React Query dependency to fetch plan days, but we can invalidate to be sure
        // The key for plan days depends on planConfig._id
    }
  };

  const { refetch: triggerDeletePlanDay } = useGetApiPlanDayIdDeletePlanDay(
    currentPlanDay?._id || "",
    { query: { enabled: false } }
  );

  const handleDeletePlanDayConfirm = async () => {
      await triggerDeletePlanDay();
      await refetchPlanDays();
      deletePlanDayVisible(false);
  }


  const togglePlanConfigPopUp = useCallback((value: boolean): void => {
    if (value) {
      setIsPlansListVisible(false);
    }
    toggleMenuButton(value);
    setShowPlanConfig(value);
  }, [toggleMenuButton]);

  const showPlanDayForm = useCallback(
    (planDay?: PlanDayBaseInfoVm, isPreview?: boolean): void => {
      setCurrentPlanDay(planDay);
      setIsPreviewPlanDay(isPreview);
      toggleMenuButton(true);
      setIsPlanDayFormVisible(true);
    },
    [toggleMenuButton]
  );

  const showPlansList = useCallback((): void => {
    setIsPlansListVisible(true);
    toggleMenuButton(true);
  }, [toggleMenuButton]);

  const hidePlansList = useCallback((): void => {
    setIsPlansListVisible(false);
    toggleMenuButton(false);
  }, [toggleMenuButton]);

  const showShareCodeDialog = useCallback((): void => {
    setIsShareCodeDialogShowed(true);
    toggleMenuButton(true);
  }, [toggleMenuButton]);

  const hideShareCodeDialog = useCallback((): void => {
    setIsShareCodeDialogShowed(false);
    toggleMenuButton(false);
  }, [toggleMenuButton]);

  const hidePlanDayForm = useCallback(async (): Promise<void> => {
    setIsPlanDayFormVisible(false);
    toggleMenuButton(false);
    hideMenu();
    await refetchPlanDays();
  }, [toggleMenuButton, hideMenu, refetchPlanDays]);

  const reloadSection = useCallback(async (): Promise<void> => {
    setShowPlanConfig(false);
    toggleMenuButton(false);
    await refetchAll();
  }, [toggleMenuButton]);


  const copyPlan = async (code: string) => {
    try {
      await copyPlanMutation({ data: { shareCode: code } });
      await refetchAll();
      hideCopyPlanDialog();
      hidePlansList();
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e.response?.data?.msg || "Failed to copy plan",
      });
    }
  };

  const showCopyPlanDialog = () => {
    setIsCopyPlanDialogShowed(true);
    toggleMenuButton(true);
  };

  const hideCopyPlanDialog = () => {
    setIsCopyPlanDialogShowed(false);
    toggleMenuButton(false);
  };

  const setNewPlanConfig = async (newPlanConfig: PlanForm) => {
    hidePlansList();
    if (newPlanConfig._id === planConfig?._id || isSwitchingPlan) return;
    await changeActivePlan(newPlanConfig);
  };

  const changeActivePlan = async (newPlanConfig: PlanForm) => {
    try {
        if(newPlanConfig._id){
            setIsSwitchingPlan(true);
            await setNewActivePlanMutation({ id: userId, data: { _id: newPlanConfig._id } as any });
            await queryClient.invalidateQueries({ queryKey: getGetApiIdGetPlanConfigQueryKey(userId) });
        }
    } catch (e: unknown) {
      console.error(e);
    } finally {
        setIsSwitchingPlan(false);
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

  const deletePlan = async () => {
    try {
      if (planConfig?._id) {
        await deletePlanMutation({ id: planConfig._id });
        // Explicitly set the query data to null to force "no plan" state
        queryClient.setQueryData(getGetApiIdGetPlanConfigQueryKey(userId), null);
        await refetchAll();
      }
    } finally {
      setIsDeletePlanConfirmationDialogVisible(false);
    }
  };

  return (
    <BackgroundMainSection>
      <View className="w-full h-full flex flex-col">
        {isLoading ? (
          <ViewLoading />
        ) : !planConfig ? (
          <View className="flex flex-row w-full justify-center items-center h-full">
            <CustomButton
              onPress={() => togglePlanConfigPopUp(true)}
              text="Create plan"
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
                  className="text-3xl smallPhone:text-xl text-textColor font-bold"
                >
                  {planConfig.name}
                </Text>
              </View>

              <View className="flex flex-row" style={{ gap: 16 }}>
                <CustomButton
                  text="Add training day"
                  onPress={() => showPlanDayForm(undefined)}
                  buttonStyleType={ButtonStyle.success}
                  textWeight={FontWeights.bold}
                  buttonStyleSize={ButtonSize.long}
                  customClasses="flex-1"
                />
                <View className="flex justify-center items-center w-12 smallPhone:w-10 h-12 smallPhone:h-10 bg-secondaryColor70 rounded-lg ">
                  <CustomButton
                    onPress={showPlansList}
                    buttonStyleSize={ButtonSize.small}
                    customSlots={[<PlanIcon />]}
                  />
                </View>
                <View className="flex justify-center items-center w-12 smallPhone:w-10 h-12 smallPhone:h-10 bg-secondaryColor70 rounded-lg ">
                  <CustomButton
                    onPress={()=> setIsDeletePlanConfirmationDialogVisible(true)}
                    buttonStyleSize={ButtonSize.small}
                    customSlots={[<DeleteIcon />]}
                  />
                </View>
                <View className="flex justify-center items-center w-12 smallPhone:w-10 h-12 smallPhone:h-10 bg-secondaryColor70 rounded-lg ">
                  <CustomButton
                    onPress={showShareCodeDialog}
                    buttonStyleSize={ButtonSize.small}
                    customSlots={[<ShareIcon />]}
                  />
                </View>
              </View>
            </View>

            {planDaysBaseInfo ? (
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
      {isPlansListVisible && (
        <PlansList
          togglePlanConfig={togglePlanConfigPopUp}
          showCopyPlanDialog={showCopyPlanDialog}
          goBack={hidePlansList}
          setNewPlanConfig={setNewPlanConfig}
        />
      )}
      {isShareCodeDialogShowed && planConfig && (
        <PlanShareDialog
          visible={isShareCodeDialogShowed}
          onCancel={hideShareCodeDialog}
          plan={planConfig}
        />
      )}
      {isCopyPlanDialogShowed && (
        <PlanCopyDialog
          visible={isCopyPlanDialogShowed}
          onCancel={() => setIsCopyPlanDialogShowed(false)}
          copyPlan={copyPlan}
        />
      )}
      <ConfirmDialog
        visible={isDeletePlanDayConfirmationDialogVisible}
        title={`Delete: ${currentPlanDay ? currentPlanDay.name : ""}`}
        message={`Are you sure you want to delete?`}
        onConfirm={handleDeletePlanDayConfirm}
        onCancel={() => deletePlanDayVisible(false)}
      />
      <ConfirmDialog
        visible={isDeletePlanConfirmationDialogVisible}
        title={`Delete: ${planConfig ? planConfig.name : ""}`}
        message={`Are you sure you want to delete?`}
        onConfirm={deletePlan}
        onCancel={() => setIsDeletePlanConfirmationDialogVisible(false)}
      />
    </BackgroundMainSection>
  );
};
export default TrainingPlan;

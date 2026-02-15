import { View, Text, ScrollView } from "react-native";
import { useHomeContext } from "../HomeContext";
import { PlanForm } from "../../../../interfaces/Plan";
import { useMemo } from "react";
import Dialog from "../../elements/Dialog";
import ViewLoading from "../../elements/ViewLoading";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import PlansListItem from "./PlansListItem";
import React from "react";
import { FontWeights } from "../../../../enums/FontsProperties";
import { useGetApiIdGetPlansList } from "../../../../api/generated/plan/plan";

interface PlansListProps {
  togglePlanConfig: (value: boolean) => void;
  goBack: () => void;
  setNewPlanConfig: (planConfig: PlanForm) => Promise<void>;
  showCopyPlanDialog: () => void;
}

const PlansList: React.FC<PlansListProps> = ({
  togglePlanConfig,
  goBack,
  setNewPlanConfig,
  showCopyPlanDialog,
}) => {
  const { userId } = useHomeContext();

  const { data: plansData, isLoading } = useGetApiIdGetPlansList(userId, {
    query: { enabled: !!userId },
  });

  const plansList = useMemo(() => {
    return (plansData?.data as PlanForm[]) || [];
  }, [plansData]);

  return (
    <>
      <Dialog>
        <View className="w-full h-full">
          <View className="px-5 py-2">
            <Text
              className="text-3xl smallPhone:text-xl text-textColor"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              Your Plans
            </Text>
          </View>
          {isLoading ? (
            <ViewLoading />
          ) : (
            <ScrollView className="w-full px-5 py-2">
              <View className="flex flex-col pb-12" style={{ gap: 12 }}>
                {plansList.map((plan) => (
                  <PlansListItem
                    key={plan._id}
                    setNewPlanConfig={setNewPlanConfig}
                    planListItem={plan}
                  />
                ))}
              </View>
            </ScrollView>
          )}

          <View
            className="p-5 flex flex-row justify-between"
            style={{ gap: 20 }}
          >
            <CustomButton
              buttonStyleType={ButtonStyle.outlineBlack}
              onPress={goBack}
              textWeight={FontWeights.bold}
              text="Back"
              width="flex-1"
            />
            <CustomButton
              buttonStyleType={ButtonStyle.default}
              onPress={showCopyPlanDialog}
              textWeight={FontWeights.bold}
              text="Copy plan"
              width="flex-1"
            />
            <CustomButton
              buttonStyleType={ButtonStyle.success}
              onPress={() => togglePlanConfig(true)}
              textWeight={FontWeights.bold}
              text="Create new"
              width="flex-1"
            />
          </View>
        </View>
      </Dialog>
    </>
  );
};

export default PlansList;

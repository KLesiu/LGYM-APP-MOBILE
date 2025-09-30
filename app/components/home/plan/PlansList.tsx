import { View, Text, ScrollView } from "react-native";
import { useAppContext } from "../../../AppContext";
import { useHomeContext } from "../HomeContext";
import ResponseMessage from "../../../../interfaces/ResponseMessage";
import { PlanForm } from "../../../../interfaces/Plan";
import { useEffect, useState } from "react";
import Dialog from "../../elements/Dialog";
import ViewLoading from "../../elements/ViewLoading";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import PlansListItem from "./PlansListItem";
import React from "react";

interface PlansListProps {
  togglePlanConfig: (value: boolean) => void;
  goBack: () => void;
  setNewPlanConfig: (planConfig: PlanForm) => Promise<void>;
}

const PlansList: React.FC<PlansListProps> = ({
  togglePlanConfig,
  goBack,
  setNewPlanConfig,
}) => {
  const { getAPI } = useAppContext();
  const [plansList, setPlansList] = useState<PlanForm[]>([]);
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const { userId } = useHomeContext();

  useEffect(() => {
    getPlansList();
  });

  const getPlansList = async (): Promise<void> => {
    setViewLoading(true);

    await getAPI(
      `/${userId}/getPlansList`,
      (result: ResponseMessage | PlanForm[]) => {
        if (Array.isArray(result)) setPlansList(result);
      },
      undefined,
      false
    );
    setViewLoading(false);
  };
  return (
    <>
      <Dialog>
        <View className="w-full h-full">
          <View className="px-5 py-2">
            <Text
              className="text-3xl smallPhone:text-xl text-white"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              Your Plans
            </Text>
          </View>
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

          <View
            className="p-5 flex flex-row justify-between"
            style={{ gap: 20 }}
          >
            <CustomButton
              buttonStyleType={ButtonStyle.outlineBlack}
              onPress={goBack}
              text="Back"
              width="flex-1"
            />
            <CustomButton
              buttonStyleType={ButtonStyle.success}
              onPress={() => togglePlanConfig(true)}
              text="Create new plan"
              width="flex-1"
            />
          </View>
        </View>
      </Dialog>
      {viewLoading ? <ViewLoading /> : <></>}
    </>
  );
};

export default PlansList;

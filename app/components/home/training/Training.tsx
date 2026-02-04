import { Text, View } from "react-native";
import { useState, useEffect } from "react";
import ViewLoading from "../../elements/ViewLoading";
import React from "react";
import { useHomeContext } from "../HomeContext";
import NonTrainingView from "./NonTrainingView";
import TrainingView from "./TrainingView";
import { useGetApiIdCheckIsUserHavePlan } from "../../../../api/generated/plan/plan";

const Training: React.FC = () => {
  const { userId } = useHomeContext();
  const [isUserHavePlan, setIsUserHavePlan] = useState<boolean>(false);
  const [viewLoading, setViewLoading] = useState<boolean>(true);

  const { data: planCheckResponse, isLoading, refetch } = useGetApiIdCheckIsUserHavePlan(
    userId,
    { query: { enabled: false } }
  );

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await checkIsUserHavePlan();
  };

  const checkIsUserHavePlan = async () => {
    try {
      await refetch();
      setIsUserHavePlan(planCheckResponse?.data ?? false);
    } catch (error) {
      console.error("Error checking if user has a plan:", error);
      setIsUserHavePlan(false);
    } finally {
      setViewLoading(false);
    }
  };

  if (viewLoading)
    return (
      <View className="bg-bgColor flex-1 w-full">
        <ViewLoading />
      </View>
    );

  return (
    <View className="bg-bgColor flex-1 w-full">
      {isUserHavePlan ? <TrainingView /> : <NonTrainingView />}
    </View>
  );
};
export default Training;

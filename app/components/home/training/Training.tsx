import { Text, View } from "react-native";
import { useState, useEffect, useMemo } from "react";
import ViewLoading from "../../elements/ViewLoading";
import React from "react";
import { useHomeContext } from "../HomeContext";
import NonTrainingView from "./NonTrainingView";
import TrainingView from "./TrainingView";
import { useGetApiIdCheckIsUserHavePlan } from "../../../../api/generated/plan/plan";

const Training: React.FC = () => {
  const { userId } = useHomeContext();

  const { data: planCheckResponse, isLoading } = useGetApiIdCheckIsUserHavePlan(
    userId,
    { query: { enabled: !!userId } }
  );

  const isUserHavePlan = useMemo(
    () => planCheckResponse?.data ?? false,
    [planCheckResponse]
  );

  if (isLoading)
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

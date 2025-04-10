import { Text, View } from "react-native";
import { useState, useEffect } from "react";
import ViewLoading from "../../elements/ViewLoading";
import React from "react";
import { useHomeContext } from "../HomeContext";
import NonTrainingView from "./NonTrainingView";
import TrainingView from "./TrainingView";

const Training: React.FC = () => {
  const {apiURL, userId } = useHomeContext();
  const [isUserHavePlan, setIsUserHavePlan] = useState<boolean>(false);
  const [viewLoading, setViewLoading] = useState<boolean>(false);
 
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setViewLoading(true);
    await checkIsUserHavePlan();
    setViewLoading(false);
  };

  const checkIsUserHavePlan = async () => {
    const response = await fetch(`${apiURL}/api/${userId}/checkIsUserHavePlan`);
    const result = await response.json();
    setIsUserHavePlan(result);
  };


  return (
    <View className="bg-bgColor flex-1 w-full">
      {isUserHavePlan ? <TrainingView /> : <NonTrainingView />}
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </View>
  );
};
export default Training;

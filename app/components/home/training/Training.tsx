import { Text, View } from "react-native";
import { useState, useEffect } from "react";
import ViewLoading from "../../elements/ViewLoading";
import React from "react";
import { useHomeContext } from "../HomeContext";
import NonTrainingView from "./NonTrainingView";
import TrainingView from "./TrainingView";
import { useAppContext } from "../../../AppContext";

const Training: React.FC = () => {
  const { userId } = useHomeContext();
  const [isUserHavePlan, setIsUserHavePlan] = useState<boolean>(false);
  const { getAPI } = useAppContext();
  const [viewLoading, setViewLoading] = useState<boolean>(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await checkIsUserHavePlan();
  };

  const checkIsUserHavePlan = async () => {
    try {
      await getAPI(
        `/${userId}/checkIsUserHavePlan`,
        (response: boolean) => {
          setIsUserHavePlan(response);
        },
        undefined,
        false
      );
    } catch (error) {
      console.error("Error checking if user has a plan:", error);
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

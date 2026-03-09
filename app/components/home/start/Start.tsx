import { View } from "react-native";
import UsersRanking from "./UsersRanking";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import LastTrainingStartInfo from "./LastTrainingStartInfo";
import ProgressInfo from "./ProgressInfo";
import { useHomeContext } from "../HomeContext";
import ViewLoading from "../../elements/ViewLoading";
import React from "react";
import { useEffect } from "react";
import { useOnboarding } from "../../../onboarding/OnboardingContext";

const Start: React.FC = () => {
  const {userId} = useHomeContext()
  const { registerScreen } = useOnboarding();

  useEffect(() => {
    registerScreen("START");
  }, [registerScreen]);

  if(!userId){
    return <BackgroundMainSection><ViewLoading/></BackgroundMainSection>
  }
  return (
    <BackgroundMainSection>
      <View style={{ gap: 8 }} className="flex h-full w-full flex-col">
        <LastTrainingStartInfo />
        <ProgressInfo />
        <UsersRanking />
      </View>
    </BackgroundMainSection>
  );
};
export default Start;

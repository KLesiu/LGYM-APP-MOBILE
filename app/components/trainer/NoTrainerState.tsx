import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import BackgroundMainSection from "../elements/BackgroundMainSection";
import { useOnboarding } from "../../onboarding/OnboardingContext";
import PendingTrainerInvitationCard from "./PendingTrainerInvitationCard";

const NoTrainerState: React.FC = () => {
  const { t } = useTranslation();
  const { registerScreen } = useOnboarding();

  useEffect(() => {
    registerScreen("TRAINER");
  }, [registerScreen]);

  return (
    <BackgroundMainSection>
      <View className="flex flex-col h-full w-full p-4" style={{ gap: 12 }}>
        <Text
          className="text-primaryColor text-xl"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          {t("trainer.title", "Trainer")}
        </Text>
        <PendingTrainerInvitationCard />
        <Text
          className="text-textColor text-sm"
          style={{ fontFamily: "OpenSans_400Regular" }}
        >
          {t("trainer.noTrainer", "You don't have a trainer yet.")}
        </Text>
        <Text
          className="text-textColor text-xs"
          style={{ fontFamily: "OpenSans_400Regular" }}
        >
          {t("trainer.inviteDescription")}
        </Text>
      </View>
    </BackgroundMainSection>
  );
};

export default NoTrainerState;

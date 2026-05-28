import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import BackgroundMainSection from "../elements/BackgroundMainSection";
import { useOnboarding } from "../../onboarding/OnboardingContext";
import InviteTrainerByEmail from "./InviteTrainerByEmail";

interface NoTrainerStateProps {
  onInviteSent?: () => void;
}

const NoTrainerState: React.FC<NoTrainerStateProps> = ({ onInviteSent }) => {
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
          {t(
            "trainer.inviteDescription",
            "Invite a trainer by email to get started with personalized training plans."
          )}
        </Text>
        <View style={{ marginTop: 12 }}>
          <InviteTrainerByEmail onInviteSent={onInviteSent} />
        </View>
      </View>
    </BackgroundMainSection>
  );
};

export default NoTrainerState;

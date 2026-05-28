import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import BackgroundMainSection from "../elements/BackgroundMainSection";
import { useHomeContext } from "../home/HomeContext";
import { useOnboarding } from "../../onboarding/OnboardingContext";

const Trainer: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useHomeContext();
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
          {t("trainer.placeholder", "Trainer screen coming soon.")}
        </Text>
        {userId ? null : (
          <Text
            className="text-textColor text-xs"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {t("common.loading")}
          </Text>
        )}
      </View>
    </BackgroundMainSection>
  );
};

export default Trainer;

import React from "react";
import { View, Text, Linking, useWindowDimensions } from "react-native";
import { AppConfigInfoDto } from "../../../api/generated/model";
import CustomButton, { ButtonSize, ButtonStyle } from "./CustomButton";
import { useTranslation } from "react-i18next";
import BrandMark from "../branding/BrandMark";

interface UpdateDialogProps {
  config: AppConfigInfoDto;
}

const UpdateDialog: React.FC<UpdateDialogProps> = ({ config }) => {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const logoSize = Math.max(82, Math.min(width * 0.26, height * 0.15, 128));

  const handleUpdatePress = () => {
    if (!config.updateUrl) {
      alert(t("updateDialog.openLinkError"));
      return;
    }
    Linking.openURL(config.updateUrl).catch(() =>
      alert(t("updateDialog.openLinkError"))
    );
  };

  return (
    <View className="flex-1 items-center justify-center bg-black/70 px-5 py-8">
      <View
        className="w-full max-w-md items-center rounded-2xl border border-secondaryColor bg-cardColor px-5 py-7 shadow-lg"
        style={{ gap: 24 }}
      >
        <BrandMark size={logoSize} layout="vertical" />

        <View className="items-center" style={{ gap: 8 }}>
          <Text
            className="text-center text-xl text-textColor"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {t("updateDialog.title")}
          </Text>

          <Text
            className="text-center text-base leading-6 text-fifthColor"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {t("updateDialog.description", {
              version: config.latestVersion || config.minRequiredVersion || "-",
            })}
          </Text>
        </View>

        {config.releaseNotes && (
          <View className="w-full rounded-xl border border-secondaryColor bg-fourthColor p-4">
            <Text
              className="text-center text-base text-textColor"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              {t("updateDialog.whatsNew")}
            </Text>
            <Text
              className="mt-2 text-center text-sm leading-5 text-fifthColor"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {config.releaseNotes}
            </Text>
          </View>
        )}

        <CustomButton
          onPress={handleUpdatePress}
          buttonStyleSize={ButtonSize.long}
          buttonStyleType={ButtonStyle.success}
          text={t("updateDialog.updateNow")}
        />
      </View>
    </View>
  );
};

export default UpdateDialog;

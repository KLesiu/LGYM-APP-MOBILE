import { Modal, Text, View } from "react-native";
import { useRouter } from "expo-router";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "./components/elements/CustomButton";
import Loading from "./components/elements/Loading";
import UpdateDialog from "./components/elements/UpdateDialog";
import React from "react";
import { useAppInitialization } from "../hooks/useAppInitialization";
import { useTranslation } from "react-i18next";
import BrandMark from "./components/branding/BrandMark";

const Preload: React.FC = () => {
  const router = useRouter();
  const { appConfig } = useAppInitialization();
  const { t } = useTranslation();

  const handleLoginPress: VoidFunction = (): void => {
    router.push("/Login");
  };

  const handleRegisterPress: VoidFunction = (): void => {
    router.push("/Register");
  };

  return (
    <View className="h-full bg-bgColor overflow-hidden">
      <View className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primaryColor opacity-10" />
      <View className="absolute bottom-16 -left-24 h-72 w-72 rounded-full bg-blue-500 opacity-10" />

      <View className="flex-1 justify-between px-6 pb-8 pt-16">
        <View className="self-start rounded-full border border-primaryColor bg-fourthColor px-4 py-2">
          <Text
            className="text-xs text-primaryColor"
            style={{ fontFamily: "OpenSans_700Bold", letterSpacing: 0.8 }}
          >
            WARIANT DEMONSTRACYJNY
          </Text>
        </View>

        <View className="items-center" style={{ gap: 20 }}>
          <BrandMark
            size={112}
            layout="vertical"
            subtitle="System ewidencji treningowej"
          />
          <Text
            className="max-w-[320px] text-center text-base leading-6 text-fifthColor"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            Trening, historia wyników i współpraca z trenerem w jednym,
            uporządkowanym środowisku.
          </Text>
        </View>

        <View className="w-full" style={{ gap: 12 }}>
          <CustomButton
            text={t("auth.login")}
            onPress={handleLoginPress}
            buttonStyleSize={ButtonSize.xl}
            buttonStyleType={ButtonStyle.success}
            width="w-full"
          />
          <CustomButton
            text={t("auth.register")}
            onPress={handleRegisterPress}
            buttonStyleType={ButtonStyle.outline}
            customClasses="bg-secondaryColor90"
            width="w-full"
            buttonStyleSize={ButtonSize.xl}
          />
        </View>
      </View>

      <Loading />
      <Modal visible={!!appConfig} transparent animationType="fade">
        {appConfig && <UpdateDialog config={appConfig} />}
      </Modal>
    </View>
  );
};

export default Preload;

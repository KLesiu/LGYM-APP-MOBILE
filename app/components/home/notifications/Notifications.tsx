import { View, Text } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";

const Notifications: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-bgColor">
      <Text className="text-textColor text-lg">
        {t("notifications.title", "Notifications")}
      </Text>
    </View>
  );
};

export default Notifications;

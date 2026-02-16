import React from "react";
import { View,Text } from "react-native";
import { useTranslation } from "react-i18next";


const NonTrainingView: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View className="w-full h-full flex flex-row justify-center text-center text-2xl items-center p-4">
      <Text
        className="text-textColor text-xl text-center"
        style={{
          fontFamily: "OpenSans_400Regular",
        }}
      >
        {t('training.noTraining')}
      </Text>
    </View>
  );
};


export default NonTrainingView;

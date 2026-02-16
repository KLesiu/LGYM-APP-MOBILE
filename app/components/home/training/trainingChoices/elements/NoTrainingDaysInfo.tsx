import { View, Text } from "react-native";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../../../elements/CustomButton";
import ValidationView from "../../../../elements/ValidationView";
import React from "react";
import { useTranslation } from "react-i18next";

interface NoTrainingDaysInfoProps {
    goBack: () => void;
}

const NoTrainingDaysInfo: React.FC<NoTrainingDaysInfoProps> = (props) => {
  const { t } = useTranslation();
  return (
    <View className="w-full flex flex-col" style={{gap: 16}}>
      <Text
        className="text-textColor text-base text-center"
        style={{ fontFamily: "OpenSans_400Regular" }}
      >
        {t('training.noDays')}
      </Text>
      <CustomButton
        text={t('training.back')}
        buttonStyleSize={ButtonSize.regular}
        buttonStyleType={ButtonStyle.cancel}
        onPress={props.goBack}
      />
      <ValidationView />
    </View>
  );
};

export default NoTrainingDaysInfo;

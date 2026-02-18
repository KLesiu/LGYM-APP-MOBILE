import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../../../elements/CustomButton";

interface TrainingPlanDayErrorProps {
    goBack: () => void;
}

const TrainingPlanDayError: React.FC<TrainingPlanDayErrorProps> = (props) => {
    const { t } = useTranslation();
    return (
        <View className="flex flex-col items-center justify-center w-full h-full bg-bgColor p-4" style={{ gap: 16 }}>
             <Text
                className="text-textColor text-lg text-center"
                style={{ fontFamily: "OpenSans_700Bold" }}
            >
                {t('training.planLoadErrorTitle')}
            </Text>
            <Text
                className="text-textColor text-base text-center"
                style={{ fontFamily: "OpenSans_400Regular" }}
            >
                {t('training.planLoadErrorMessage')}
            </Text>
            <CustomButton
                text={t('training.back')}
                buttonStyleSize={ButtonSize.regular}
                buttonStyleType={ButtonStyle.cancel}
                onPress={props.goBack}
            />
        </View>
    );
};

export default TrainingPlanDayError;

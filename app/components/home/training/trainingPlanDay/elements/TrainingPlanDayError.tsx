import React from "react";
import { View, Text } from "react-native";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../../../elements/CustomButton";

interface TrainingPlanDayErrorProps {
    goBack: () => void;
}

const TrainingPlanDayError: React.FC<TrainingPlanDayErrorProps> = (props) => {
    return (
        <View className="flex flex-col items-center justify-center w-full h-full bg-bgColor p-4" style={{ gap: 16 }}>
             <Text
                className="text-textColor text-lg text-center"
                style={{ fontFamily: "OpenSans_700Bold" }}
            >
                Something went wrong!
            </Text>
            <Text
                className="text-textColor text-base text-center"
                style={{ fontFamily: "OpenSans_400Regular" }}
            >
                We couldn't load your training plan. Please try again later.
            </Text>
            <CustomButton
                text="Go Back"
                buttonStyleSize={ButtonSize.regular}
                buttonStyleType={ButtonStyle.cancel}
                onPress={props.goBack}
            />
        </View>
    );
};

export default TrainingPlanDayError;

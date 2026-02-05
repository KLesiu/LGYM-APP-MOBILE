import { View, Text } from "react-native";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../../../elements/CustomButton";
import ValidationView from "../../../../elements/ValidationView";
import React from "react";

interface NoTrainingDaysInfoProps {
    goBack: () => void;
}

const NoTrainingDaysInfo: React.FC<NoTrainingDaysInfoProps> = (props) => {
  return (
    <View className="w-full flex flex-col" style={{gap: 16}}>
      <Text
        className="text-textColor text-base text-center"
        style={{ fontFamily: "OpenSans_400Regular" }}
      >
        There is no training days available!
      </Text>
      <CustomButton
        text="Back"
        buttonStyleSize={ButtonSize.regular}
        buttonStyleType={ButtonStyle.cancel}
        onPress={props.goBack}
      />
      <ValidationView />
    </View>
  );
};

export default NoTrainingDaysInfo;

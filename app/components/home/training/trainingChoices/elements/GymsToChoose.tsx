import { ScrollView, View } from "react-native";
import CustomButton, { ButtonSize } from "../../../../elements/CustomButton";
import GymPlace from "../../../gym/GymPlace";
import React from "react";
import { GymChoiceInfoDto } from "../../../../../../api/generated/model";

interface GymsToChooseProps {
  gyms: GymChoiceInfoDto[];
  setGym: (gym: GymChoiceInfoDto) => void;
}

const GymsToChoose: React.FC<GymsToChooseProps> = ({ gyms, setGym }) => {
  return (
    <ScrollView className="w-full">
      <View className="flex flex-col pb-12">
        {gyms.map((gym, index) => (
          <CustomButton
            key={index}
            buttonStyleSize={ButtonSize.none}
            onPress={() => setGym(gym)}
          >
            <GymPlace gym={gym} isEditable={false} />
          </CustomButton>
        ))}
      </View>
    </ScrollView>
  );
};

export default GymsToChoose;

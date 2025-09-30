import { ScrollView, View } from "react-native";
import CustomButton, { ButtonSize } from "../../../../elements/CustomButton";
import GymPlace from "../../../gym/GymPlace";
import { GymChoiceInfo } from "../../../../../../interfaces/Gym";
import React from "react";

interface GymsToChooseProps {
  gyms: GymChoiceInfo[];
  setGym: (gym: GymChoiceInfo) => void;
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

import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { GymChoiceInfo, GymForm } from "./../../../../interfaces/Gym";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import GymPlace from "../gym/GymPlace";
import Dialog from "../../elements/Dialog";
import CustomButton, { ButtonSize, ButtonStyle } from "../../elements/CustomButton";
import ValidationView from "../../elements/ValidationView";
import { useHomeContext } from "../HomeContext";

interface TrainingGymChooseProps {
  setGym: (gym: GymForm) => void;
  goBack: () => void;
}

const TrainingGymChoose: React.FC<TrainingGymChooseProps> = (props) => {
  const {apiURL} = useHomeContext();
  const [gyms, setGyms] = useState<GymChoiceInfo[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await getGyms();
  };

  const getGyms = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${apiURL}/api/gym/${id}/getGyms`);
    const result = await response.json();
    if (!result || !result.length)
      return setErrors(["You don't have any gyms"]);
    setGyms(result);
  };

  return (
    <Dialog>
      <Text
        className="text-3xl text-white"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        Choose your gym!
      </Text>
      {errors.length ? (
        (
          <View>
             <CustomButton text="Back" buttonStyleSize={ButtonSize.regular} buttonStyleType={ButtonStyle.cancel} onPress={props.goBack}
  />
            <ValidationView errors={errors} />
          </View>
        )
      ) : (
        <ScrollView className="w-full">
          <View className="flex flex-col pb-12">
            {gyms.map((gym, index) => (
              <CustomButton
                key={index}
                buttonStyleSize={ButtonSize.none}
                onPress={() => props.setGym(gym)}
              >
                <GymPlace gym={gym} isEditable={false} />
              </CustomButton>
            ))}
          </View>
        </ScrollView>
      )}
    </Dialog>
  );
};

export default TrainingGymChoose;

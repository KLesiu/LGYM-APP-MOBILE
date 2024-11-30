import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { GymForm } from "../../../interfaces/Gym";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import GymPlace from "../gym/GymPlace";

interface TrainingGymChooseProps {
    setGym: (gym:GymForm) => void;
}

const TrainingGymChoose: React.FC<TrainingGymChooseProps> = (props) => {
  const API_URL = process.env.REACT_APP_BACKEND;
  const [gyms, setGyms] = useState<GymForm[]>([]);
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await getGyms();
  };

  const getGyms = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${API_URL}/api/gym/${id}/getGyms`);
    const result = await response.json();
    setGyms(result);
  };

  return (
    <View className="items-center bg-[#131313] flex flex-col justify-start gap-y-5  h-full absolute m-0 w-full top-0">
      <Text
        className="text-3xl text-white"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        Choose your gym!
      </Text>
      <ScrollView className="w-full">
        <View style={{ gap: 8 }} className="flex flex-col pb-12">
          {gyms.map((gym, index) => (
            <Pressable onPress={()=>props.setGym(gym)}>
              <GymPlace key={index} gym={gym} isEditable={false} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TrainingGymChoose

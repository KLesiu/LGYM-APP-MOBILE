import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { GymChoiceInfo, GymForm } from "../../../../../interfaces/Gym";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dialog from "../../../elements/Dialog";
import { useHomeContext } from "../../HomeContext";
import NoGymsInfo from "./elements/NoGymsInfo";
import GymsToChoose from "./elements/GymsToChoose";

interface TrainingGymChooseProps {
  setGym: (gym: GymForm) => void;
  goBack: () => void;
}

const TrainingGymChoose: React.FC<TrainingGymChooseProps> = ({
  setGym,
  goBack,
}) => {
  const { apiURL } = useHomeContext();
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
      <View
        className="flex flex-col items-start w-full h-full p-4"
        style={{ gap: 16 }}
      >
        <Text
          className="text-[28px] text-white"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Choose your gym!
        </Text>
        {errors.length ? (
          <NoGymsInfo errors={errors} goBack={goBack} />
        ) : (
          <GymsToChoose gyms={gyms} setGym={setGym} />
        )}
      </View>
    </Dialog>
  );
};

export default TrainingGymChoose;

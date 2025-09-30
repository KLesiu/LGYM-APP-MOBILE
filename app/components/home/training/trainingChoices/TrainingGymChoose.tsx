import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { GymChoiceInfo, GymForm } from "../../../../../interfaces/Gym";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dialog from "../../../elements/Dialog";
import { useHomeContext } from "../../HomeContext";
import NoGymsInfo from "./elements/NoGymsInfo";
import GymsToChoose from "./elements/GymsToChoose";
import { useAppContext } from "../../../../AppContext";
import ViewLoading from "../../../elements/ViewLoading";
import React from "react";

interface TrainingGymChooseProps {
  setGym: (gym: GymForm) => void;
  goBack: () => void;
}

const TrainingGymChoose: React.FC<TrainingGymChooseProps> = ({
  setGym,
  goBack,
}) => {
  const { userId } = useHomeContext();
  const {getAPI,errors} = useAppContext()
  const [gyms, setGyms] = useState<GymChoiceInfo[]>([]);
  const [viewLoading, setViewLoading] = useState<boolean>(true);
  useEffect(() => {
    getGyms();
  }, []);


  const getGyms = async () => {
    await getAPI(`/gym/${userId}/getGyms`, (response: GymChoiceInfo[]) =>setGyms(response))
    setViewLoading(false);
  };
  
  if(viewLoading){
    return <Dialog><ViewLoading/></Dialog>
  }

  return (
    <Dialog>
      <View
        className="flex flex-col items-start w-full h-full p-4"
        style={{ gap: 16 }}
      >
        <Text
          className="text-[28px] smallPhone:text-2xl text-white"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Choose your gym!
        </Text>
        {errors.length ? (
          <NoGymsInfo  goBack={goBack} />
        ) : (
          <GymsToChoose gyms={gyms} setGym={setGym} />
        )}
      </View>
    </Dialog>
  );
};

export default TrainingGymChoose;

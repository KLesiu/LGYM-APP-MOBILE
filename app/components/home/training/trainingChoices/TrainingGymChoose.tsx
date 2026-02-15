import { useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { GymForm } from "../../../../../interfaces/Gym";
import Dialog from "../../../elements/Dialog";
import { useHomeContext } from "../../HomeContext";
import NoGymsInfo from "./elements/NoGymsInfo";
import GymsToChoose from "./elements/GymsToChoose";
import { useAppContext } from "../../../../AppContext";
import ViewLoading from "../../../elements/ViewLoading";
import React from "react";
import { useGetApiGymIdGetGyms } from "../../../../../api/generated/gym/gym";
import { GymChoiceInfoDto } from "../../../../../api/generated/model";

interface TrainingGymChooseProps {
  setGym: (gym: GymChoiceInfoDto) => void;
  goBack: () => void;
}

const TrainingGymChoose: React.FC<TrainingGymChooseProps> = ({
  setGym,
  goBack,
}) => {
  const { userId } = useHomeContext();
  const { errors } = useAppContext();
  
  const { data, isLoading } = useGetApiGymIdGetGyms(userId, { query: { enabled: !!userId } });

  const gyms = useMemo(() => {
    if (data?.data) {
        return data.data as GymChoiceInfoDto[];
    }
    return [];
  }, [data]);
  
  if(isLoading){
    return <Dialog><ViewLoading/></Dialog>
  }

  return (
    <Dialog>
      <View
        className="flex flex-col items-start w-full h-full p-4"
        style={{ gap: 8 }}
      >
        <Text
          className="text-lg text-textColor"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Choose your gym!
        </Text>
        {errors.length || !gyms.length ? (
          <NoGymsInfo  goBack={goBack} />
        ) : (
          <GymsToChoose gyms={gyms} setGym={setGym} />
        )}
      </View>
    </Dialog>
  );
};

export default TrainingGymChoose;

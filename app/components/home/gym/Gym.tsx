import { View, Text, ScrollView } from "react-native";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import { FontWeights } from "./../../../../enums/FontsProperties";
import GymPlace from "./GymPlace";
import { GymChoiceInfo } from "./../../../../interfaces/Gym";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GymFormComponent from "./GymForm";
import { Message } from "./../../../../enums/Message";
import React from "react";
import ConfirmDialog from "../../elements/ConfirmDialog";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import { useHomeContext } from "../HomeContext";
import { useAppContext } from "../../../AppContext";
import MiniLoading from "../../elements/MiniLoading";
import ViewLoading from "../../elements/ViewLoading";

const Gym: React.FC = () => {
  const { toggleMenuButton, apiURL, hideMenu } = useHomeContext();

  const [gyms, setGyms] = useState<GymChoiceInfo[]>([]);
  const [currentChosenGym, setCurrentChosenGym] = useState<GymChoiceInfo>();
  const [isGymFormVisible, setIsGymFormVisible] = useState<boolean>(false);
  const [
    isDeleteGymConfirmationDialogVisible,
    setIsDeleteConfirmationDialogVisible,
  ] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userId } = useHomeContext();
  const { getAPI ,postAPI} = useAppContext();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await getGyms();
  };

  const getGyms = async () => {
    try {
      await getAPI(`/gym/${userId}/getGyms`, (response: GymChoiceInfo[]) =>
        setGyms(response)
      );
    } finally {
      setIsLoading(false)
    }
  };

  const addNewGym = useCallback(() => {
    setCurrentChosenGym(undefined);
    openForm();
  }, []);

  const openForm = useCallback(() => {
    toggleMenuButton(true);
    setIsGymFormVisible(true);
  }, []);

  const closeForm = useCallback(async () => {
    await getGyms();
    setIsGymFormVisible(false);
    toggleMenuButton(false);
    hideMenu();
  }, []);

  const deleteDialogVisible = useCallback(
    (visible: boolean, gym?: GymChoiceInfo) => {
      if (visible) setCurrentChosenGym(gym);
      else setCurrentChosenGym(undefined);
      setIsDeleteConfirmationDialogVisible(visible);
    },
    []
  );

  const editGym = useCallback(
    async (id: string) => {
      const currentGym = gyms.find((gym) => gym._id === id);
      setCurrentChosenGym(currentGym);
      openForm();
    },
    [gyms]
  );

  const deleteGym = async () => {
    if (!currentChosenGym) return;
    try{
      await postAPI(`/gym/${currentChosenGym._id}/deleteGym`, async()=>{
        await getGyms();
      })
    }finally{
      setIsDeleteConfirmationDialogVisible(false);
    }
  };

  return (
    <BackgroundMainSection>
      <View className="flex flex-col p-4" style={{ gap: 16 }}>
        <View className="flex flex-col ">
          <View className="flex w-full  justify-between flex-row  items-center">
            <Text
              className="smallPhone:text-base text-lg text-white  font-bold "
              style={{
                fontFamily: "OpenSans_700Bold",
              }}
            >
              Your gyms:
            </Text>

            <CustomButton
              textSize="smallPhone:text-sm text-base"
              onPress={addNewGym}
              textWeight={FontWeights.bold}
              buttonStyleType={ButtonStyle.success}
              text="Add gym"
            />
          </View>
        </View>
        {isLoading ? (
          <ViewLoading />
        ) : (
          <ScrollView className="w-full">
            <View style={{ gap: 8 }} className="flex flex-col pb-12">
              {gyms.map((gym, index) => (
                <GymPlace
                  key={index}
                  gym={gym}
                  editGym={editGym}
                  deleteGym={() => deleteDialogVisible(true, gym)}
                  isEditable={true}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
      {isGymFormVisible ? (
        <GymFormComponent closeForm={closeForm} gym={currentChosenGym} />
      ) : (
        <></>
      )}
      <ConfirmDialog
        visible={isDeleteGymConfirmationDialogVisible}
        title={`Delete: ${currentChosenGym ? currentChosenGym.name : ""}`}
        message={`Are you sure you want to delete?`}
        onConfirm={deleteGym}
        onCancel={() => deleteDialogVisible(false)}
      />
    </BackgroundMainSection>
  );
};

export default Gym;

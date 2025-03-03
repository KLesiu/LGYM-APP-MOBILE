import { View, Text, ScrollView } from "react-native";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import { FontWeights } from "./../../../../enums/FontsProperties";
import GymPlace from "./GymPlace";
import { GymChoiceInfo } from "./../../../../interfaces/Gym";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GymFormComponent from "./GymForm";
import { Message } from "./../../../../enums/Message";
import React from "react";
import ConfirmDialog from "../../elements/ConfirmDialog";
import Background from "../../elements/BackgroundMainSection";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import { useHomeContext } from "../HomeContext";

const Gym: React.FC= () => {
  const API_URL = process.env.REACT_APP_BACKEND;

  const { toggleMenuButton } = useHomeContext();

  const [gyms, setGyms] = useState<GymChoiceInfo[]>([]);
  const [currentChosenGym, setCurrentChosenGym] = useState<GymChoiceInfo>();
  const [isGymFormVisible, setIsGymFormVisible] = useState<boolean>(false);
  const [
    isDeleteGymConfirmationDialogVisible,
    setIsDeleteConfirmationDialogVisible,
  ] = useState<boolean>(false);

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

  const addNewGym = () => {
    setCurrentChosenGym(undefined);
    openForm();
    ``;
  };
  const openForm = () => {
    toggleMenuButton(true);
    setIsGymFormVisible(true);
  };

  const closeForm = async () => {
    await getGyms();
    setIsGymFormVisible(false);
    toggleMenuButton(false);
  };

  const deleteDialogVisible = (visible: boolean, gym?: GymChoiceInfo) => {
    if (visible) setCurrentChosenGym(gym);
    else setCurrentChosenGym(undefined);
    setIsDeleteConfirmationDialogVisible(visible);
  };

  const editGym = async (id: string) => {
    const currentGym = gyms.find((gym) => gym._id === id);
    setCurrentChosenGym(currentGym);
    openForm();
  };

  const deleteGym = async () => {
    if (!currentChosenGym) return;
    const response = await fetch(
      `${API_URL}/api/gym/${currentChosenGym._id}/deleteGym`,
      {
        method: "DELETE",
      }
    );
    const result = await response.json();
    if (result.msg === Message.Deleted) await getGyms();
    setIsDeleteConfirmationDialogVisible(false);
  };

  return (
    <BackgroundMainSection>
      <View className="flex flex-col p-4" style={{ gap: 16 }}>
        <View className="flex flex-col ">
          <View className="flex w-full  justify-between flex-row  items-center">
            <Text
              className="text-lg text-white  font-bold "
              style={{
                fontFamily: "OpenSans_700Bold",
              }}
            >
              Your gyms:
            </Text>

            <CustomButton
              onPress={addNewGym}
              textWeight={FontWeights.bold}
              buttonStyleType={ButtonStyle.success}
              text="Add gym"
            />
          </View>
        </View>
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

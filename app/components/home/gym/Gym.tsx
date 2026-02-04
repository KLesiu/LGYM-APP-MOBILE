import { View, Text, ScrollView } from "react-native";
import CustomButton, { ButtonSize, ButtonStyle } from "../../elements/CustomButton";
import { FontWeights } from "./../../../../enums/FontsProperties";
import GymPlace from "./GymPlace";
import { GymChoiceInfo } from "./../../../../interfaces/Gym";
import { useCallback, useEffect, useState } from "react";
import GymFormComponent from "./GymForm";
import React from "react";
import ConfirmDialog from "../../elements/ConfirmDialog";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import { useHomeContext } from "../HomeContext";
import ViewLoading from "../../elements/ViewLoading";
import { useGetApiGymIdGetGyms, usePostApiGymIdDeleteGym } from "../../../../api/generated/gym/gym";
import type { GymChoiceInfoDto } from "../../../../api/generated/model";

const Gym: React.FC = () => {
  const { toggleMenuButton, hideMenu, userId } = useHomeContext();

  const [gyms, setGyms] = useState<GymChoiceInfoDto[]>([]);
  const [currentChosenGym, setCurrentChosenGym] = useState<GymChoiceInfoDto>();
  const [isGymFormVisible, setIsGymFormVisible] = useState<boolean>(false);
  const [
    isDeleteGymConfirmationDialogVisible,
    setIsDeleteConfirmationDialogVisible,
  ] = useState<boolean>(false);

  const { data: gymsResponse, isLoading, refetch } = useGetApiGymIdGetGyms(
    userId,
    { query: { enabled: false } }
  );
  const deleteGymMutation = usePostApiGymIdDeleteGym();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await fetchGyms();
  };

  const fetchGyms = async () => {
    try {
      const result = await refetch();
      if (result.data?.data && Array.isArray(result.data.data)) {
        setGyms(result.data.data);
      }
    } catch (error) {
      console.error("Error fetching gyms:", error);
      setGyms([]);
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
    await fetchGyms();
    setIsGymFormVisible(false);
    toggleMenuButton(false);
    hideMenu();
  }, []);

  const deleteDialogVisible = useCallback(
    (visible: boolean, gym?: GymChoiceInfoDto) => {
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
    if (!currentChosenGym?._id) return;
    try {
      await deleteGymMutation.mutateAsync({
        id: currentChosenGym._id,
      });
      await fetchGyms();
    } finally {
      setIsDeleteConfirmationDialogVisible(false);
    }
  };

  return (
    <BackgroundMainSection>
      <View className="flex flex-col p-4" style={{ gap: 16 }}>
        <View className="flex flex-col ">
          <View className="flex w-full  justify-between flex-row  items-center">
            <Text
              className="text-base  text-textColor  font-bold "
              style={{
                fontFamily: "OpenSans_700Bold",
              }}
            >
              Your gyms:
            </Text>

            <CustomButton
              onPress={addNewGym}
              buttonStyleType={ButtonStyle.success}
              buttonStyleSize={ButtonSize.long}
              textWeight={FontWeights.bold}
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

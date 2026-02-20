import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import CustomButton, { ButtonSize, ButtonStyle } from "../../elements/CustomButton";
import { FontWeights } from "./../../../../enums/FontsProperties";
import GymPlace from "./GymPlace";
import { useCallback, useMemo, useState } from "react";
import GymFormComponent from "./GymForm";
import React from "react";
import ConfirmDialog from "../../elements/ConfirmDialog";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import { useHomeContext } from "../HomeContext";
import ViewLoading from "../../elements/ViewLoading";
import { useGetApiGymIdGetGyms, usePostApiGymIdDeleteGym } from "../../../../api/generated/gym/gym";
import type { GymChoiceInfoDto } from "../../../../api/generated/model";

const Gym: React.FC = () => {
  const { t } = useTranslation();
  const { toggleMenuButton, hideMenu, userId } = useHomeContext();

  const [currentChosenGym, setCurrentChosenGym] = useState<GymChoiceInfoDto>();
  const [isGymFormVisible, setIsGymFormVisible] = useState<boolean>(false);
  const [
    isDeleteGymConfirmationDialogVisible,
    setIsDeleteConfirmationDialogVisible,
  ] = useState<boolean>(false);

  const { data: gymsResponse, isLoading, refetch } = useGetApiGymIdGetGyms(
    userId,
    { query: { enabled: !!userId } }
  );
  
  const gyms = useMemo(() => {
    return (gymsResponse?.data as GymChoiceInfoDto[]) || [];
  }, [gymsResponse]);

  const deleteGymMutation = usePostApiGymIdDeleteGym();

  const addNewGym = useCallback(() => {
    setCurrentChosenGym(undefined);
    openForm();
  }, []);

  const openForm = useCallback(() => {
    toggleMenuButton(true);
    setIsGymFormVisible(true);
  }, [toggleMenuButton]);

  const closeForm = useCallback(async () => {
    await refetch();
    setIsGymFormVisible(false);
    toggleMenuButton(false);
    hideMenu();
  }, [refetch, toggleMenuButton, hideMenu]);

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
    [gyms, openForm]
  );

  const deleteGym = async () => {
    if (!currentChosenGym?._id) return;
    try {
      await deleteGymMutation.mutateAsync({
        id: currentChosenGym._id,
      });
      await refetch();
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
              {t("gym.yourGyms")}
            </Text>

            <CustomButton
              onPress={addNewGym}
              buttonStyleType={ButtonStyle.success}
              buttonStyleSize={ButtonSize.long}
              textWeight={FontWeights.bold}
              text={t("gym.addGym")}
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
        title={t("gym.deleteConfirmTitle", { gymName: currentChosenGym?.name || "" })}
        message={t("gym.deleteConfirmMessage")}
        onConfirm={deleteGym}
        onCancel={() => deleteDialogVisible(false)}
      />
    </BackgroundMainSection>
  );
};

export default Gym;

import { View, Text } from "react-native";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import { useState, useEffect } from "react";
import React from "react";
import { useAppContext } from "../../../AppContext";
import { useRouter } from "expo-router";
import ConfirmDialog from "../../elements/ConfirmDialog";
import { FontWeights } from "../../../../enums/FontsProperties";
import Checkbox from "../../elements/Checkbox";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../elements/LanguageSwitcher";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetApiGetUsersRankingQueryKey,
  getApiDeleteAccount,
  usePostApiChangeVisibilityInRanking,
} from "../../../../api/generated/user/user";

interface MainProfileInfoProps {
  email: string;
  isVisibleInRanking: boolean;
}

const MainProfileInfo: React.FC<MainProfileInfoProps> = ({
  email,
  isVisibleInRanking,
}) => {
  const { t } = useTranslation();
  const {
    clearBeforeLogout,
    changeIsVisibleInRanking,
  } = useAppContext();
  const [
    isDeleteConfirmationDialogVisible,
    setIsDeleteConfirmationDialogVisible,
  ] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isVisibleInRankingState, setIsVisibleInRankingState] =
    useState<boolean>(isVisibleInRanking);

  const { mutateAsync: changeVisibilityMutation, isPending: isChangingVisibility } =
    usePostApiChangeVisibilityInRanking();

  useEffect(() => {
    setIsVisibleInRankingState(isVisibleInRanking);
  }, [isVisibleInRanking]);

  const logout = async (): Promise<void> => {
    await clearBeforeLogout();
    router.push("/");
  };

  const deleteAccount = async (): Promise<void> => {
    await getApiDeleteAccount();
    setIsDeleteConfirmationDialogVisible(false);
    logout();
  };

  const changeVisibility = async (newValue: boolean): Promise<void> => {
    const previousValue = isVisibleInRankingState;
    setIsVisibleInRankingState(newValue);
    changeIsVisibleInRanking(newValue);

    try {
      await changeVisibilityMutation({
        data: { isVisibleInRanking: newValue },
      });

      await queryClient.invalidateQueries({
        queryKey: getGetApiGetUsersRankingQueryKey(),
      });
      await queryClient.refetchQueries({
        queryKey: getGetApiGetUsersRankingQueryKey(),
        type: "all",
      });
    } catch {
      setIsVisibleInRankingState(previousValue);
      changeIsVisibleInRanking(previousValue);
    }
  };

  return (
    <View className="bg-bgColor flex flex-col flex-1 justify-between items-center w-full px-4 py-2">
      <View className="flex flex-col w-full" style={{ gap: 8 }}>
        <View style={{ gap: 4 }} className="flex flex-col w-full">
          <Text
            style={{ fontFamily: "OpenSans_300Light" }}
            className="text-gray-200/80 font-light text-xs"
          >
            {t('auth.email')}
          </Text>
          <View
            style={{ borderRadius: 8 }}
            className="bg-secondaryColor flex justify-center items-center h-14 smallPhone:h-10 py-4 smallPhone:py-2 px-6"
          >
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="text-gray-200/80 font-light leading-4 text-sm smallPhone:text-xs"
            >
              {email}
            </Text>
          </View>
        </View>
        <View className="flex flex-row w-full items-center" style={{ gap: 12 }}>
          <Checkbox
            value={isVisibleInRankingState}
            setValue={(value: boolean) => {
              if (isChangingVisibility) return;
              void changeVisibility(value);
            }}
          />
          <Text
            className="text-textColor text-sm smallPhone:text-xs"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            {t('profile.visibleInRanking')}
          </Text>
        </View>
        
        <LanguageSwitcher />

      </View>

      <View className="flex flex-row  w-full" style={{gap:16}}>
        <CustomButton
          text={t('profile.logout')}
          customClasses="flex-1"
          onPress={logout}
          textWeight={FontWeights.bold}
          buttonStyleType={ButtonStyle.success}
        />
        <CustomButton
          text={t('profile.deleteAccount')}
          onPress={() => setIsDeleteConfirmationDialogVisible(true)}
          customClasses="flex-1"
          textWeight={FontWeights.bold}
          buttonStyleType={ButtonStyle.cancel}
        />
      </View>
      <ConfirmDialog
        visible={isDeleteConfirmationDialogVisible}
        title={t('profile.confirmDeleteTitle')}
        message={t('profile.confirmDeleteMessage')}
        onConfirm={deleteAccount}
        onCancel={() => setIsDeleteConfirmationDialogVisible(false)}
      />
    </View>
  );
};
export default MainProfileInfo;

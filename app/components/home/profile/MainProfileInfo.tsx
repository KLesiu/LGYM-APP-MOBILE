import { View, Text } from "react-native";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import { useState } from "react";
import React from "react";
import { useAppContext } from "../../../AppContext";
import { useRouter } from "expo-router";
import ConfirmDialog from "../../elements/ConfirmDialog";
import { FontWeights } from "../../../../enums/FontsProperties";

interface MainProfileInfoProps {
  email: string;
}

const MainProfileInfo: React.FC<MainProfileInfoProps> = ({ email }) => {
  const { clearBeforeLogout, getAPI } = useAppContext();
  const [
    isDeleteConfirmationDialogVisible,
    setIsDeleteConfirmationDialogVisible,
  ] = useState(false);
  const router = useRouter();

  const logout = async (): Promise<void> => {
    await clearBeforeLogout();
    router.push("/");
  };

  const deleteAccount = async (): Promise<void> => {
    await getAPI("/deleteAccount", () => {
      setIsDeleteConfirmationDialogVisible(false);
      logout();
    });
  };

  return (
    <View className="bg-bgColor flex flex-col flex-1 justify-between  items-center  w-full px-4 py-2">
      <View style={{ gap: 4 }} className="flex flex-col w-full">
        <Text
          style={{ fontFamily: "OpenSans_300Light" }}
          className="text-gray-200/80 font-light  text-xs"
        >
          Email
        </Text>
        <View
          style={{ borderRadius: 8 }}
          className="bg-secondaryColor flex justify-center items-center h-14 smallPhone:h-10 py-4 smallPhone:py-2 px-6 "
        >
          <Text
            style={{ fontFamily: "OpenSans_300Light" }}
            className="text-gray-200/80 font-light leading-4 text-sm smallPhone:text-xs"
          >
            {email}
          </Text>
        </View>
      </View>
      <View className="flex flex-row w-full" style={{ gap: 8 }}>
        <CustomButton
          text="Logout"
          customClasses="flex-1"
          onPress={logout}
          textWeight={FontWeights.bold}
          buttonStyleType={ButtonStyle.success}
        />
        <CustomButton
          text="Delete account"
          onPress={() => setIsDeleteConfirmationDialogVisible(true)}
          customClasses="flex-1"
          textWeight={FontWeights.bold}
          buttonStyleType={ButtonStyle.cancel}
        />
      </View>
      <ConfirmDialog
        visible={isDeleteConfirmationDialogVisible}
        title={`Delete account`}
        message={`Are you sure you want to delete your account?`}
        onConfirm={deleteAccount}
        onCancel={() => setIsDeleteConfirmationDialogVisible(false)}
      />
    </View>
  );
};
export default MainProfileInfo;

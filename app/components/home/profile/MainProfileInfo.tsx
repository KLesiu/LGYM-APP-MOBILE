import { View, Text } from "react-native";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import { useMemo } from "react";
import React from "react";

interface MainProfileInfoProps {
  logout: VoidFunction;
  email?: string | null;
}

const MainProfileInfo: React.FC<MainProfileInfoProps> = ({ email, logout }) => {
  const emailToDisplay = useMemo(()=>email || "No email provided", [email]);
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
            {emailToDisplay}
          </Text>
        </View>
      </View>
      <CustomButton
        width="w-full"
        text="Logout"
        onPress={logout}
        buttonStyleType={ButtonStyle.success}
      />
    </View>
  );
};
export default MainProfileInfo;

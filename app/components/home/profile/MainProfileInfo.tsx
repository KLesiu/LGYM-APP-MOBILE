import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { UserProfileInfo } from "./../../../../interfaces/User";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";

interface MainProfileInfoProps {
  logout: VoidFunction;
  userInfo?: UserProfileInfo;
}

const MainProfileInfo: React.FC<MainProfileInfoProps> = (props) => {
  const [email, setEmail] = useState<string>();
  useEffect(() => {
    getDataFromStorage();
  }, []);
  const getDataFromStorage = async (): Promise<void> => {
    const email = await AsyncStorage.getItem("email");
    setEmail(email as string);
  };
  return (
    <View className=" flex flex-col flex-1 justify-between  items-center  w-full px-4">
      <View style={{ gap: 8 }} className="flex flex-col w-full">
        <Text
          style={{ fontFamily: "OpenSans_300Light" }}
          className="text-[#121212] font-light leading-4 text-xs"
        >
          Email
        </Text>
        <View
          style={{ borderRadius: 8 }}
          className="bg-[#ffff] flex justify-center items-center h-14 py-4 px-6 "
        >
          <Text
            style={{ fontFamily: "OpenSans_300Light" }}
            className="text-[#121212] font-light leading-4 text-sm"
          >
            {email}
          </Text>
        </View>
      </View>
      <CustomButton
        width="w-full"
        text="Logout"
        onPress={props.logout}
        buttonStyleType={ButtonStyle.success}
      />
    </View>
  );
};
export default MainProfileInfo;

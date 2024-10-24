import { Pressable, View, Text } from "react-native";
import MainProfileInfoProps from "./props/MainProfileInfoProps.";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
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
    <View className="bg-[#131313] flex flex-col flex-1 justify-between  items-center  w-full px-4">
      <View style={{ gap: 8 }} className="flex flex-col w-full">
        <Text
          style={{ fontFamily: "OpenSans_300Light" }}
          className="text-gray-200/80 font-light leading-4 text-xs"
        >
          Email
        </Text>
        <View
          style={{ borderRadius: 8 }}
          className="bg-[#1E1E1E73] flex justify-center items-center h-14 py-4 px-6 "
        >
          <Text
            style={{ fontFamily: "OpenSans_300Light" }}
            className="text-gray-200/80 font-light leading-4 text-sm"
          >
            {email}
          </Text>
        </View>
      </View>
      <View className="flex flex-col justify-around items-center w-full">
        {/* <Pressable className="flex justify-center items-center rounded-lg h-14 w-full py-4 px-6 bg-[#94e798]">
      <Text
          className="text-black text-xl"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Change password
        </Text>
      </Pressable> */}
        <Pressable
          style={{ borderRadius: 8 }}
          className="h-20 w-80  py-4  px-2 m-0  bg-[#94e798] flex justify-center items-center mt-4"
          onPress={props.logout}
        >
          <Text
            className="text-base w-full text-center text-[#131313]"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            Logout
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
export default MainProfileInfo;

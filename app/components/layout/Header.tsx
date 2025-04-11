import { View, Image, Text } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HeaderProps {
  children?: React.ReactNode;
  customClasses?:string
}

const Header: React.FC<HeaderProps> = ({children,customClasses}) => {
  const [name, setName] = useState<string>("");
  const getName = async () => {
    setName((await AsyncStorage.getItem("username")) as string);
  };
  useEffect(() => {
    getName();
  }, []);
  return (
    <View className={`bg-bgColor h-16 py-4 px-5 flex flex-row justify-end items-center ${customClasses}`}>
      {children}
      <View
        style={{ borderRadius: 10000 }}
        className="flex items-center justify-center w-8 h-8  bg-primaryColor "
      >
        <Text
          className="text-bgColor text-xl font-bold"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          {name[0]}
        </Text>
      </View>
    </View>
  );
};
export default Header;

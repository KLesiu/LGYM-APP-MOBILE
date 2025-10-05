import { View, Image, Text, Pressable } from "react-native";
import { JSX, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LGYMLogo from "./../../../assets/logoLGYMNew.png";
import React from "react";
import { useHomeContext } from "../home/HomeContext";
import ProfileRank from "../elements/ProfileRank";

interface HeaderProps {
  children?: React.ReactNode;
  customClasses?: string;
  viewChange?: (view?: JSX.Element) => void;
}

const Header: React.FC<HeaderProps> = ({
  children,
  customClasses,
  viewChange,
}) => {
  const { userRank } = useHomeContext();
  const [name, setName] = useState<string>("");
  const getName = async () => {
    setName((await AsyncStorage.getItem("username")) as string);
  };
  useEffect(() => {
    getName();
  }, []);
  return (
    <View
      style={{ gap: 8 }}
      className={`bg-bgColor h-16 smallPhone:h-14 smallPhone:py-2 px-5 flex flex-row justify-between  items-center ${customClasses}`}
    >
      <View className="flex flex-row items-center" style={{ gap: 4 }}>
        <Image className="w-10 h-10" source={LGYMLogo} />
        <View className="flex flex-row" style={{ gap: 4 }}>
          <Text
            className="text-primaryColor font-bold  "
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            LGYM
          </Text>
          <Text
            className="text-fifthColor font-bold  "
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            APP
          </Text>
        </View>
      </View>

      {children}
      <View className="flex flex-row items-center" style={{ gap: 4 }}>
        <Text
          className="text-[#FC2C44] font-bold"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          {name}
        </Text>
        {userRank && <ProfileRank rank={userRank} customClasses="h-6 w-6" />}

      </View>
     
    </View>
  );
};
export default Header;

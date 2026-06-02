import { View, Image, Text, TouchableOpacity } from "react-native";
import { JSX, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LGYMLogo from "./../../../assets/logoLGYMNewX.png";
import React from "react";
import ProfileRank from "../elements/ProfileRank";
import { useAppContext } from "../../AppContext";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../../contexts/NotificationContext";
import { useHomeContext } from "../home/HomeContext";
import BellIcon from "./../../../img/icons/bellIcon.svg";

interface HeaderProps {
  children?: React.ReactNode;
  customClasses?: string;
  viewChange?: (view?: JSX.Element) => void;
  isHeaderShow?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  children,
  customClasses,
  isHeaderShow,
}) => {
  const { userInfo, getRankColor } = useAppContext();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { unreadCount } = useNotifications();
  const { navigateToScreen } = useHomeContext();

  const [name, setName] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const loadName = async () => {
      const storedName = await AsyncStorage.getItem("username");
      if (storedName && isMounted) {
        setName(storedName);
      }
    };

    void loadName();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayName = (typeof user?.name === 'string' ? user.name : userInfo?.name) || name;
  const userRank = useMemo(() => userInfo?.profileRank, [userInfo]);

  const handleBellPress = () => {
    navigateToScreen("NOTIFICATIONS");
  };

  return (
    <View
      style={{ gap: 8 }}
      className={`bg-bgColor h-16 smallPhone:h-14 smallPhone:py-2 px-5 ${
        isHeaderShow ? "flex" : "hidden"
      } flex-row justify-between  items-center ${customClasses}`}
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
      <View className="flex flex-row items-center" style={{ gap: 8 }}>
        <View className="relative">
          <TouchableOpacity onPress={handleBellPress}>
            <BellIcon width={24} height={24} color="#ffffff" />
          </TouchableOpacity>
          {unreadCount.count > 0 && (
            <View
              pointerEvents="none"
              className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center"
            >
              <Text className="text-white text-[10px] font-bold">
                {unreadCount.count > 99 ? "99+" : unreadCount.count}
              </Text>
            </View>
          )}
        </View>

        {userRank && <ProfileRank rank={userRank} customClasses="h-6 w-6" />}

        <View className="flex flex-row items-center gap-2">
            <View className="flex flex-col">
            <Text
                className="text-textColor text-[10px]"
                style={{ fontFamily: "OpenSans_400Regular" }}
            >
                {t('auth.welcome')},
            </Text>
            {getRankColor && (
                <Text
                className={`text-xs font-bold`}
                style={{ fontFamily: "OpenSans_700Bold", color: getRankColor }}
                >
                {displayName}
                </Text>
            )}
            </View>
        </View>
      </View>
    </View>
  );
};
export default Header;

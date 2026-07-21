import { View, Text, TouchableOpacity } from "react-native";
import { JSX, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import ProfileRank from "../elements/ProfileRank";
import { useAppContext } from "../../AppContext";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../../contexts/NotificationContext";
import { useHomeContext } from "../home/HomeContext";
import BellIcon from "./../../../img/icons/bellIcon.svg";
import UnreadNotificationWarningModal from "./UnreadNotificationWarningModal";
import BrandMark from "../branding/BrandMark";

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

  const displayName =
    (typeof user?.name === "string" ? user.name : userInfo?.name) || name;
  const userRank = useMemo(() => userInfo?.profileRank, [userInfo]);

  const handleBellPress = () => {
    navigateToScreen("NOTIFICATIONS");
  };

  return (
    <View
      style={{ gap: 8 }}
      className={`h-16 flex-row items-center justify-between border-b border-secondaryColor bg-bgColor px-5 smallPhone:h-14 smallPhone:py-2 ${
        isHeaderShow ? "flex" : "hidden"
      } ${customClasses}`}
    >
      <BrandMark size={34} />

      {children}
      <View className="flex-row items-center" style={{ gap: 10 }}>
        <View className="relative">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t("notifications.title")}
            onPress={handleBellPress}
            className="h-10 w-10 items-center justify-center rounded-full bg-secondaryColor"
          >
            <BellIcon width={22} height={22} color="#F8FAFC" />
          </TouchableOpacity>
          {unreadCount.count > 0 && (
            <View
              pointerEvents="none"
              className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-redColor"
            >
              <Text className="text-[10px] font-bold text-white">
                {unreadCount.count > 99 ? "99+" : unreadCount.count}
              </Text>
            </View>
          )}
        </View>

        {userRank && <ProfileRank rank={userRank} customClasses="h-6 w-6" />}

        <View className="flex-row items-center gap-2">
          <View className="flex-col">
            <Text
              className="text-[10px] text-fifthColor"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {t("auth.welcome")},
            </Text>
            {getRankColor && (
              <Text
                className="max-w-24 text-xs font-bold"
                numberOfLines={1}
                style={{
                  fontFamily: "OpenSans_700Bold",
                  color: getRankColor,
                }}
              >
                {displayName}
              </Text>
            )}
          </View>
        </View>
      </View>

      <UnreadNotificationWarningModal />
    </View>
  );
};

export default Header;

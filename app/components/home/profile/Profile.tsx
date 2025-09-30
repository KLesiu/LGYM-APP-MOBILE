import { Text, View } from "react-native";
import { useState, useEffect, useCallback, JSX } from "react";
import { UserInfo } from "./../../../../interfaces/User";
import ProfileRank from "../../elements/ProfileRank";
import { useRouter } from "expo-router";
import Records from "../records/Records";
import MainProfileInfo from "./MainProfileInfo";
import Start from "../start/Start";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import TabView from "../../elements/TabView";
import { useHomeContext } from "../HomeContext";
import { useAppContext } from "../../../AppContext";
import ViewLoading from "../../elements/ViewLoading";
import React from "react";

const Profile: React.FC = () => {
  const { toggleMenuButton, changeView, userId } = useHomeContext();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [rankComponent, setRankComponent] = useState<JSX.Element>();
  const [isTabLoading, setIsTabLoading] = useState<boolean>(true);

  const { clearBeforeLogout, getAPI, token } = useAppContext();

  const [currentTab, setCurrentTab] = useState<JSX.Element>();

  useEffect(() => {
    init();
    setIsTabLoading(false);
  }, []);

  const init = useCallback(async (): Promise<void> => {
    toggleMenuButton(true);
    await checkMoreUserInfo();
  }, []);

  const logout = async (): Promise<void> => {
    await clearBeforeLogout();
    router.push("/");
  };

  const checkMoreUserInfo = async (): Promise<void> => {
    try {
      await getAPI(`/${userId}/getUserInfo`, (response: UserInfo) => {
        setUserInfo(response);
        if (response.profileRank) {
          setRankComponent(<ProfileRank rank={response.profileRank} />);
        }
        setCurrentTab(
          <MainProfileInfo logout={logout} email={response.email} />
        );
      });
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const goBack = useCallback(() => {
    toggleMenuButton(false);
    changeView(<Start />);
  }, []);

  const setActiveComponent = (component: JSX.Element) => {
    setCurrentTab(component);
  };

  return (
    <BackgroundMainSection>
      {isTabLoading || !userInfo ? (
        <ViewLoading />
      ) : (
        <View className="w-full h-full p-4 relative  flex flex-col flex-1">
          <View style={{ gap: 8 }} className="flex items-center flex-col px-6">
            <View className="flex ">{rankComponent}</View>
            <View  className="flex flex-col items-center">
              <Text
                className="text-primaryColor font-bold w-full text-center text-2xl smallPhone:text-lg "
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                {userInfo.name}
              </Text>
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="text-gray-200/80 font-light text-sm smallPhone:text-xs"
              >
                {userInfo.profileRank}
              </Text>
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="text-gray-200/80 font-light text-sm smallPhone:text-xs"
              >
                {userInfo.elo} Elo
              </Text>
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="text-gray-200/80 font-light text-sm smallPhone:text-xs"
              >
                Member since: {userInfo.createdAt.toString().slice(0, 10)}
              </Text>
            </View>
          </View>
          <TabView
            tabs={[
              {
                label: "Data",
                component: (
                  <MainProfileInfo logout={logout} email={userInfo.email} />
                ),
              },
              {
                label: "Records",
                component: <Records toggleMenuButton={toggleMenuButton} />,
              },
            ]}
            onTabChange={setActiveComponent}
          />
          <View className="w-full flex-1">{currentTab}</View>
        </View>
      )}
    </BackgroundMainSection>
  );
};
export default Profile;

import { Text, View, Pressable } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { UserProfileInfo } from "../.././../../interfaces/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserInfo } from "./../../../../interfaces/User";
import ProfileRank from "../../elements/ProfileRank";
import ViewLoading from "../../elements/ViewLoading";
import { useRouter } from "expo-router";
import Records from "../records/Records";
import MainProfileInfo from "./MainProfileInfo";
import { Message } from "./../../../../enums/Message";
import Start from "../start/Start";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import TabView from "../../elements/TabView";
import { useHomeContext } from "../HomeContext";

const Profile: React.FC = () => {
  const { apiURL, toggleMenuButton, changeView } = useHomeContext();
  const router = useRouter();
  const [yourProfile, setYourProfile] = useState<UserProfileInfo>();
  const [profileRank, setProfileRank] = useState<string>("");
  const [memberSince, setMemberSince] = useState<string>("");
  const [profileElo, setProfileElo] = useState<number>();
  const [rankComponent, setRankComponent] = useState<JSX.Element>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  const logout = async (): Promise<void> => {
    const keys = await AsyncStorage.getAllKeys();
    keys.forEach((ele) => deleteFromStorage(ele));
    router.push("/");
  };

  const [currentTab, setCurrentTab] = useState<JSX.Element>(
    <MainProfileInfo logout={logout} />
  );

  const init = useCallback(async (): Promise<void> => {
    setViewLoading(true);
    toggleMenuButton(true);
    await getDataFromStorage();
    await getUserEloPoints();
    setViewLoading(false);
  }, []);

  const getDataFromStorage = async (): Promise<void> => {
    const username = await AsyncStorage.getItem("username");
    const email = await AsyncStorage.getItem("email");
    const id = await AsyncStorage.getItem("id");
    setYourProfile({ name: username!, email: email! });
    await checkMoreUserInfo(id!);
  };

  const getUserEloPoints = async (): Promise<void> => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
      `${apiURL}/api/userInfo/${id}/getUserEloPoints`
    );
    const result = await response.json();
    setProfileElo(result.elo);
  };

  const checkMoreUserInfo = async (id: string): Promise<void> => {
    const response = await fetch(`${apiURL}/api/${id}/getUserInfo`);
    const result: Message.DidntFind | UserInfo = await response.json();
    if (result !== Message.DidntFind)
      if (result.profileRank && result.createdAt) {
        setProfileRank(result.profileRank);
        setMemberSince(`${result.createdAt}`.slice(0, 10));
        setRankComponent(<ProfileRank rank={result.profileRank} />);
      }
    setViewLoading(false);
  };

  const deleteFromStorage = async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  };

  const goBack = useCallback(() => {
    toggleMenuButton(false);
    changeView(<Start />);
  }, []);

  const setActiveComponent = useCallback((component: JSX.Element) => {
    setCurrentTab(component);
  }, []);

  return (
    <BackgroundMainSection>
      <View className="w-full h-full p-4 py-8 flex flex-col flex-1">
        <View className="w-20">
          <CustomButton
            onPress={goBack}
            text="Back"
            buttonStyleType={ButtonStyle.outline}
            buttonStyleSize={ButtonSize.regular}
          />
        </View>
        <View
          style={{ gap: 8 }}
          className="flex items-center flex-col py-3 px-6"
        >
          <View className="flex ">{rankComponent}</View>
          <View style={{ gap: 4 }} className="flex flex-col items-center">
            <Text
              className="text-[#20BC2D] font-bold w-full text-center text-2xl"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              {yourProfile?.name}
            </Text>
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="text-[#121212] font-light leading-4"
            >
              {profileRank}
            </Text>
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="text-[#121212] font-light leading-4"
            >
              {profileElo} Elo
            </Text>
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="text-[#121212] font-light leading-4"
            >
              Member since: {memberSince}
            </Text>
          </View>
        </View>
        <TabView
          tabs={[
            { label: "Data", component: <MainProfileInfo logout={logout} /> },
            {
              label: "Records",
              component: <Records toggleMenuButton={toggleMenuButton} />,
            },
          ]}
          onTabChange={setActiveComponent}
        />

        <View className="w-full flex-1 mt-4">{currentTab}</View>
      </View>
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </BackgroundMainSection>
  );
};
export default Profile;

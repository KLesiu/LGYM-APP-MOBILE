import { Text, View, Pressable } from "react-native";
import { useState, useEffect } from "react";
import UserProfile from "./types/UserProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserInfo from "./types/UserInfo";
import ProfileRank from "./ProfileRank";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/RootStackParamList";
import ViewLoading from "./ViewLoading";
import Records from "./Records";
import MainProfileInfo from "./MainProfileInfo";
import { Message } from "./enums/Message";
import ProfileProps from "./props/ProfileProps";
import Start from "./Start";

const Profile: React.FC<ProfileProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [yourProfile, setYourProfile] = useState<UserProfile>();
  const [profileRank, setProfileRank] = useState<string>("");
  const [memberSince, setMemberSince] = useState<string>("");
  const [profileElo, setProfileElo] = useState<number>();
  const [rankComponent, setRankComponent] = useState<JSX.Element>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const logout = async (): Promise<void> => {
    const keys = await AsyncStorage.getAllKeys();
    keys.forEach((ele) => deleteFromStorage(ele));
    navigation.navigate("Preload");
  };
  const [currentTab, setCurrentTab] = useState<JSX.Element>(
    <MainProfileInfo logout={logout} />
  );

  useEffect(() => {
    props.toggleMenuButton(true);
    setViewLoading(true);
    getDataFromStorage();
    getUserEloPoints();
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
  const styleCurrentTab = (tab: JSX.Element, cssRule: string): string => {
    if (cssRule === "border")
      return currentTab.type.name === tab.type.name ? "#94e798" : "#131313";
    return currentTab.type.name === tab.type.name ? "#94e798" : "#E5E7EB";
  };
  const checkMoreUserInfo = async (id: string): Promise<void> => {
    const response: Message.DidntFind | UserInfo = await fetch(
      `${apiURL}/api/${id}/getUserInfo`
    )
      .then((res) => res.json())
      .then((res) => res);
    if (response !== Message.DidntFind)
      if (response.profileRank && response.createdAt) {
        setProfileRank(response.profileRank);
        setMemberSince(response.createdAt.slice(0, 10));
        setRankComponent(<ProfileRank rank={response.profileRank} />);
      }
    setViewLoading(false);
  };

  const deleteFromStorage = async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  };

  const goBack = () => {
    props.toggleMenuButton(false);
    props.viewChange(
      <Start
        viewChange={props.viewChange}
        toggleMenuButton={props.toggleMenuButton}
      />
    );
  };

  return (
    <View className="relative h-full w-full flex bg-[#131313]">
      <View className="w-full h-full p-4 flex flex-col flex-1">
        <View className="w-full flex">
          <Pressable
            style={{ borderRadius: 8 }}
            className=" flex flex-row justify-center items-center w-20 h-10 bg-[#3f3f3f]"
            onPress={goBack}
          >
            <Text
              className="text-center text-sm text-white"
              style={{
                fontFamily: "OpenSans_400Regular",
              }}
            >
              BACK
            </Text>
          </Pressable>
        </View>
        <View
          style={{ gap: 8 }}
          className="flex items-center flex-col py-3 px-6"
        >
          <View className="flex ">{rankComponent}</View>
          <View style={{ gap: 4 }} className="flex flex-col items-center">
            <Text
              className="text-[#94e798] font-bold w-full text-center text-2xl"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              {yourProfile?.name}
            </Text>
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="text-gray-200/80 font-light leading-4"
            >
              {profileRank}
            </Text>
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="text-gray-200/80 font-light leading-4"
            >
              {profileElo} Elo
            </Text>
            <Text
              style={{ fontFamily: "OpenSans_300Light" }}
              className="text-gray-200/80 font-light leading-4"
            >
              Member since: {memberSince}
            </Text>
          </View>
        </View>

        <View className="w-full h-12 flex flex-row pr-6">
          <Pressable
            className="flex flex-row justify-center items-center flex-1"
            style={{
              borderBottomColor: `${styleCurrentTab(
                <MainProfileInfo />,
                "border"
              )}`,
              borderBottomWidth: 1,
            }}
            onPress={() => setCurrentTab(<MainProfileInfo logout={logout} />)}
          >
            <Text
              className="text-gray-200/80 font-light leading-4 text-center w-20 text-sm"
              style={{
                fontFamily: "OpenSans_300Light",
                color: `${styleCurrentTab(<MainProfileInfo />, "text")}`,
              }}
            >
              Data
            </Text>
          </Pressable>
          <Pressable
            className="flex flex-row justify-center items-center flex-1"
            style={{
              borderBottomColor: `${styleCurrentTab(
                <Records toggleMenuButton={props.toggleMenuButton} />,
                "border"
              )}`,
              borderBottomWidth: 1,
            }}
            onPress={() =>
              setCurrentTab(
                <Records toggleMenuButton={props.toggleMenuButton} />
              )
            }
          >
            <Text
              className="text-gray-200/80 font-light leading-4 text-center w-20 text-sm"
              style={{
                fontFamily: "OpenSans_300Light",
                color: `${styleCurrentTab(
                  <Records toggleMenuButton={props.toggleMenuButton} />,
                  "text"
                )}`,
              }}
            >
              Records
            </Text>
          </Pressable>
          {/* <Pressable className="flex flex-row justify-center items-center" style={{borderBottomColor:`${styleCurrentTab(<Measurements/>,'border')}`,borderBottomWidth:1}}  onPress={()=>setCurrentTab(<Measurements/>)}><Text className="text-gray-200/80 font-light leading-4 text-center w-22 text-sm"  style={{fontFamily:'OpenSans_300Light',color:`${styleCurrentTab(<Measurements/>,'text')}`}}>Measurements</Text></Pressable> */}
        </View>
        <View className="w-full flex-1 mt-4">{currentTab}</View>
      </View>
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </View>
  );
};
export default Profile;

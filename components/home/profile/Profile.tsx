import { Text, View, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { UserProfileInfo } from "../../../interfaces/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserInfo } from "../../../interfaces/User";
import ProfileRank from "../../elements/ProfileRank";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ViewLoading from "../../elements/ViewLoading";
import { RootStackParamList } from "../../../interfaces/Navigation";
import Records from "../records/Records";
import MainProfileInfo from "./MainProfileInfo";
import { Message } from "../../../enums/Message";
import Start from "../start/Start";


interface ProfileProps{
  toggleMenuButton:(hide:boolean)=>void
  viewChange:(view:JSX.Element)=>void
}

const Profile: React.FC<ProfileProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [yourProfile, setYourProfile] = useState<UserProfileInfo>();
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
    init()
  }, []);

  const init = async (): Promise<void> => {
    setViewLoading(true);
    props.toggleMenuButton(true)
    await getDataFromStorage();
    await getUserEloPoints();
    setViewLoading(false);
  }

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
    const response = await fetch(
      `${apiURL}/api/${id}/getUserInfo`
    )
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
                <MainProfileInfo logout={logout} />,
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
                color: `${styleCurrentTab(<MainProfileInfo logout={logout} />, "text")}`,
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

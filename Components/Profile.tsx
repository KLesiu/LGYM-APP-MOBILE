import { Text, View, ImageBackground, TouchableOpacity } from "react-native";
import backgroundLogo from "./img/backgroundLGYMApp500.png";
import { useState, useEffect } from "react";
import UserProfile from "./types/UserProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Teko_700Bold } from "@expo-google-fonts/teko";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import * as SplashScreen from "expo-splash-screen";
import UserInfo from "./types/UserInfo";
import ProfileRank from "./ProfileRank";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/RootStackParamList";
import ViewLoading from "./ViewLoading";

const Profile: React.FC = () => {
  const [yourProfile, setYourProfile] = useState<UserProfile>();
  const [profileRank, setProfileRank] = useState<string>("");
  const [memberSince, setMemberSince] = useState<string>("");
  const [rankComponent, setRankComponent] = useState<JSX.Element>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const [fontsLoaded] = useFonts({
    Teko_700Bold,
    Caveat_400Regular,
  });
  useEffect(() => {
    const loadAsyncResources = async () => {
      try {
        SplashScreen.preventAutoHideAsync();
        await fontsLoaded;
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Błąd ładowania zasobów:", error);
      }
    };

    loadAsyncResources();
  }, [fontsLoaded]);

  useEffect(() => {
    setViewLoading(true);
    getDataFromStorage();
    setRankComponent(<ProfileRank />);
  }, []);

  const getDataFromStorage = async (): Promise<void> => {
    const username = await AsyncStorage.getItem("username");
    const email = await AsyncStorage.getItem("email");
    const id = await AsyncStorage.getItem("id");
    setYourProfile({ name: username!, email: email! });
    checkMoreUserInfo(id!);
  };
  const checkMoreUserInfo = async (id: string): Promise<void> => {
    const response: "Didnt find" | UserInfo = await fetch(
      `${process.env.REACT_APP_BACKEND}/api/userInfo/${id}`
    )
      .then((res) => res.json())
      .then((res) => res);
    if (response !== "Didnt find")
      if (response.profileRank && response.createdAt) {
        setProfileRank(response.profileRank);
        setMemberSince(response.createdAt.slice(0, 10));
      }
    setViewLoading(false);
  };
  const logout = async (): Promise<void> => {
    const keys = await AsyncStorage.getAllKeys();
    keys.forEach((ele) => deleteFromStorage(ele));
    navigation.navigate("Preload");
  };
  const deleteFromStorage = async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  };
  if (!fontsLoaded) {
    return <ViewLoading />;
  }
  return (
    <ImageBackground className="h-[79%] w-[98%] mx-[1%] flex-1 flex justify-center items-center opacity-100 " source={backgroundLogo} >
      <View className="rounded-tl-10 rounded-tr-10 bg-[#fffffff2] h-[99%] w-full flex flex-col z-[2] ">
        <Text className="rounded-3xl m-0 text-4xl w-full text-center" style={{ fontFamily: "Teko_700Bold"}}>
          Your profile
        </Text>
        <View className="items-center flex justify-center flex-row flex-wrap h-3/5 " >
          <Text className="p-1 border-gray-500 border-2 w-[70%] rounded-sm text-2xl mb-10" style={{ fontFamily: "Teko_700Bold"}}>
            Name: {yourProfile?.name}
          </Text>
          <View className="w-full flex flex-col h-full items-center">
            <View className="flex w-[70%] justify-center flex-col flex-wrap bg-[#000000c0] rounded p-4 h-2/5 " >
              <Text
                style={{
                  fontFamily: "Teko_700Bold",
                  color: "white",
                  width: "50%",
                  fontSize: 25,
                }}
              >
                Profile Rank :
              </Text>
              <Text
                style={{
                  fontFamily: "Teko_700Bold",
                  color: "white",
                  fontSize: 25,
                }}
              >
                {profileRank}
              </Text>
              {rankComponent}
            </View>
            <Text className="p-1 border-gray-500 border-2 w-[70%] rounded text-xl mt-5" style={{ fontFamily: "Teko_700Bold"}}>
              Email: {yourProfile?.email}
            </Text>
            <Text className="p-1 border-gray-500 border-2 w-[70%] rounded text-xl mt-5" style={{ fontFamily: "Teko_700Bold"}}>
              Member since: {memberSince}
            </Text>
          </View>
        </View>
        <TouchableOpacity className="w-1/2 h-[10%] bg-[#bd1212e1] border-black border-1 rounded-xl flex justify-center flex-row items-center ml-[25%] mt-[20%] " onPress={logout}>
          <Text
            style={{ fontFamily: "Teko_700Bold", color: "white", fontSize: 30 }}
          >
            LOGOUT
          </Text>
        </TouchableOpacity>
        {viewLoading ? <ViewLoading /> : ""}
      </View>
    </ImageBackground>
  );
};
export default Profile;

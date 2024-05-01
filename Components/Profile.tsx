import { Text, View, Pressable } from "react-native";
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
import { OpenSans_400Regular,OpenSans_700Bold,OpenSans_300Light} from "@expo-google-fonts/open-sans"
import Records from "./Records";
import MainProfileInfo from "./MainProfileInfo";


const Profile: React.FC = () => {
  const [yourProfile, setYourProfile] = useState<UserProfile>();
  const [profileRank, setProfileRank] = useState<string>("");
  const [memberSince, setMemberSince] = useState<string>("");
  const [rankComponent, setRankComponent] = useState<JSX.Element>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const logout = async (): Promise<void> => {
    const keys = await AsyncStorage.getAllKeys();
    keys.forEach((ele) => deleteFromStorage(ele));
    navigation.navigate("Preload");
  };
  const [currentTab,setCurrentTab]=useState<JSX.Element>(<MainProfileInfo logout={logout}/>)

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
  const styleCurrentTab = (tab:JSX.Element,cssRule:string):string=>{
    if(cssRule==='border') return currentTab.type.name===tab.type.name?'#4CD964':'#131313'
    return currentTab.type.name===tab.type.name?'#4CD964':'#E5E7EB'
  }
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

  const deleteFromStorage = async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  };

  return (
      <View className=" relative w-full p-4 flex gap-4 flex-col bg-[#131313]">
        <View className="flex h-8 px-6">
          <Text className=" m-0 text-2xl text-white" style={{ fontFamily: "OpenSans_700Bold"}}>
            Profile
          </Text>
        </View>
        <View className="flex justify-center flex-col py-3 px-6 gap-3">
            <View className="flex  justify-center flex-col items-center flex-wrap  rounded pl-2  ">
              {rankComponent}
            </View>
            <View className="flex flex-col items-center  gap-1  ">
              <Text className="text-[#4CD964] font-bold w-full text-center text-2xl" style={{ fontFamily: "OpenSans_700Bold"}}>
                  {yourProfile?.name}
              </Text>
              <Text style={{fontFamily:"OpenSans_300Light"}} className="text-gray-200/80 font-light leading-4">
                  {profileRank}
              </Text>
              <Text style={{fontFamily:"OpenSans_300Light"}} className="text-gray-200/80 font-light leading-4"> 
                  Member since: {memberSince}
              </Text>
            </View>
        </View>
        <View className="w-full h-12 flex flex-row m-0 justify-between pr-6">
            <Pressable className="flex flex-row justify-center items-center" style={{borderBottomColor:`${styleCurrentTab(<MainProfileInfo/>,'border')}`,borderBottomWidth:1}}  onPress={()=>setCurrentTab(<MainProfileInfo logout={logout}/>)}><Text className="text-gray-200/80 font-light leading-4 text-center w-20 text-sm" style={{fontFamily:'OpenSans_300Light',color:`${styleCurrentTab(<MainProfileInfo/>,'text')}`}}>Data</Text></Pressable>
            <Pressable className="flex flex-row justify-center items-center" style={{borderBottomColor:`${styleCurrentTab(<Records/>,'border')}`,borderBottomWidth:1}} onPress={()=>setCurrentTab(<Records/>)}><Text className="text-gray-200/80 font-light leading-4 text-center w-20 text-sm" style={{fontFamily:'OpenSans_300Light',color:`${styleCurrentTab(<Records/>,'text')}`}}>Records</Text></Pressable>
            <Pressable className="flex flex-row justify-center items-center"><Text className="text-gray-200/80 font-light leading-4 text-center w-22 text-sm" style={{fontFamily:'OpenSans_300Light'}}>Measurements</Text></Pressable>
        </View>
        <View className="w-full h-2/3">
          {currentTab}
          
        </View>
        {/* <View className="items-center flex justify-center flex-row flex-wrap h-3/5 " >
          
          <View className="w-full flex flex-col h-full items-center">

            <Text className="p-1 border-gray-500 border-2 w-[70%] rounded text-xl mt-5" style={{ fontFamily: "Teko_700Bold"}}>
              Email: {yourProfile?.email}
            </Text>
            <Text className="p-1 border-gray-500 border-2 w-[70%] rounded text-xl mt-5" style={{ fontFamily: "Teko_700Bold"}}>
              Member since: {memberSince}
            </Text>
          </View>
        </View> */}

        {viewLoading ? <ViewLoading /> : ""}
      </View>
  );
};
export default Profile;

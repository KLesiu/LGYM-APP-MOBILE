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
import Measurements from "./Measurements";


const Profile: React.FC = () => {
  const [yourProfile, setYourProfile] = useState<UserProfile>();
  const [profileRank, setProfileRank] = useState<string>("");
  const [memberSince, setMemberSince] = useState<string>("");
  const [profileElo,setProfileElo]= useState<number>()
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
    getUserEloPoints()
  }, []);

  const getDataFromStorage = async (): Promise<void> => {
    const username = await AsyncStorage.getItem("username");
    const email = await AsyncStorage.getItem("email");
    const id = await AsyncStorage.getItem("id");
    setYourProfile({ name: username!, email: email! });
    checkMoreUserInfo(id!);
  };
  const getUserEloPoints = async():Promise<void> =>{
    const id = await AsyncStorage.getItem('id')
    const response =  await fetch(
      `${process.env.REACT_APP_BACKEND}/api/userInfo/${id}/getUserEloPoints`).then(res=>res.json()).catch(err=>err)
    if("elo" in response){
      setProfileElo(response.elo)
    }
    
  }
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
      <View className=" relative w-full bg-[#131313]">
        <View className="w-full p-4 flex flex-col">
        <View className="flex justify-center flex-row py-3 px-6 gap-3">
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
                  {profileElo} Elo
              </Text>
              <Text style={{fontFamily:"OpenSans_300Light"}} className="text-gray-200/80 font-light leading-4"> 
                  Member since: {memberSince}
              </Text>
            </View>
        </View>
        <View className="w-full h-12 flex flex-row m-0 justify-between pr-6 mb-8">
            <Pressable className="flex flex-row justify-center items-center" style={{borderBottomColor:`${styleCurrentTab(<MainProfileInfo/>,'border')}`,borderBottomWidth:1}}  onPress={()=>setCurrentTab(<MainProfileInfo logout={logout}/>)}><Text className="text-gray-200/80 font-light leading-4 text-center w-20 text-sm" style={{fontFamily:'OpenSans_300Light',color:`${styleCurrentTab(<MainProfileInfo/>,'text')}`}}>Data</Text></Pressable>
            <Pressable className="flex flex-row justify-center items-center" style={{borderBottomColor:`${styleCurrentTab(<Records/>,'border')}`,borderBottomWidth:1}} onPress={()=>setCurrentTab(<Records/>)}><Text className="text-gray-200/80 font-light leading-4 text-center w-20 text-sm" style={{fontFamily:'OpenSans_300Light',color:`${styleCurrentTab(<Records/>,'text')}`}}>Records</Text></Pressable>
            <Pressable className="flex flex-row justify-center items-center" style={{borderBottomColor:`${styleCurrentTab(<Measurements/>,'border')}`,borderBottomWidth:1}}  onPress={()=>setCurrentTab(<Measurements/>)}><Text className="text-gray-200/80 font-light leading-4 text-center w-22 text-sm"  style={{fontFamily:'OpenSans_300Light',color:`${styleCurrentTab(<Measurements/>,'text')}`}}>Measurements</Text></Pressable>
        </View>
        <View className="w-full mt-4">
          {currentTab}
          
        </View>
        </View>
       
        {viewLoading ? <ViewLoading /> : <Text></Text>}
      </View>
  );
};
export default Profile;

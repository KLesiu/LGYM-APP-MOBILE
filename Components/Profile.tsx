import { Text,Image,View,ImageBackground,TouchableOpacity } from "react-native";
import backgroundLogo from './img/backgroundLGYMApp500.png'
import { ProfileStyles } from "./styles/ProfileStyles";
import {useState,useEffect} from 'react'
import UserProfile from "./types/UserProfile";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts,Teko_700Bold } from "@expo-google-fonts/teko";
import {Caveat_400Regular} from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen'
import UserInfo from "./types/UserInfo";
import ProfileRank from "./ProfileRank";
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import { RootStackParamList } from "./types/RootStackParamList";
import ViewLoading from "./ViewLoading";

const Profile:React.FC=()=>{
    const [yourProfile,setYourProfile]=useState<UserProfile>()
    const [profileRank,setProfileRank]=useState<string>('')
    const [memberSince,setMemberSince]=useState<string>('')
    const [rankComponent,setRankComponent]=useState<JSX.Element>()
    const [id,setId]=useState<string>()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const [viewLoading,setViewLoading]=useState<boolean>(false)

    const [fontsLoaded]=useFonts({
        Teko_700Bold,
        Caveat_400Regular
    })
    useEffect(() => {
        const loadAsyncResources = async () => {
          try {
            SplashScreen.preventAutoHideAsync();
            await fontsLoaded;
            SplashScreen.hideAsync();
          } catch (error) {
            console.error('Błąd ładowania zasobów:', error);
          }
        };
    
        loadAsyncResources();
      }, [fontsLoaded]);
      
    useEffect(()=>{
        setViewLoading(true)
        getDataFromStorage()
        setRankComponent(<ProfileRank/>)
    },[])

    const getDataFromStorage=async():Promise<void>=>{
      const username =  await AsyncStorage.getItem('username')
      const email = await AsyncStorage.getItem('email')
      const id = await AsyncStorage.getItem('id')
      setYourProfile({name:username!,email:email!})
      setId(id!)
      checkMoreUserInfo(id!)
      
    }
    const checkMoreUserInfo=async(id:string):Promise<void>=>{
        const response: "Didnt find" | UserInfo = await fetch(`${process.env.REACT_APP_BACKEND}/api/userInfo/${id}`).then(res=>res.json()).then(res=>res)
        if(response !== "Didnt find")
             if(response.profileRank && response.createdAt){
                setProfileRank(response.profileRank)
                setMemberSince(response.createdAt.slice(0,10))
                
             } 
        setViewLoading(false)
             
             
     }
    const logout = async():Promise<void>=>{
        const keys = await AsyncStorage.getAllKeys()
        keys.forEach(ele=>deleteFromStorage(ele))
        navigation.navigate('Preload')
    }
    const deleteFromStorage=async(key:string):Promise<void>=>{
        await AsyncStorage.removeItem(key)
    }
    if(!fontsLoaded){
        return <ViewLoading />
    }
    return(
        <ImageBackground source={backgroundLogo} style={ProfileStyles.background}>
            <View style={ProfileStyles.profileContainer}>
                <Text style={{fontFamily:'Teko_700Bold',...ProfileStyles.h1}}>Your profile</Text>
                <View style={ProfileStyles.containerForInfoProfile}>
                    <Text style={{fontFamily:'Teko_700Bold',...ProfileStyles.h2}}>Name: {yourProfile?.name}</Text>
                    <View style={ProfileStyles.columnProfile}>
                        <View style={ProfileStyles.profileRankContainer}>
                            <Text style={{fontFamily:'Teko_700Bold',color:'white',width:'50%',fontSize:25}}>Profile Rank :</Text>
                            <Text style={{fontFamily:'Teko_700Bold',color:'white',fontSize:25}}>{profileRank}</Text>
                            {rankComponent}
                        </View>
                        <Text style={{fontFamily:'Teko_700Bold',...ProfileStyles.h3}}>Email: {yourProfile?.email}</Text>
                        <Text style={{fontFamily:'Teko_700Bold',...ProfileStyles.h3}}>Member since: {memberSince}</Text>
                        
                    </View>
                </View>
                <TouchableOpacity onPress={logout} style={ProfileStyles.logoutButton}>
                    <Text style={{fontFamily:'Teko_700Bold',color:'white',fontSize:30}}>LOGOUT</Text>
                </TouchableOpacity>
                {viewLoading?<ViewLoading />:''}
            </View>
            
        </ImageBackground>
    )
}
export default Profile
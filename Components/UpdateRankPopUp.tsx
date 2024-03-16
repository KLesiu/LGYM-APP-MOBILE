import { View,Text, Image, ImageProps, DeviceEventEmitter, TouchableOpacity } from "react-native"
import { UpdateRankPopUpStyles } from "./styles/UpdateRankPopUpStyles"
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SuccessMsg from "./types/SuccessMsg";
import ViewLoading from "./ViewLoading";
import {
    useFonts,
    Teko_700Bold,
    Teko_400Regular,
  } from "@expo-google-fonts/teko";
  import { Caveat_400Regular } from "@expo-google-fonts/caveat";
  import * as SplashScreen from "expo-splash-screen";
  import Ranks from './helpers/rankStore'
  import UpdateRankPopUpProps from "./props/UpdateRankPopUpProps";


const UpdateRankPopUp:React.FC<UpdateRankPopUpProps> = (props)=>{
    const [rank,setRank] = useState<string>('');
    const [srcRank,setSrcRank]=useState<ImageProps>()
    const [rankMessage,setRankMessage]=useState<string>('Your current rank is')
    const getRank = async()=>{
        const id = await AsyncStorage.getItem("id");
        const response:SuccessMsg = await fetch(`${process.env.REACT_APP_BACKEND}/api/userInfo/${id}/userElo`).then(res=>res.json())
        setRank(response.msg)
        if(response.msg==='Junior 1') setSrcRank(Ranks.Junior1)
        else if(response.msg==='Junior 2') setSrcRank(Ranks.Junior2)
        else if(response.msg==="Junior 3") setSrcRank(Ranks.Junior3)
        else if(response.msg==='Mid 1') setSrcRank(Ranks.Mid1)
        else if(response.msg === 'Mid 2') setSrcRank(Ranks.Mid2)
        else if(response.msg==='Mid 3') setSrcRank(Ranks.Mid3)
        else if(response.msg === 'Pro 1') setSrcRank(Ranks.Pro1)
        else if(response.msg ==='Pro 2') setSrcRank(Ranks.Pro2)
        else if(response.msg === "Pro 3") setSrcRank(Ranks.Pro3)
        else if (response.msg === 'Champ') setSrcRank(Ranks.Champ)
        if(response.isNew) setRankMessage('You have new rank!')
    }
    const [fontsLoaded] = useFonts({
        Teko_700Bold,
        Caveat_400Regular,
        Teko_400Regular,
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
    useEffect(()=>{
        getRank()
    },[])
    if (!fontsLoaded) {
        return <ViewLoading />;
      }
    return(
        <View style={UpdateRankPopUpStyles.updateRankSection}>
            <TouchableOpacity style={UpdateRankPopUpStyles.closePopUp}  onPress={()=>props.closePopUp()}><Text style={{fontFamily:'Teko_700Bold',...UpdateRankPopUpStyles.rankText}}>Close</Text></TouchableOpacity>
            <Text style={{fontFamily:'Teko_700Bold',...UpdateRankPopUpStyles.rankText}}>{rankMessage} :{rank}</Text>
            <Image style={UpdateRankPopUpStyles.image}  source={srcRank as ImageProps} />
        </View>
    )
}
export default UpdateRankPopUp
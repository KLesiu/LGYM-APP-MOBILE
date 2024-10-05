import {Image, ImageProps} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SuccessMsg from "./types/SuccessMsg";
import { useEffect, useState } from "react";
import Ranks from "./helpers/rankStore";

const ProfileRank:React.FC=()=>{
    const apiURL = `${process.env.REACT_APP_BACKEND}`;
    const [rankSrc,setSrcRank] = useState<ImageProps>()
    const getRank = async()=>{
        const id = await AsyncStorage.getItem("id");
        const response: SuccessMsg = await fetch(
          `${apiURL}/api/userInfo/${id}/userElo`
        ).then((res) => res.json());
        if (response.msg === "Junior 1") setSrcRank(Ranks.Junior1);
        else if (response.msg === "Junior 2") setSrcRank(Ranks.Junior2);
        else if (response.msg === "Junior 3") setSrcRank(Ranks.Junior3);
        else if (response.msg === "Mid 1") setSrcRank(Ranks.Mid1);
        else if (response.msg === "Mid 2") setSrcRank(Ranks.Mid2);
        else if (response.msg === "Mid 3") setSrcRank(Ranks.Mid3);
        else if (response.msg === "Pro 1") setSrcRank(Ranks.Pro1);
        else if (response.msg === "Pro 2") setSrcRank(Ranks.Pro2);
        else if (response.msg === "Pro 3") setSrcRank(Ranks.Pro3);
        else if (response.msg === "Champ") setSrcRank(Ranks.Champ);
    }
    useEffect(()=>{
        getRank()
    },[])
   
    return   <Image className="h-24 w-24"  source={rankSrc as ImageProps} />
}
export default ProfileRank
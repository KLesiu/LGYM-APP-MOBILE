import {Image} from "react-native";
import JuniorRank  from './img/Junior1.png'
import { ProfileRankStyles } from "./styles/ProfileRankStyles";
const ProfileRank:React.FC=()=>{
    return <Image style={ProfileRankStyles.image} source={JuniorRank} />
}
export default ProfileRank
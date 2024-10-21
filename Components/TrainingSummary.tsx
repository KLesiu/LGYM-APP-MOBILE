import {
  View,
  Text,
  Image,
  ImageProps,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SuccessMsg from "./types/SuccessMsg";
import Ranks from "./helpers/rankStore";
import TrainingSummaryProps from "./props/TrainingSummaryProps";

const TrainingSummary: React.FC<TrainingSummaryProps> = (props) => {
  const [rank, setRank] = useState<string>("");
  const [srcRank, setSrcRank] = useState<ImageProps>();
  const [rankMessage, setRankMessage] = useState<string>(
    "Your current rank is"
  );
  const getRank = async () => {
    const id = await AsyncStorage.getItem("id");
    // const response: SuccessMsg = await fetch(
    //   `https://lgym-app-api-v2.vercel.app/api/userInfo/${id}/userElo`
    // ).then((res) => res.json());
    // setRank(response.msg);
    const response = {
      msg: "Junior 1",
      isNew: true,
    }
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
    if (response.isNew) setRankMessage("You have new rank!");
  };
  useEffect(() => {
    getRank();
  }, []);
  return (
    <View
    style={{ gap: 16 }}
    className="absolute h-full w-full flex flex-col  bg-[#121212] items-center top-0 z-30 p-4 "
  >
    <Text
      className="text-lg text-white border-b-[1px] border-[#94e798] py-1  w-full"
      style={{ fontFamily: "OpenSans_700Bold" }}
    >
      Training Summary
    </Text>
      {/* <Pressable
      style={{borderRadius:8}}
        className="w-[100px] h-[50px] p-[5px] absolute top-0 right-0 mr-[10px] border-white border-[1px] border-solid "
        onPress={() => props.closePopUp()}
      >
        <Text
          className="text-white text-[30px] text-center"
          style={{
            fontFamily: "Teko_700Bold",
          }}
        >
          Close
        </Text>
      </Pressable> */}
      {/* <Text
        className="text-white text-[30px] text-center"
        style={{
          fontFamily: "Teko_700Bold",
        }}
      >
        {rankMessage} :{rank}
      </Text>
      <Image className="w-[250px] h-[250px]" source={srcRank as ImageProps} /> */}
    </View>
  );
};
export default TrainingSummary;

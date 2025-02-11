import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import ViewLoading from "../../elements/ViewLoading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserBaseInfo } from "../../../interfaces/User";

const UsersRanking: React.FC = () => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [ranking, setRanking] = useState<UserBaseInfo[]>([]);
  const [username,setUsername]= useState<string>("");
  const getRanking = async () => {
    const response = await fetch(
      `${apiURL}/api/getUsersRanking`
    )
    const result = await response.json()
    setRanking(result);
    const username = await AsyncStorage.getItem("username");
    if(!username)return
    setUsername(username)
  };

  useEffect(() => {
    getRanking();
  }, []);

  return (
    <View className="h-full w-full flex flex-col gap-2">
      <Text
        className="text-[#94e798] text-lg"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
       Ranking
      </Text>
      <ScrollView className="flex flex-col gap-2 smh:h-52 mdh:h-64  ">
      {ranking.length ? (
        ranking.map((ele: UserBaseInfo,index:number) => {
            let color = "text-white"
            if(ele.name === username) color="text-[#94e798]"
          return (
            
            <View className="flex flex-row " key={index}>
              <Text
                className={color + " mr-2 text-sm"}
                
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {index+1}
              </Text>
              <Text
              
                className={color + " text-sm"}
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {ele.name} - {ele.elo} ELO
              </Text>
            </View>
          );
        })
      ) : (
        <ViewLoading />
      )}
      <View className="h-10 w-full"></View>
      </ScrollView>
    </View>
  );
};
export default UsersRanking;

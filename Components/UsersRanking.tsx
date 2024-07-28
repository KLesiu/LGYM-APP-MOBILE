import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { UserRanking } from "./types/Training";
import ViewLoading from "./ViewLoading";

const UsersRanking: React.FC = () => {
  const [ranking, setRanking] = useState<UserRanking[]>([]);
  const username = localStorage.getItem("username")
  const getRanking = async () => {
    const response = await fetch(
      "https://lgym-app-api-v2.vercel.app/api/getBestTenUsersFromElo"
    )
      .then((res) => res.json())
      .catch((err) => err);
    setRanking(response);
  };

  useEffect(() => {
    getRanking();
  }, []);

  return (
    <View className="h-full w-full">
      <Text
        className="text-[#4CD964] text-xl"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
       Ranking
      </Text>
      <ScrollView className="flex flex-col py-4 gap-2 smh:h-40 xsmh:h-72 mdh:h-80 lgh:h-96 ">
      {ranking.length ? (
        ranking.map((ele: UserRanking) => {
            let color = "text-white"
            if(ele.user.name === username) color="text-[#4CD964]"
          return (
            
            <View className="flex flex-row ">
              <Text
                className={color + " mr-2"}
                
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {ele.position}
              </Text>
              <Text
                className={color}
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {ele.user.name} - {ele.user.elo} ELO
              </Text>
            </View>
          );
        })
      ) : (
        <ViewLoading />
      )}
      </ScrollView>
    </View>
  );
};
export default UsersRanking;

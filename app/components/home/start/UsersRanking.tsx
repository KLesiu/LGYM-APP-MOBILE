import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserBaseInfo } from "./../../../../interfaces/User";
import { useAppContext } from "../../../AppContext";
import Card from "../../elements/Card";

const UsersRanking: React.FC = () => {
  const [ranking, setRanking] = useState<UserBaseInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [myInfo, setMyInfo] = useState<UserBaseInfo>();

  const { getAPI } = useAppContext();

  useEffect(() => {
    getRanking();
  }, []);

  const getRanking = async () => {
    try {
      await getAPI("/getUsersRanking", async (response: UserBaseInfo[]) => {
        setRanking(response);
        const username = await AsyncStorage.getItem("username");
        if (!username) return;
        const currentMyRanking = response.find(
          (ele: UserBaseInfo) => ele.name === username
        );
        if (!currentMyRanking) return;
        setMyInfo(currentMyRanking);
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card isLoading={isLoading} customClasses="flex-1">
      <View className="h-full w-full flex flex-col" style={{ gap: 4 }}>
        <Text
          className="text-primaryColor text-xl smallPhone:text-base"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Ranking
        </Text>
        <ScrollView className="flex flex-col gap-2  h-64 smh:h-52 ">
          {ranking.map((ele: UserBaseInfo, index: number) => {
            let color = "text-white";
            let fontSize = "smallPhone:text-xs";
            if (myInfo && ele.name === myInfo.name) {
              color = "text-primaryColor";
            }
            if (index === 0) {
              fontSize = "text-lg smallPhone:text-base";
            }
            return (
              <View className="flex flex-row " key={index}>
                <Text
                  className={color + " mr-2 " + fontSize}
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  {index + 1}
                </Text>
                <Text
                  className={color + " " + fontSize}
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  {ele.name} - {ele.elo} ELO
                </Text>
              </View>
            );
          })}
          <View className="h-10 w-full"></View>
        </ScrollView>
      </View>
    </Card>
  );
};
export default UsersRanking;

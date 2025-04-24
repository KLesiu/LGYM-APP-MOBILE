import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import ViewLoading from "../../elements/ViewLoading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserBaseInfo } from "./../../../../interfaces/User";

const UsersRanking: React.FC = () => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [ranking, setRanking] = useState<UserBaseInfo[]>([]);
  const [myInfo, setMyInfo] = useState<UserBaseInfo>();
  const [myPosition, setMyPosition] = useState<number>();

  useEffect(() => {
    getRanking();
  }, []);

  const getRanking = async () => {
    const response = await fetch(`${apiURL}/api/getUsersRanking`);
    const result = (await response.json()) as UserBaseInfo[];
    setRanking(result);
    const username = await AsyncStorage.getItem("username");
    if (!username) return;
    const currentMyRanking = result.find((ele: UserBaseInfo, index: number) => {
      if (ele.name === username) {
        setMyPosition(index + 1);
        return true;
      }
      return false;
    });
    if (!currentMyRanking) return;
    setMyInfo(currentMyRanking);
  };

  return (
    <View className="h-full w-full flex flex-col gap-2">
      <Text
        className="text-primaryColor smallPhone:text-base midPhone:text-lg"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        Ranking
      </Text>
      {/* <View className="flex flex-row ">
        <Text
          className={"text-primaryColor"}
          style={{ fontFamily: "OpenSans_400Regular" }}
        >
          {myPosition}. {myInfo ? `${myInfo.name} - ${myInfo.elo}ELO` : ""}
        </Text>
      </View> */}
      <ScrollView className="flex flex-col gap-2 smh:h-52 mdh:h-64  ">
        {ranking.length ? (
          ranking.map((ele: UserBaseInfo, index: number) => {
            let color = "text-white";
            let fontSize = "smallPhone:text-[12px] midPhone:text-sm";
            if (myInfo && ele.name === myInfo.name) {
              color = "text-primaryColor";
            }
            if (index === 0) {
              fontSize = "smallPhone:text-base midPhone:text-lg";
            }
            return (
              <View className="flex flex-row " key={index}>
                <Text
                  className={color + " mr-2 " + fontSize}
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  {index + 1}
                </Text>
                <Text
                  className={color + " " + fontSize}
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

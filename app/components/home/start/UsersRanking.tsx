import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserBaseInfo } from "./../../../../interfaces/User";
import { useAppContext } from "../../../AppContext";
import Card from "../../elements/Card";

import * as Animatable from 'react-native-animatable';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

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

  const getRankStyle = (index: number, userName: string) => {
    let color = "#e0f7fa";
    let fontFamily = "OpenSans_400Regular";
    let textPrefix = "";

    if (index === 0) {
      color = "#FFD700";
      fontFamily = "OpenSans_700Bold";
      textPrefix = "🏆 ";
    }

    if (myInfo && userName === myInfo.name) {
      color = "#20c2d7";
      fontFamily = "OpenSans_700Bold";
    }

    return { color, fontFamily, textPrefix };
  };

  return (
    <Card isLoading={isLoading} customClasses="flex-1">
      <View className="h-full w-full flex flex-col" style={{ gap: 4 }}>
        {/* --- Nagłówek --- */}
        <View className="flex flex-row justify-between items-center" style={{ gap: 2 }}>
          <MaskedView
            maskElement={
              <Text className="text-lg smallPhone:text-base" style={{ fontFamily: "OpenSans_700Bold", backgroundColor: 'transparent' }}>
                Winter Arc 2025 Ranking
              </Text>
            }
          >
            <LinearGradient
              colors={['#e0f7fa', '#88ddff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text className="text-lg smallPhone:text-base opacity-0" style={{ fontFamily: "OpenSans_700Bold" }}>
                Winter Arc 2025 Ranking
              </Text>
            </LinearGradient>
          </MaskedView>
          <Text style={{ fontSize: 24, color: "#88ddff" }}>❄️</Text>
        </View>

        {/* --- Lista rankingu --- */}
        <ScrollView className="flex flex-col h-64 smh:h-52">
          {ranking.map((ele: UserBaseInfo, index: number) => {
            const bgColor = index % 2 !== 0 ? "bg-black/20" : "bg-transparent";
            const { color, fontFamily, textPrefix } = getRankStyle(index, ele.name);

            const content = (
              <View
                className={`flex flex-row py-1 rounded-md items-center ${bgColor}`}
              >
                <Text
                  className="mr-2 text-sm smallPhone:text-xs w-8 text-center"
                  style={{ fontFamily: fontFamily, color: color }}
                >
                  {index + 1}.
                </Text>
                <Text
                  className="text-sm smallPhone:text-xs flex-1"
                  style={{ fontFamily: fontFamily, color: color }}
                >
                  {textPrefix}
                  {ele.name} - {ele.elo} ELO
                </Text>
              </View>
            );

            if (index === 0) {
              return (
                <Animatable.View
                  key={index}
                  animation="fadeIn"
                  delay={index * 30}
                  duration={300} 
                  useNativeDriver 
                >
                  <Animatable.View
                    animation="pulse"
                    easing="ease-in-out"
                    iterationCount="infinite"
                    duration={2000}
                  >
                    {content}
                  </Animatable.View>
                </Animatable.View>
              );
            }

            return (
              <Animatable.View
                key={index}
                animation="fadeIn"
                delay={index * 30}
                duration={300}
                useNativeDriver
              >
                {content}
              </Animatable.View>
            );
          })}
          <View className="h-10 w-full" />
        </ScrollView>
      </View>
    </Card>
  );
};

export default UsersRanking;
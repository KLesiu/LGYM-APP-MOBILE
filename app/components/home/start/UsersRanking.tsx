import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ListRenderItem } from "react-native";
import Card from "../../elements/Card";
import * as Animatable from 'react-native-animatable';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { UserBaseInfoDto } from "../../../../api/generated/model";
import { useGetApiGetUsersRanking } from "../../../../api/generated/user/user";
import { useAuthStore } from "../../../../stores/useAuthStore";
import colors from "../../../../constants/colors";
import { useTranslation } from "react-i18next";

const RANK_COLORS = {
  gold: colors.rankGold || "#FFD700",
  cyanLight: colors.rankCyanLight || "#e0f7fa",
  cyan: colors.rankCyan || "#88ddff",
  cyanDark: colors.rankCyanDark || "#20c2d7",
};

const UsersRanking: React.FC = () => {
  const { t } = useTranslation();
  const [ranking, setRanking] = useState<UserBaseInfoDto[]>([]);
  const { user } = useAuthStore();
  const { data, isLoading } = useGetApiGetUsersRanking({
    query: { staleTime: Infinity },
  });

  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      setRanking(data.data);
    }
  }, [data]);

  const getRankStyle = (index: number, userName: string) => {
    let color = RANK_COLORS.cyanLight;
    let fontFamily = "OpenSans_400Regular";
    let textPrefix = "";

    if (index === 0) {
      color = RANK_COLORS.gold;
      fontFamily = "OpenSans_700Bold";
      textPrefix = "🏆 ";
    }

    if (user && userName === user.name) {
      color = RANK_COLORS.cyanDark;
      fontFamily = "OpenSans_700Bold";
    }

    return { color, fontFamily, textPrefix };
  };

  const renderItem: ListRenderItem<UserBaseInfoDto> = ({ item: ele, index }) => {
    const userName = ele.name || "Unknown";
    const userElo = ele.elo ?? 0;
    const bgColor = index % 2 !== 0 ? "bg-black/20" : "bg-transparent";
    const { color, fontFamily, textPrefix } = getRankStyle(index, userName);

    const content = (
      <View className={`flex flex-row py-1 rounded-md items-center ${bgColor}`}>
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
          {userName} - {userElo} ELO
        </Text>
      </View>
    );

    if (index === 0) {
      return (
        <Animatable.View
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
        animation="fadeIn"
        delay={index * 30}
        duration={300}
        useNativeDriver
      >
        {content}
      </Animatable.View>
    );
  };

  return (
    <Card isLoading={isLoading} customClasses="flex-1">
      <View className="h-full w-full flex flex-col" style={{ gap: 4 }}>
        {/* --- Nagłówek --- */}
        <View className="flex flex-row justify-between items-center" style={{ gap: 2 }}>
          <MaskedView
            maskElement={
              <Text className="text-lg smallPhone:text-base" style={{ fontFamily: "OpenSans_700Bold", backgroundColor: 'transparent' }}>
                {t('start.rankingTitle')}
              </Text>
            }
          >
            <LinearGradient
              colors={[RANK_COLORS.cyanLight, RANK_COLORS.cyan]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text className="text-lg smallPhone:text-base opacity-0" style={{ fontFamily: "OpenSans_700Bold" }}>
                {t('start.rankingTitle')}
              </Text>
            </LinearGradient>
          </MaskedView>
          <Text style={{ fontSize: 24, color: RANK_COLORS.cyan }}>❄️</Text>
        </View>

        {/* --- Lista rankingu --- */}
        <View className="flex-1 h-64 smh:h-52">
          <FlatList
            data={ranking}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.name || index.toString()}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View className="h-10 w-full" />}
          />
        </View>
      </View>
    </Card>
  );
};

export default UsersRanking;
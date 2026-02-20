import { View, Text } from "react-native";
import ProfileRank from "../../elements/ProfileRank";
import ProgressBar from "../../elements/ProgressBar";
import { useEffect, useState } from "react";
import Card from "../../elements/Card";
import { useAppContext } from "../../../AppContext";
import React from "react";
import { useAuthStore } from "../../../../stores/useAuthStore";
import { useTranslation } from "react-i18next";

const ProgressInfo: React.FC = () => {
  const { t } = useTranslation();
  const { getRankColor } = useAppContext();
  const { user } = useAuthStore();

  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    if(user){
      setProgress(
        Math.floor((user.elo / user.nextRank.needElo) * 10000) / 100
      );
      setIsLoading(false);
    }
  }, [user]);

  if(!getRankColor) return null;

  return (
    <Card isLoading={isLoading} customClasses="items-center">
      {!isLoading && user && (
        <>
          <View className="flex flex-col" style={{ gap: 4 }}>
            <Text
            className="text-primaryColor  text-lg smallPhone:text-base"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              {t('start.progress')}
            </Text>
            <View className="flex flex-col px-1" style={{ gap: 2 }}>
              <View className="flex flex-row" style={{ gap: 4 }}>
                <Text
                  className="text-textColor text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  {t('start.currentRank')}
                </Text>
                <Text
                  className={` midPhone:text-sm text-md smallPhone:text-xs`}
                  style={{ fontFamily: "OpenSans_400Regular" ,color:getRankColor}}
                >
                  {user.profileRank}
                </Text>
              </View>
              <View className="flex flex-row" style={{ gap: 4 }}>
                <Text
                  className="text-textColor text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  {t('start.elo')}
                </Text>
                <Text
                  className="text-textColor  midPhone:text-sm text-md smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  {user.elo}
                </Text>
              </View>
              <View className="flex flex-row" style={{ gap: 4 }}>
                <Text
                  className="text-textColor text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  {t('start.nextRank')}
                </Text>
                 <Text
                   className={`text-textColor  midPhone:text-sm text-md smallPhone:text-xs`}
                   style={{ fontFamily: "OpenSans_300Light" }}
                 >
                   {String(user.nextRank.name ?? "N/A")}
                 </Text>
              </View>

              <View className="mt-2 mb-2">
                {progress > 0 && <ProgressBar width={progress} />}
              </View>
              <View className="flex flex-row" style={{ gap: 4 }}>
                <Text
                  className="text-textColor text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  {t('start.completed')}
                </Text>
                <Text
                  className="text-textColor  midPhone:text-sm text-md smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  {progress}%
                </Text>
              </View>
            </View>
          </View>
          <ProfileRank rank={user?.profileRank!} />
        </>
      )}
    </Card>
  );
};

export default ProgressInfo;

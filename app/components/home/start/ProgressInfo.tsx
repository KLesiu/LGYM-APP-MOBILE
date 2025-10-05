import { View, Text } from "react-native";
import ProfileRank from "../../elements/ProfileRank";
import ProgressBar from "../../elements/ProgressBar";
import { useEffect, useState } from "react";
import { UserInfo } from "./../../../../interfaces/User";
import Card from "../../elements/Card";
import { useAppContext } from "../../../AppContext";
import { useHomeContext } from "../HomeContext";
import React from "react";

const ProgressInfo: React.FC = () => {
  const { userId ,setUserRank} = useHomeContext();

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { getAPI } = useAppContext();

  useEffect(() => {
    getRankInfo();
  }, []);

  const getRankInfo = async () => {
    try {
      await getAPI(`/${userId}/getUserInfo`, (response: UserInfo) => {
        setUserInfo(response);
        setUserRank(response.profileRank!)
        setProgress(
          Math.floor((response.elo / response.nextRank.needElo) * 10000) / 100
        );
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card isLoading={isLoading} customClasses="items-center">
      {!isLoading && userInfo && (
        <>
          <View className="flex flex-col" style={{ gap: 4 }}>
            <Text
              className="text-primaryColor  midPhone:text-lg text-xl smallPhone:text-base"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              Progress
            </Text>
            <View className="flex flex-col px-1" style={{ gap: 2 }}>
              <View className="flex flex-row" style={{ gap: 4 }}>
                <Text
                  className="text-fifthColor text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Current Rank:
                </Text>
                <Text
                  className="text-fifthColor  midPhone:text-sm text-md smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  {userInfo.profileRank}
                </Text>
              </View>
              <View className="flex flex-row" style={{ gap: 4 }}>
                <Text
                  className="text-fifthColor text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  ELO:
                </Text>
                <Text
                  className="text-fifthColor  midPhone:text-sm text-md smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  {userInfo.elo}
                </Text>
              </View>
              <View className="flex flex-row" style={{ gap: 4 }}>
                <Text
                  className="text-fifthColor text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Next Rank:
                </Text>
                <Text
                  className="text-[#FC2C44]  midPhone:text-sm text-md smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  {userInfo.nextRank.name}
                </Text>
              </View>

              <View className="mt-2 mb-2">
                {progress > 0 && <ProgressBar width={progress} />}
              </View>
              <View className="flex flex-row" style={{ gap: 4 }}>
                <Text
                  className="text-fifthColor text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Completed:
                </Text>
                <Text
                  className="text-fifthColor  midPhone:text-sm text-md smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  {progress}%
                </Text>
              </View>
            </View>
          </View>
          <ProfileRank rank={userInfo?.profileRank!} />
        </>
      )}
    </Card>
  );
};

export default ProgressInfo;

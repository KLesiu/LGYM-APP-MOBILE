import { View, Text } from "react-native";
import ProfileRank from "../../elements/ProfileRank";
import ProgressBar from "../../elements/ProgressBar";
import { useEffect, useState } from "react";
import Card from "../../elements/Card";
import { useAppContext } from "../../../AppContext";
import React from "react";

const ProgressInfo: React.FC = () => {
  const {userInfo,getRankColor} = useAppContext()

  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    setIsLoading(true);
    if(userInfo){
      setProgress(
        Math.floor((userInfo.elo / userInfo.nextRank.needElo) * 10000) / 100
      );
      setIsLoading(false);
    }
  }, [userInfo]);

  if(!getRankColor) return null;

  return (
    <Card isLoading={isLoading} customClasses="items-center">
      {!isLoading && userInfo && (
        <>
          <View className="flex flex-col" style={{ gap: 4 }}>
            <Text
            className="text-primaryColor  text-lg smallPhone:text-base"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              Progress
            </Text>
            <View className="flex flex-col px-1" style={{ gap: 2 }}>
              <View className="flex flex-row" style={{ gap: 4 }}>
                <Text
                  className="text-textColor text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  Current Rank:
                </Text>
                <Text
                  className={` midPhone:text-sm text-md smallPhone:text-xs`}
                  style={{ fontFamily: "OpenSans_400Regular" ,color:getRankColor}}
                >
                  {userInfo.profileRank}
                </Text>
              </View>
              <View className="flex flex-row" style={{ gap: 4 }}>
                <Text
                  className="text-textColor text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  ELO:
                </Text>
                <Text
                  className="text-textColor  midPhone:text-sm text-md smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  {userInfo.elo}
                </Text>
              </View>
              <View className="flex flex-row" style={{ gap: 4 }}>
                <Text
                  className="text-textColor text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  Next Rank:
                </Text>
                <Text
                  className={`text-textColor  midPhone:text-sm text-md smallPhone:text-xs`}
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  {userInfo.nextRank.name}
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
                  Completed:
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
          <ProfileRank rank={userInfo?.profileRank!} />
        </>
      )}
    </Card>
  );
};

export default ProgressInfo;

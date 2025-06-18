import { View, Text } from "react-native";
import ProfileRank from "../../elements/ProfileRank";
import ProgressBar from "../../elements/ProgressBar";
import { useEffect, useState } from "react";
import { UserInfo } from "./../../../../interfaces/User";
import Card from "../../elements/Card";
import { useAppContext } from "../../../AppContext";
import { useHomeContext } from "../HomeContext";

const ProgressInfo: React.FC = () => {
  const { userId } = useHomeContext();

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
          <View>
            <Text
              className="text-primaryColor  midPhone:text-lg text-xl smallPhone:text-base"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              Progress
            </Text>
            <View className="flex flex-col justify-around">
              <View className="flex flex-col " style={{ gap: 8 }}>
                <Text
                  className="text-white  midPhone:text-sm text-md smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  Current Rank: {userInfo.profileRank}
                </Text>
                <Text
                  className="text-white  midPhone:text-sm text-md smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  Elo: {userInfo.elo}
                </Text>
                <Text
                  className="text-white  midPhone:text-sm text-md smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  Next Rank: {userInfo.nextRank.name}
                </Text>
                {progress > 0 && <ProgressBar width={progress} />}
                <Text
                  className="text-white  midPhone:text-sm text-md smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_300Light" }}
                >
                  Completed: {progress}%
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

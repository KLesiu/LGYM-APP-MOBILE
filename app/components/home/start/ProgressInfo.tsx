import { View, Text } from "react-native";
import ProfileRank from "../../elements/ProfileRank";
import ProgressBar from "../../elements/ProgressBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useHomeContext } from "../HomeContext";
import { UserInfo } from "./../../../../interfaces/User";
import ViewLoading from "../../elements/ViewLoading";
import Card from "../../elements/Card";
import { useAppContext } from "../../../AppContext";

const ProgressInfo: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { getAPI } = useAppContext();

  useEffect(() => {
    getRankInfo();
  }, []);

  const getRankInfo = async () => {
    const id = await AsyncStorage.getItem("id");
    try{
      await getAPI(`/${id}/getUserInfo`, (response: UserInfo) => {
        setUserInfo(response);
        setProgress(
          Math.floor((response.elo / response.nextRank.needElo) * 10000) / 100
        );
      });
    }
    finally{
      setIsLoading(false);
    }
   
  };

  return (
    <Card isLoading={isLoading} customClasses="items-center">
      {userInfo && (
        <>
          <View>
            <Text
              className="text-primaryColor smallPhone:text-base midPhone:text-lg"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              Progress
            </Text>
            <View className="flex flex-col justify-around">
              <View className="flex flex-col " style={{ gap: 8 }}>
                <Text
                  className="text-white smallPhone:text-[12px] midPhone:text-sm"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Current Rank: {userInfo.profileRank}
                </Text>
                <Text
                  className="text-white smallPhone:text-[12px] midPhone:text-sm"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Elo: {userInfo.elo}
                </Text>
                <Text
                  className="text-white smallPhone:text-[12px] midPhone:text-sm"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Next Rank: {userInfo.nextRank.name}
                </Text>
                {progress > 0 && <ProgressBar width={progress} />}
                <Text
                  className="text-white smallPhone:text-[12px] midPhone:text-sm"
                  style={{ fontFamily: "OpenSans_400Regular" }}
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

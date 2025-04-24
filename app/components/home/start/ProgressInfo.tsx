import { View, Text } from "react-native";
import ProfileRank from "../../elements/ProfileRank";
import ProgressBar from "../../elements/ProgressBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useHomeContext } from "../HomeContext";
import { UserInfo } from "./../../../../interfaces/User";
import ViewLoading from "../../elements/ViewLoading";
import Card from "../../elements/Card";

const ProgressInfo: React.FC = () => {
  const { apiURL } = useHomeContext();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const getRankInfo = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${apiURL}/api/${id}/getUserInfo`);
    const data: UserInfo = await response.json();
    setUserInfo(data);
    setProgress(Math.floor((data.elo / data.nextRank.needElo) * 10000) / 100);
  };

  const initStart = useCallback(async () => {
    setViewLoading(true);
    await getRankInfo();
    setViewLoading(false);
  }, []);

  useEffect(() => {
    initStart();
  }, []);

  return (
    <Card customClasses="items-center">
      <View>
        <Text
          className="text-primaryColor smallPhone:text-base midPhone:text-lg"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Progress
        </Text>
        <View className="flex flex-col justify-around">
          {userInfo ? (
            <View className="flex flex-col " style={{gap:8}}>
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
          ) : (
            <ViewLoading />
          )}
        </View>
      </View>
      {!viewLoading && userInfo && userInfo.profileRank ? (
        <ProfileRank rank={userInfo.profileRank} />
      ) : (
        <ViewLoading />
      )}
    </Card>
  );
};

export default ProgressInfo;

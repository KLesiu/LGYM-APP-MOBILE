import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import ErrorMsg from "./types/ErrorMsg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StartProps from "./props/StartProps";
import AddTraining from "./AddTraining";
import ProfileRank from "./ProfileRank";
import ProgressBar from "./ProgressBar";
import ViewLoading from "./ViewLoading";
import UsersRanking from "./UsersRanking";
import { LastTrainingInfo } from "./interfaces/Training";
import { UserInfo } from "./interfaces/User";

const Start: React.FC<StartProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [lastTrainingInfo, setLastTrainingInfo] =
    useState<LastTrainingInfo>();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<number>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  useEffect(() => {
    setViewLoading(true);
    getLastTrainingInfo();
    getRankInfo();
  }, []);
  const getLastTrainingInfo = async () => {
    const id = await AsyncStorage.getItem("id");
    const response: ErrorMsg | LastTrainingInfo = await fetch(
      `${apiURL}/api/${id}/getLastTraining`
    )
      .then((res) => res.json())
      .catch((err) => err);
    if ("msg" in response) return setError(response.msg);
    setLastTrainingInfo(response);
  };
  const getRankInfo = async () => {
    const id = await AsyncStorage.getItem("id");
    const response: UserInfo = await fetch(
      `${apiURL}/api/${id}/getUserInfo`
    )
      .then((res) => res.json())
      .catch((err) => err);
    if (!response) return;
   setUserInfo(response)
   setProgress(Math.floor((response.elo / response.nextRank.needElo) * 10000) / 100);
   setViewLoading(false);
  };
  const navigateTo = (component: JSX.Element) => {
    props.viewChange(component);
  };
  return (
    <View className="w-full flex flex-col flex-1 bg-[#121212] ">
      <View className="flex h-full w-full gap-4 flex-col">
        <View className="flex w-full justify-between flex-row bg-[#1E1E1E73] items-center p-4 rounded-lg">
          <View>
            <Text
              className="text-[#94e798] text-xl"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              Last Training:
            </Text>
            {error ? (
              <Text
                className="text-white"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {error}
              </Text>
            ) : (
              <View className="flex">
                <Text
                  className="text-white"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Date:{" "}
                  {new Date(lastTrainingInfo?.createdAt!).toLocaleString()}
                </Text>
                <Text
                  className="text-white"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Type: {lastTrainingInfo?.planDay.name}
                </Text>
              </View>
            )}
          </View>

          <Pressable
            onPress={() => navigateTo(<AddTraining toggleMenuButton={props.toggleMenuButton} />)}
            className="h-16 w-24 bg-[#94e798] rounded-xl flex items-center justify-center"
          >
            <Text
              className="text-[#131313] text-lg text-center"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              ADD NEW
            </Text>
          </Pressable>
        </View>
        <View className="flex w-full flex-row justify-between bg-[#1E1E1E73] items-center p-4 rounded-lg">
          <View>
            <Text
              className="text-[#94e798] text-xl"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              Progress
            </Text>
            <View className="flex flex-col h-36 justify-around">
              <View className="flex flex-col gap-2">
                <Text
                  className="text-white text-sm"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Current Rank: {userInfo?.profileRank}
                </Text>
                <Text
                  className="text-white text-sm"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Elo: ({userInfo?.elo})
                </Text>
                <Text
                  className="text-white text-sm"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Next Rank: {userInfo?.nextRank.name}
                </Text>
              </View>
              {userInfo?.nextRank.needElo && progress ? (
                <ProgressBar width={progress} />
              ) : (
                <Text></Text>
              )}
              <Text
                className="text-white"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                Completed: {progress ? progress : <Text></Text>}%
              </Text>
            </View>
          </View>
          <ProfileRank />
        </View>
        <View className="flex w-full justify-between flex-row bg-[#1E1E1E73] items-center p-4 rounded-lg flex-1">
          <UsersRanking />
        </View>
      </View>
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </View>
  );
};
export default Start;

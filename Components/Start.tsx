import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import LastTrainingSession from "./types/LastTrainingSession";
import ErrorMsg from "./types/ErrorMsg";
import Training from "./types/Training";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StartProps from "./props/StartProps";
import AddTraining from "./AddTraining";
import { RankInfo } from "./types/UserInfo";
import ProfileRank from "./ProfileRank";
import ProgressBar from "./ProgressBar";
import ViewLoading from "./ViewLoading";

const Start: React.FC<StartProps> = (props) => {
  const [lastTrainingInfo, setLastTrainingInfo] =
    useState<LastTrainingSession>();
  const [rankInfo, setRankInfo] = useState<RankInfo>();
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<number>();
  const [viewLoading,setViewLoading]=useState<boolean>(false)
  useEffect(() => {
    setViewLoading(true)
    getTrainingInfo();
    getRankInfo();
  }, []);
  const getTrainingInfo = async () => {
    const id = await AsyncStorage.getItem("id");
    const response: ErrorMsg | Training = await fetch(
      `https://lgym-app-api-v2.vercel.app/api/${id}/getLastTraining`
    )
      .then((res) => res.json())
      .catch((err) => err);
    if ("msg" in response) return setError(response.msg);
    setLastTrainingInfo(response);
  };
  const getRankInfo = async () => {
    const id = await AsyncStorage.getItem("id");
    const response: RankInfo = await fetch(
      `https://lgym-app-api-v2.vercel.app/api/${id}/getInfoAboutRankAndElo`
    )
      .then((res) => res.json())
      .catch((err) => err);
    if (!response) return;
    setRankInfo(response);
    const scale: number = response.nextRankElo - response.startRankElo;
    const upperElo: number = response.elo - response.startRankElo;
    setProgress(Math.round((upperElo / scale)*100));
    setViewLoading(false)

  };
  const navigateTo = (component: JSX.Element) => {
    props.viewChange(component);
  };
  return (
    <View className="w-full m-0 h-[78%] bg-[#131313] ">
      <View className="flex h-full w-full gap-4 flex-col">
        <View className="flex w-full justify-between flex-row bg-[#1E1E1E73] items-center p-4 rounded-lg">
          <View>
            <Text
              className="text-[#4CD964] text-xl"
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
                  Type: {lastTrainingInfo?.type}
                </Text>
              </View>
            )}
          </View>

          <Pressable
            onPress={() => navigateTo(<AddTraining />)}
            className="h-16 w-24 bg-[#4CD964] rounded-xl flex items-center justify-center"
          >
            <Text
              className="text-white text-lg text-center"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              ADD NEW
            </Text>
          </Pressable>
        </View>
        <View className="flex w-full flex-row justify-between bg-[#1E1E1E73] items-center p-4 rounded-lg" >
          <View>
            <Text
              className="text-[#4CD964] text-xl"
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
                  Current Rank: {rankInfo?.rank} 
                </Text>
                <Text className="text-white text-sm" style={{fontFamily:'OpenSans_400Regular'}}>Elo: ({rankInfo?.elo})</Text>
                <Text
                  className="text-white text-sm"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Next Rank: {rankInfo?.nextRank}
                </Text>
              </View>
              {rankInfo && progress ? (
                <ProgressBar
                width={progress}
                />
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
      </View>
      {viewLoading?<ViewLoading/>:<Text></Text>}
    </View>
  );
};
export default Start;

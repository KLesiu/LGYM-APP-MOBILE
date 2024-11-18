import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddTraining from "../training/AddTraining";
import ProfileRank from "../../elements/ProfileRank";
import ProgressBar from "../../elements/ProgressBar";
import ViewLoading from "../../elements/ViewLoading";
import UsersRanking from "./UsersRanking";
import { LastTrainingInfo } from "../../../interfaces/Training";
import { UserInfo } from "../../../interfaces/User";
import { Message } from "../../../enums/Message";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import ResponseMessage from "../../../interfaces/ResponseMessage";

interface StartProps {
  viewChange: (view: JSX.Element) => void;
  toggleMenuButton: (hide: boolean) => void;
}

const Start: React.FC<StartProps> = (props) => {
  const apiURL = `${process.env.REACT_APP_BACKEND}`;
  const [lastTrainingInfo, setLastTrainingInfo] = useState<LastTrainingInfo>();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<number>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  useEffect(() => {
    initStart();
  }, []);
  const initStart = async () => {
    setViewLoading(true);
    await getLastTrainingInfo();
    await getRankInfo();
    setViewLoading(false);
  };
  const getLastTrainingInfo = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      const response = await fetch(`${apiURL}/api/${id}/getLastTraining`);
      if (!response.ok) {
        return setError(Message.DidntFind);
      }
      const data: ResponseMessage | LastTrainingInfo = await response.json();
      if ("msg" in data) return setError(data.msg);
      setLastTrainingInfo(data);
    } catch (error) {
      setError(Message.DidntFind);
    }
  };

  const getRankInfo = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      const response = await fetch(`${apiURL}/api/${id}/getUserInfo`);

      if (!response.ok) {
        console.error("Failed to fetch rank info:", response.status);
        return setError("Failed to fetch rank info.");
      }

      const data: UserInfo = await response.json();
      setUserInfo(data);
      setProgress(Math.floor((data.elo / data.nextRank.needElo) * 10000) / 100);
    } catch (error) {
      console.error("Network or JSON parsing error:", error);
      setError("An error occurred. Please try again.");
    }
  };
  const navigateTo = (component: JSX.Element) => {
    props.viewChange(component);
  };
  return (
    <View className="w-full flex flex-col flex-1 bg-[#121212] ">
      <View style={{ gap: 8 }} className="flex h-full w-full flex-col">
        <View
          style={{ borderRadius: 8 }}
          className="flex w-full justify-between flex-row bg-[#1E1E1E73] items-center p-4 "
        >
          <View>
            <Text
              className="text-[#94e798] text-lg"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              Last Training:
            </Text>
            {!error &&
            lastTrainingInfo &&
            Object.keys(lastTrainingInfo).length ? (
              <View className="flex">
                <Text
                  className="text-white text-sm"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Date: {new Date(lastTrainingInfo.createdAt!).toLocaleString()}
                </Text>
                <Text
                  className="text-white text-sm"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Type: {lastTrainingInfo.planDay.name}
                </Text>
              </View>
            ) : (
              <Text
                className="text-white text-sm"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {error}
              </Text>
            )}
          </View>
          <CustomButton
            buttonStyleSize={ButtonSize.xl}
            onPress={() =>
              navigateTo(
                <AddTraining toggleMenuButton={props.toggleMenuButton} />
              )
            }
            buttonStyleType={ButtonStyle.success}
            text="New"
          />
        </View>
        <View
          style={{ borderRadius: 8 }}
          className="flex w-full flex-row justify-between bg-[#1E1E1E73] items-center p-4"
        >
          <View>
            <Text
              className="text-[#94e798] text-lg"
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
                className="text-white text-sm"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                Completed: {progress ? progress : <Text></Text>}%
              </Text>
            </View>
          </View>
          {userInfo && userInfo.profileRank && (
            <ProfileRank rank={userInfo.profileRank} />
          )}
        </View>
        <View
          style={{ borderRadius: 12 }}
          className="flex w-full justify-between flex-row bg-[#1E1E1E73] items-center p-4  flex-1"
        >
          <UsersRanking />
        </View>
      </View>
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </View>
  );
};
export default Start;

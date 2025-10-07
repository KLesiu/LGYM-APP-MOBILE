import { View, Text } from "react-native";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import AddTraining from "../training/Training";
import { JSX, useCallback, useEffect, useState } from "react";
import { LastTrainingInfo } from "../../../../interfaces/Training";
import { useHomeContext } from "../HomeContext";
import Card from "../../elements/Card";
import { useAppContext } from "../../../AppContext";
import ViewLoading from "../../elements/ViewLoading";
import React from "react";

const LastTrainingStartInfo: React.FC = () => {
  const [lastTrainingInfo, setLastTrainingInfo] = useState<LastTrainingInfo>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { getAPI } = useAppContext();
  const { changeView, userId } = useHomeContext();
  const {getRankColor} = useAppContext()

  useEffect(() => {
    getLastTrainingInfo();
  }, []);

  const getLastTrainingInfo = async () => {
    try {
      await getAPI(`/${userId}/getLastTraining`, (response: LastTrainingInfo) =>
        setLastTrainingInfo(response)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const navigateTo = useCallback((component: JSX.Element) => {
    changeView(component);
  }, []);

  if (isLoading) {
    return (
      <Card>
        <ViewLoading />
      </Card>
    );
  }

  return (
    <Card>
      <View className="flex flex-row justify-between w-full ">
        <View className="flex flex-col" style={{ gap: 4 }}>
          <Text
            className="text-primaryColor  text-lg smallPhone:text-base"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            Last Training:
          </Text>
          <View className="flex flex-col px-1" style={{ gap: 2 }}>
            <View className="flex flex-row" style={{ gap: 4 }}>
              <Text
                className="text-textColor text-sm smallPhone:text-xs"
                style={{ fontFamily: "OpenSans_300Light" }}
              >
                Date:
              </Text>
              <Text
                className="text-textColor text-sm smallPhone:text-xs"
                style={{ fontFamily: "OpenSans_300Light" }}
              >
                {lastTrainingInfo && lastTrainingInfo.createdAt
                  ? new Date(lastTrainingInfo.createdAt).toLocaleString()
                  : "N/A"}
              </Text>
            </View>
            <View className="flex flex-row" style={{ gap: 4 }}>
              <Text
                className="text-textColor text-sm smallPhone:text-xs"
                style={{ fontFamily: "OpenSans_300Light" }}
              >
                Type:
              </Text>
              {getRankColor &&   <Text
                className={`text-sm smallPhone:text-xs`}
                style={{ fontFamily: "OpenSans_400Regular" ,color:getRankColor}}
              >
                {lastTrainingInfo && lastTrainingInfo.planDay.name
                  ? lastTrainingInfo?.planDay.name
                  : "N/A"}
              </Text>}
            
            </View>
          </View>
        </View>

        <CustomButton
          buttonStyleSize={ButtonSize.long}
          onPress={() => navigateTo(<AddTraining />)}
          buttonStyleType={ButtonStyle.success}
          customClasses="self-center"
          text="New"
        />
      </View>
    </Card>
  );
};

export default LastTrainingStartInfo;

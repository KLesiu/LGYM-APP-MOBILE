import { View, Text } from "react-native";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import AddTraining from "../training/Training";
import { useCallback, useEffect, useState } from "react";
import { LastTrainingInfo } from "../../../../interfaces/Training";
import { useHomeContext } from "../HomeContext";
import Card from "../../elements/Card";
import { useAppContext } from "../../../AppContext";
import ViewLoading from "../../elements/ViewLoading";

const LastTrainingStartInfo: React.FC = () => {
  const [lastTrainingInfo, setLastTrainingInfo] = useState<LastTrainingInfo>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { getAPI } = useAppContext();
  const { changeView, userId } = useHomeContext();

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
      <View>
        <Text
          className="text-primaryColor smallPhone:text-base text-xl"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Last Training:
        </Text>
        <View className="flex">
          <Text
            className="text-white smallPhone:text-[12px] text-sm text-md"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Date:
            {lastTrainingInfo && lastTrainingInfo.createdAt
              ? new Date(lastTrainingInfo.createdAt).toLocaleString()
              : "N/A"}
          </Text>
          <Text
            className="text-white smallPhone:text-[12px] text-sm text-md"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            Type:
            {lastTrainingInfo && lastTrainingInfo.planDay.name
              ? lastTrainingInfo?.planDay.name
              : "N/A"}
          </Text>
        </View>
      </View>

      <CustomButton
        buttonStyleSize={ButtonSize.xl}
        onPress={() => navigateTo(<AddTraining />)}
        buttonStyleType={ButtonStyle.success}
        text="New"
      />
    </Card>
  );
};

export default LastTrainingStartInfo;

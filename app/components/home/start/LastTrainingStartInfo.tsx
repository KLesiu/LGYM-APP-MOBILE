import { View, Text } from "react-native";
import CustomButton, {
  ButtonSize,
  ButtonStyle,
} from "../../elements/CustomButton";
import AddTraining from "../training/Training";
import { useCallback, useEffect, useState } from "react";
import { LastTrainingInfo } from "../../../../interfaces/Training";
import { useHomeContext } from "../HomeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ResponseMessage from "../../../../interfaces/ResponseMessage";
import Card from "../../elements/Card";

const LastTrainingStartInfo: React.FC = () => {
  const { changeView, apiURL } = useHomeContext();

  const [error, setError] = useState<string>("");
  const [lastTrainingInfo, setLastTrainingInfo] = useState<LastTrainingInfo>();

  const getLastTrainingInfo = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(`${apiURL}/api/${id}/getLastTraining`);
    const data: ResponseMessage | LastTrainingInfo = await response.json();
    if ("msg" in data) return setError(data.msg);
    setLastTrainingInfo(data);
  };

  const navigateTo = useCallback((component: JSX.Element) => {
    changeView(component);
  }, []);

  useEffect(()=>{
    getLastTrainingInfo();
  },[])
  return (
    <Card
    >
      <View>
        <Text
          className="text-primaryColor smallPhone:text-base midPhone:text-lg"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Last Training:
        </Text>
        {!error && lastTrainingInfo && Object.keys(lastTrainingInfo).length ? (
          <View className="flex">
            <Text
              className="text-white smallPhone:text-[12px] midPhone:text-sm"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              Date: {new Date(lastTrainingInfo.createdAt!).toLocaleString()}
            </Text>
            <Text
              className="text-white smallPhone:text-[12px] midPhone:text-sm"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              Type: {lastTrainingInfo.planDay.name}
            </Text>
          </View>
        ) : (
          <Text
            className="text-white smallPhone:text-[12px] midPhone:text-sm"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {error}
          </Text>
        )}
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

export default LastTrainingStartInfo

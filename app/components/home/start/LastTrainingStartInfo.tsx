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
import Card from "../../elements/Card";
import { useAppContext } from "../../../AppContext";

const LastTrainingStartInfo: React.FC = () => {

  const [lastTrainingInfo, setLastTrainingInfo] = useState<LastTrainingInfo>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {getAPI} = useAppContext();
  const { changeView } = useHomeContext();


  const getLastTrainingInfo = async () => {
    try{
      const id = await AsyncStorage.getItem("id");
      await getAPI(`/${id}/getLastTraining`,(response:LastTrainingInfo)=>setLastTrainingInfo(response));
    }
    finally{
      setIsLoading(false);
    }
  
  };

  const navigateTo = useCallback((component: JSX.Element) => {
    changeView(component);
  }, []);

  useEffect(()=>{
    getLastTrainingInfo();
  },[])
  return (
    <Card isLoading={isLoading} 
    >
      <View>
        <Text
          className="text-primaryColor smallPhone:text-base midPhone:text-lg"
          style={{ fontFamily: "OpenSans_700Bold" }}
        >
          Last Training:
        </Text>
        <View className="flex">
            <Text
              className="text-white smallPhone:text-[12px] midPhone:text-sm"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              Date: {new Date(lastTrainingInfo?.createdAt!).toLocaleString()}
            </Text>
            <Text
              className="text-white smallPhone:text-[12px] midPhone:text-sm"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              Type: {lastTrainingInfo?.planDay.name}
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

export default LastTrainingStartInfo

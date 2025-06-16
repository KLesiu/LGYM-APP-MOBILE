import { useEffect, useState } from "react";
import LineChart from "../templates/LineChart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "react-native";
import { useHomeContext } from "../../HomeContext";
import { useAppContext } from "../../../../AppContext";
import { EloRegistryBaseChart } from "../../../../../interfaces/EloRegistry";

const EloRegistryChart: React.FC = () => {
  const [data, setData] = useState<EloRegistryBaseChart[]>([]);
  const { userId } = useHomeContext();
  const { getAPI } = useAppContext();

  useEffect(() => {
    getEloRegistry();
  }, []);

  const getEloRegistry = async () => {
    await getAPI(
      `/eloRegistry/${userId}/getEloRegistryChart`,
      (result: EloRegistryBaseChart[]) => {
        setData(result);
      }
    );
  };

  return data.length ? (
    <View className="h-60 w-full">
      <LineChart data={data as never[]} />
    </View>
  ) : (
    <View></View>
  );
};

export default EloRegistryChart;

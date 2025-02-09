import BackgroundMainSection from "../../elements/BackgroundMainSection";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import LineChart from "./LineChart";

interface ChartsProps {
  toggleMenuButton: (hide: boolean) => void;
}

const Charts: React.FC<ChartsProps> = () => {
  const API_URL = process.env.REACT_APP_BACKEND;
  const [data, setData] = useState([]);

  useEffect(() => {
    getEloRegistry();
  }, []);

  const getEloRegistry = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await fetch(
      `${API_URL}/api/eloRegistry/${id}/getEloRegistryChart`
    );
    const result = await response.json();
    setData(result);
  };

  return (
    <BackgroundMainSection>
      <View className="h-1/2">
        {data.length ? <LineChart data={data} /> : null}
      </View>
    </BackgroundMainSection>
  );
};

export default Charts;

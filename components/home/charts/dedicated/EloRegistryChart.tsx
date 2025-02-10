import { useEffect, useState } from "react";
import LineChart from "../templates/LineChart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "react-native";

const EloRegistryChart: React.FC = () => {
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
    console.log(result);
    setData(result);
  };

  return data.length ? (
    <View className="h-60 w-full">
      <Text
        style={{ fontFamily: "OpenSans_300Light" }}
        className="  text-white  text-base"
      >
        Elo chart:
      </Text>
      <LineChart data={data} />
    </View>
  ) : (
    <View></View>
  );
};

export default EloRegistryChart;

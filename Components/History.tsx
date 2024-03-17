import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import backgroundLogo from "./img/backgroundLGYMApp500.png";
import { HistoryStyles } from "./styles/HistoryStyles";
import { useState, useEffect } from "react";
import Session from "./types/Session";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  useFonts,
  Teko_700Bold,
  Teko_400Regular,
} from "@expo-google-fonts/teko";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import * as SplashScreen from "expo-splash-screen";
import TrainingHistory from "./types/TrainingHistory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CurrentTrainingHistorySession from "./CurrentTrainingHistorySession";
import ErrorMsg from "./types/ErrorMsg";
import Training from "./types/Training";
import ViewLoading from "./ViewLoading";
const History: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessions, setCurrentSessions] = useState<Session[]>([]);
  const [currentHistoryTrainingSession, setCurrentHistoryTrainingSession] =
    useState<JSX.Element>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [fontsLoaded] = useFonts({
    Teko_700Bold,
    Caveat_400Regular,
    Teko_400Regular,
  });
  useEffect(() => {
    const loadAsyncResources = async () => {
      try {
        SplashScreen.preventAutoHideAsync();
        await fontsLoaded;
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Błąd ładowania zasobów:", error);
      }
    };

    loadAsyncResources();
  }, [fontsLoaded]);
  useEffect(() => {
    setViewLoading(true);
    getTrainingHistory();
  }, []);
  useEffect(() => {
    setCurrentSessions(sessions);
    if (sessions.length > 0) setViewLoading(false);
  }, [sessions]);
  const getTrainingHistory = async (): Promise<void> => {
    const id = await AsyncStorage.getItem("id");
    const response: { msg: string } | TrainingHistory = await fetch(
      `${process.env.REACT_APP_BACKEND}/api/${id}/getTrainingHistory`
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => res);
    if ("trainingHistory" in response) {
      const sessions: Array<Session> = response.trainingHistory.map((ele) => {
        let session: Session = {
          date: ele.createdAt,
          symbol: ele.type,
          exercises: ele.exercises,
          id: ele._id,
        };
        return session;
      });
      setSessions(sessions);
    } else setViewLoading(false);
  };
  const showCurrentTrainingHistorySession = (id: string, date: string): void =>
    setCurrentHistoryTrainingSession(
      <CurrentTrainingHistorySession
        getInformationAboutHistorySession={getInformationAboutHistorySession}
        offCurrentTrainingHistorySession={offCurrentTrainingHistorySession}
        id={id}
        date={date}
      />
    );

  const offCurrentTrainingHistorySession: VoidFunction = (): void =>
    setCurrentHistoryTrainingSession(<View></View>);

  const getInformationAboutHistorySession = async (
    id: string
  ): Promise<Training | string> => {
    const response: ErrorMsg | { training: Training } = await fetch(
      `${process.env.REACT_APP_BACKEND}/api/${id}/getTrainingSession`
    )
      .then((res) => res.json())
      .catch((err) => err)
      .then((res) => res);
    if ("msg" in response) return response.msg;
    else return response.training;
  };
  if (!fontsLoaded) {
    return <ViewLoading />;
  }

  return (
    <ImageBackground className="h-[79%] w-[98%] mx-[1%] flex-1 justify-center items-center opacity-100 " styles={HistoryStyles.background} source={backgroundLogo}>
      <View className="bg-[#fffffff7] h-[99%] w-full z-[2]" style={HistoryStyles.historyContainer}>
        <Text className="text-4xl text-center" style={{ fontFamily: "Teko_700Bold"}}>
          Training History
        </Text>
        <ScrollView className="p-1 flex flex-col">
          {currentSessions.length > 0 ? (
            currentSessions.map((ele, index: number) => {
              return (
                <View className="items-start border-[3px] border-gray-500 flex flex-col justify-start relative mt-[2%] p-5 w-[90%] mx-[5%] rounded-xl mb-[2%]" key={index}>
                  <Text
                    style={{
                      fontFamily: "Teko_700Bold",
                      borderWidth: 1,
                      borderBottomColor: "white",
                      marginBottom: 10,
                      paddingLeft: 5,
                      borderLeftColor: "white",
                      borderBottomLeftRadius: 3,
                    }}
                  >
                    Training symbol {ele.symbol}
                  </Text>
                  <Text style={{ fontFamily: "Teko_700Bold" }}>
                    Date:{" "}
                    <Text style={{ fontFamily: "Teko_400Regular" }}>
                      {ele.date.slice(0, 25)}
                    </Text>
                  </Text>
                  <Text style={{ fontFamily: "Teko_700Bold" }}>
                    Series:{" "}
                    <Text style={{ fontFamily: "Teko_400Regular" }}>
                      {" "}
                      {ele.exercises.length / 2}
                    </Text>
                  </Text>
                  <Text style={{ fontFamily: "Teko_700Bold" }}>
                    Id:{" "}
                    <Text style={{ fontFamily: "Teko_400Regular" }}>
                      {ele.id}
                    </Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      showCurrentTrainingHistorySession(ele.id!, ele.date!)
                    }
                    className="absolute right-[10%] top-[30%]"
                  >
                    <Icon className="text-[40px]" name="book-outline" />
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View className="flex w-full h-full justify-center items-center">
              <Text
                style={{
                  fontFamily: "Teko_700Bold"
                }}
                className="text-xl"
              >
                You dont have training history!
              </Text>
            </View>
          )}
        </ScrollView>
        {currentHistoryTrainingSession}
        {viewLoading ? <ViewLoading /> : ""}
      </View>
    </ImageBackground>
  );
};
export default History;

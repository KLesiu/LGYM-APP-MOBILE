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
    <ImageBackground style={HistoryStyles.background} source={backgroundLogo}>
      <View style={HistoryStyles.historyContainer}>
        <Text style={{ fontFamily: "Teko_700Bold", ...HistoryStyles.h1 }}>
          Training History
        </Text>
        <ScrollView style={HistoryStyles.scrollView}>
          {currentSessions.length > 0 ? (
            currentSessions.map((ele, index: number) => {
              return (
                <View style={HistoryStyles.session} key={index}>
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
                    style={HistoryStyles.buttonRead}
                  >
                    <Icon style={{ fontSize: 40 }} name="book-outline" />
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View style={HistoryStyles.withoutTrainingContainer}>
              <Text
                style={{
                  fontFamily: "Teko_700Bold",
                  ...HistoryStyles.withoutTrainingText,
                }}
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

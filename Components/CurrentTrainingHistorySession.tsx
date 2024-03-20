import { Text, View, ScrollView } from "react-native";
import Training from "./types/Training";
import ExerciseTraining from "./types/ExerciseTraining";
import { useState, useEffect } from "react";
import CurrentTrainingHistorySessionProps from "./props/CurrentTrainingHistorySessionProps";
import { useFonts, Teko_700Bold } from "@expo-google-fonts/teko";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import * as SplashScreen from "expo-splash-screen";
import ViewLoading from "./ViewLoading";
const CurrentTrainingHistorySession: React.FC<
  CurrentTrainingHistorySessionProps
> = (props) => {
  const [infoAboutSession, setInfoAboutSession] = useState<JSX.Element>();
  const [exercises, setExercises] = useState<ExerciseTraining[]>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [fontsLoaded] = useFonts({
    Teko_700Bold,
    Caveat_400Regular,
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
    getInformationAboutSession();
  }, []);
  const getInformationAboutSession = async (): Promise<void> => {
    const response: string | Training = await props
      .getInformationAboutHistorySession(props.id)
      .then((res) => res);
    if (typeof response !== "string") {
      setExercises(response.exercises);
      setInfoAboutSession(() => (
        <View
        className="bg-[#9696961a] rounded-md mb-[2%] mt-[1%] h-[10%] text-white flex flex-wrap flex-row justify-center w-full"
        >
          <Text
          className="m-1 w-full text-[25px] text-center"
            style={{
              fontFamily: "Teko_700Bold"
            }}
          >
            TrainingDay: {response.type}
          </Text>
        </View>
      ));
    }
    setViewLoading(false);
  };
  if (!fontsLoaded) {
    return <ViewLoading />;
  }
  return (
    <View
      className="bg-black flex flex-wrap h-full w-full absolute justify-center"
    >
      <Text
        style={{
          fontFamily: "Teko_700Bold"
        }}
        className="text-white m-0 text-2xl h-[10%] w-full text-center"
      >
        Date: {props.date.slice(0, 25)}
      </Text>
      {infoAboutSession}
      <ScrollView style={{ height: 10000 }}>
        <View className="flex flex-row w-full flex-wrap">
          {exercises?.map((ele, index: number) => (
            <View
              key={index}
              className="items-center flex justify-between text-center flex-row w-1/2 border-b-[1px] border-b-white "
            >
              <View className="items-center flex justify-between flex-row h-full w-full text-left">
                {index % 2 ? (
                  <Text style={{ fontSize: 0, width: 0 }}> {ele.field}</Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: "Teko_400Regular"
                    }}
                    className="text-center w-[75%] text-[18px] h-full pl-[5%] pr-[5%] border-r-white border-r-[1px] bg-[#9696961a] rounded-lg text-white"
                  >
                    {ele.field.slice(0, ele.field.length - 3)}
                  </Text>
                )}
                {index % 2 ? (
                  <Text
                    style={{
                      fontFamily: "Teko_400Regular"
                    }}
                    className="w-full text-3xl text-white"
                  >
                    x {ele.score}kg
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: "Teko_400Regular"
                    }}
                    className="text-white text-3xl w-1/5 text-right"
                  >
                    {ele.score}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      {viewLoading ? <ViewLoading /> : ""}
    </View>
  );
};
export default CurrentTrainingHistorySession;

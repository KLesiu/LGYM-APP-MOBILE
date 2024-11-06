import { Text, View, ScrollView } from "react-native";
import Training from "../../../types/Training";
import ExerciseTraining from "../../../types/ExerciseTraining";
import { useState, useEffect } from "react";
import ViewLoading from "../../elements/ViewLoading";


interface CurrentTrainingHistorySessionProps{
  id:string,
  date:string,
  getInformationAboutHistorySession:(id: string) => Promise<Training | string>
  offCurrentTrainingHistorySession:VoidFunction
}

const CurrentTrainingHistorySession: React.FC<
  CurrentTrainingHistorySessionProps
> = (props) => {
  const [infoAboutSession, setInfoAboutSession] = useState<JSX.Element>();
  const [exercises, setExercises] = useState<ExerciseTraining[]>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);
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
        style={{ borderRadius:6}}
        className="bg-[#e6e6e627] mb-[2%] mt-[1%] h-[10%]  flex flex-wrap flex-row justify-center w-full"
        >
          <Text
          className="m-1 w-full text-[25px] text-center text-white"
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
                      fontFamily: "Teko_400Regular",
                      borderRadius:8
                    }}
                    className="text-center w-[75%] text-[18px] h-full pl-[5%] pr-[5%] border-r-white border-r-[1px] bg-[#9696961a] text-white"
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
      {viewLoading ? <ViewLoading /> : <Text></Text>}
    </View>
  );
};
export default CurrentTrainingHistorySession;

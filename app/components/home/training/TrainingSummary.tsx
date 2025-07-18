import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import ProfileRank from "../../elements/ProfileRank";
import ProgressBar from "../../elements/ProgressBar";
import { TrainingSummary as TrainingSummaryInterface } from "./../../../../interfaces/Training";

interface TrainingSummaryProps{
  closePopUp:()=>void,
  trainingSummary: TrainingSummaryInterface
}

const TrainingSummary: React.FC<TrainingSummaryProps> = (props) => {
  const [progress, setProgress] = useState<number>();

  useEffect(() => {
    if (
      props.trainingSummary.nextRank &&
      props.trainingSummary.nextRank.needElo
    )
      setProgress(
        Math.floor(
          ((props.trainingSummary.gainElo + props.trainingSummary.userOldElo) /
            props.trainingSummary.nextRank?.needElo) *
            10000
        ) / 100
      );
  });

  const bestProgress = props.trainingSummary.progress.bestProgress;
  const worseRegress = props.trainingSummary.progress.worseRegress;
  return (
    <View
      style={{ gap: 16 }}
      className="absolute h-full w-full flex flex-col  bg-bgColor items-center top-0 z-30 p-4 "
    >
      <Text
        className="text-lg text-white border-b-[1px] border-primaryColor py-1  w-full"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        Training Summary
      </Text>
      <ScrollView
        className="w-full min-h-[300px] -mr-4 pr-4"
        contentContainerStyle={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <View
          style={{ borderRadius: 8, gap: 16 }}
          className="flex w-full flex-col  justify-between items-center"
        >
          <View className=" bg-secondaryColor w-full rounded-lg  p-4">
            <View style={{ gap: 8 }} className="flex flex-row items-center">
              <Text
                className="text-primaryColor text-lg smallPhone:text-base"
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                Best progress:
              </Text>
              <Text
                className="text-white text-base smallPhone:text-sm"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {bestProgress.exercise}
              </Text>
            </View>

            <View style={{ gap: 8 }} className="flex flex-col  justify-around">
              <Text
                className="text-white text-sm smallPhone:text-xs"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                Series number: {bestProgress.series}
              </Text>
              <View style={{ gap: 8 }} className="flex flex-row">
                <Text
                  className="text-white text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Reps:
                </Text>
                {bestProgress.repsScore >= 0 ? (
                  <Text
                    className="text-primaryColor text-sm smallPhone:text-xs"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    +{bestProgress.repsScore}
                  </Text>
                ) : (
                  <Text
                    className="text-red-400 text-sm smallPhone:text-xs"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {bestProgress.repsScore}
                  </Text>
                )}
              </View>
              <View style={{ gap: 8 }} className="flex flex-row">
                <Text
                  className="text-white text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Weight:
                </Text>
                {bestProgress.weightScore >= 0 ? (
                  <Text
                    className="text-primaryColor text-sm smallPhone:text-xs"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    +{bestProgress.weightScore}kg
                  </Text>
                ) : (
                  <Text
                    className="text-red-400 text-sm"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {bestProgress.weightScore}kg
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View className=" bg-secondaryColor w-full rounded-lg  p-4">
            <View style={{ gap: 8 }} className="flex flex-row items-center">
              <Text
                className="text-red-400 text-lg smallPhone:text-base"
                style={{ fontFamily: "OpenSans_700Bold" }}
              >
                Worst Regress:{" "}
              </Text>
              <Text
                className="text-white text-base smallPhone:text-sm"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {worseRegress.exercise}
              </Text>
            </View>
            <View style={{ gap: 8 }} className="flex flex-col  justify-around">
              <Text
                className="text-white text-sm smallPhone:text-xs"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                Series number: {worseRegress.series}
              </Text>
              <View style={{ gap: 8 }} className="flex flex-row">
                <Text
                  className="text-white text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Reps:
                </Text>
                {worseRegress.repsScore >= 0 ? (
                  <Text
                    className="text-primaryColor text-sm smallPhone:text-xs"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    +{worseRegress.repsScore}
                  </Text>
                ) : (
                  <Text
                    className="text-red-400 text-sm smallPhone:text-xs"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {worseRegress.repsScore}
                  </Text>
                )}
              </View>
              <View style={{ gap: 8 }} className="flex flex-row">
                <Text
                  className="text-white text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Weight:
                </Text>
                {worseRegress.weightScore >= 0 ? (
                  <Text
                    className="text-primaryColor text-sm smallPhone:text-xs"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    +{worseRegress.weightScore}kg
                  </Text>
                ) : (
                  <Text
                    className="text-red-400 text-sm smallPhone:text-xs"
                    style={{ fontFamily: "OpenSans_400Regular" }}
                  >
                    {worseRegress.weightScore}kg
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
        <View
          className="flex w-full flex-row justify-between rounded-lg bg-secondaryColor items-center p-4"
        >
          <View className="flex flex-col">
            <Text
              className="text-primaryColor text-lg smallPhone:text-base"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              Progress
            </Text>
            <View className="flex flex-coljustify-around" style={{ gap: 8 }}>
              <View className="flex flex-col gap-2">
                <Text
                  className="text-white text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Current Rank: {props.trainingSummary.profileRank.name}
                </Text>
                <Text
                  className="text-white text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Elo: (
                  {props.trainingSummary.userOldElo +
                    props.trainingSummary.gainElo}
                  ) (
                  {props.trainingSummary.gainElo >= 0
                    ? `+${props.trainingSummary.gainElo}`
                    : props.trainingSummary.gainElo}
                  )
                </Text>
                <Text
                  className="text-white text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  Next Rank:{" "}
                  {props.trainingSummary.nextRank
                    ? props.trainingSummary.nextRank.name
                    : "You are on the highest rank"}
                </Text>
              </View>
              {props.trainingSummary.nextRank &&
              props.trainingSummary.nextRank.needElo &&
              progress && 
                <ProgressBar width={progress} />
               }
              <Text
                className="text-white text-sm smallPhone:text-xs"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                Completed: {progress ? progress : <Text></Text>}%
              </Text>
            </View>
          </View>
          <ProfileRank rank={props.trainingSummary.profileRank.name} />
        </View>
      </ScrollView>
      <View className="flex w-full flex-row justify-end">
        <Pressable
          onPress={() => props.closePopUp()}
          style={{ borderRadius: 8 }}
          className={` flex flex-row justify-center items-center w-28 h-14 bg-primaryColor`}
        >
          <Text
            className="text-base"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
export default TrainingSummary;

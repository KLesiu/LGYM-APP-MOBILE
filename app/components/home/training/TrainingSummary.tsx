import { View, Text, Pressable, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import ProfileRank from "../../elements/ProfileRank";
import ProgressBar from "../../elements/ProgressBar";
import {
  TrainingSummary as TrainingSummaryInterface,
} from "./../../../../interfaces/Training";
import React from "react";
import SeriesSummaryRow from "./elements/SeriesSummaryRow";
import { useTranslation } from "react-i18next";


interface TrainingSummaryProps {
  closePopUp: () => void;
  trainingSummary: TrainingSummaryInterface;
}

const TrainingSummary: React.FC<TrainingSummaryProps> = (props) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<number>();

  useEffect(() => {
    if (
      props.trainingSummary.nextRank &&
      props.trainingSummary.nextRank.needElo
    ) {
      setProgress(
        Math.floor(
          ((props.trainingSummary.gainElo + props.trainingSummary.userOldElo) /
            props.trainingSummary.nextRank?.needElo) * 10000
        ) / 100
      );
    }
  }, [props.trainingSummary]);

  return (
    <View
      style={{ gap: 16 }}
      className="absolute h-full w-full flex flex-col bg-bgColor items-center top-0 z-30 p-4"
    >
      <Text
        className="text-lg text-textColor border-b-[1px] border-primaryColor py-1 w-full"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        {t('training.summary')}
      </Text>

      <ScrollView
        className="w-full flex-1"
        contentContainerStyle={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 16,
          paddingBottom: 80,
        }}
      >
           <View
          className="flex w-full flex-row justify-between rounded-lg bg-secondaryColor items-center p-4"
        >
          <View className="flex flex-col">
            <Text
              className="text-primaryColor text-lg smallPhone:text-base"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              {t('training.progress')}
            </Text>
            <View className="flex flex-col justify-around" style={{ gap: 8 }}>
              <View className="flex flex-col gap-2">
                <Text
                  className="text-textColor text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  {t('training.currentRank', { rank: props.trainingSummary.profileRank.name })}
                </Text>
                <Text
                  className="text-textColor text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                  {t('training.elo', { 
                    elo: props.trainingSummary.userOldElo + props.trainingSummary.gainElo,
                    gain: props.trainingSummary.gainElo >= 0 ? `+${props.trainingSummary.gainElo}` : props.trainingSummary.gainElo 
                  })}
                </Text>
                <Text
                  className="text-textColor text-sm smallPhone:text-xs"
                  style={{ fontFamily: "OpenSans_400Regular" }}
                >
                   {t('training.nextRank')}
                   {' '}
                   {props.trainingSummary.nextRank
                     ? (typeof props.trainingSummary.nextRank.name === 'string' ? props.trainingSummary.nextRank.name : (props.trainingSummary.nextRank.name as any)?.name || 'Unknown')
                     : t('training.highestRank')}
                </Text>
              </View>
              {props.trainingSummary.nextRank &&
                props.trainingSummary.nextRank.needElo &&
                progress &&
                <ProgressBar width={progress} />
              }
              <Text
                className="text-textColor text-sm smallPhone:text-xs"
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {t('training.completed', { percent: progress ? `${progress}%` : "0%" })}
              </Text>
            </View>
          </View>
          <ProfileRank rank={typeof props.trainingSummary.profileRank === 'string' ? props.trainingSummary.profileRank : (props.trainingSummary.profileRank as any)?.name} />
        </View>
        {props.trainingSummary.comparison.map((exercise) => (
          <View key={exercise.exerciseId} className="bg-secondaryColor w-full rounded-lg p-4">
            <Text
              className="text-primaryColor text-lg smallPhone:text-base mb-2"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              {exercise.exerciseName}
            </Text>
            {exercise.seriesComparisons.map((seriesData) => (
              <SeriesSummaryRow key={seriesData.series} seriesComparison={seriesData} />
            ))}
          </View>
        ))}

     
      </ScrollView>

      <View className="flex w-full flex-row justify-end">
        <Pressable
          onPress={() => props.closePopUp()}
          style={{ borderRadius: 8 }}
          className={` flex flex-row justify-center items-center w-28 h-14 bg-primaryColor`}
        >
          <Text
            className="text-base text-bgColor"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {t('training.continue')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TrainingSummary;
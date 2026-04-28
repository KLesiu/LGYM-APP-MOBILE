import { View, Text, FlatList } from 'react-native';
import { TrainingByDateDetails } from './../../../../types/models';
import GymIcon from './../../../../img/icons/gymIcon.svg';
import Card from '../../elements/Card';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface TrainingSessionProps {
  trainings: TrainingByDateDetails[];
}

const TrainingSession: React.FC<TrainingSessionProps> = (props) => {
  const { t } = useTranslation();
  return (
    <FlatList
      data={props.trainings}
      keyExtractor={(training) => training._id}
      className="w-full flex-1 pt-2"
      contentContainerStyle={{ gap: 16 }}
      renderItem={({ item: training }) => (
        <View style={{ gap: 8 }} className="flex flex-col">
          <View className="flex flex-col justify-between gap-1">
            <Text style={{ fontFamily: 'OpenSans_700Bold' }} className="text-lg text-primaryColor">
              {t('history.trainingWithPlan', { planName: training.planDay.name })}
            </Text>
            <View className="flex flex-row items-center">
              <GymIcon />
              <Text className="text-[11px] text-textColor" style={{ fontFamily: 'OpenSans_400Regular' }}>
                {training.gym}
              </Text>
            </View>
          </View>

          <FlatList
            data={training.exercises}
            keyExtractor={(exercise) => exercise.exerciseDetails._id}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item: exercise }) => (
              <Card>
                <View style={{ gap: 8 }} className="w-full flex flex-col border-b-[1px] border-b-white">
                  <Text
                    style={{ fontFamily: 'OpenSans_700Bold' }}
                    className="text-base font-bold text-textColor border-b-[1px] border-b-white"
                  >
                    {exercise.exerciseDetails.name}:{exercise.exerciseDetails.bodyPart}
                  </Text>
                  <FlatList
                    data={exercise.scoresDetails}
                    keyExtractor={(score) => `${exercise.exerciseDetails._id}-${score.series}`}
                    scrollEnabled={false}
                    contentContainerStyle={{ gap: 8 }}
                    renderItem={({ item: score }) => (
                      <View className="flex flex-row justify-between">
                        <Text style={{ fontFamily: 'OpenSans_400Regular' }} className="text-textColor">
                          {t('history.seriesWithValue', { series: score.series })}
                        </Text>
                        <Text style={{ fontFamily: 'OpenSans_400Regular' }} className="text-textColor">
                          {score.reps} x {score.weight} {score.unit}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </Card>
            )}
          />
        </View>
      )}
    />
  );
};
export default TrainingSession;

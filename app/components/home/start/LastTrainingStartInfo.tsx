import { View, Text } from 'react-native';
import CustomButton, { ButtonSize, ButtonStyle } from '../../elements/CustomButton';
import AddTraining from '../training/Training';
import { JSX, useCallback } from 'react';
import { useHomeContext } from '../HomeContext';
import Card from '../../elements/Card';
import ViewLoading from '../../elements/ViewLoading';
import React from 'react';
import { FontWeights } from '../../../../enums/FontsProperties';
import { useGetApiIdGetLastTraining } from '../../../../api/generated/training/training';
import { useTranslation } from 'react-i18next';
import { useAuthStore, getAuthRankColor } from '../../../../stores/useAuthStore';

const LastTrainingStartInfo: React.FC = () => {
  const { t } = useTranslation();
  const profileRank = useAuthStore((state) => state.user?.profileRank);
  const getRankColor = getAuthRankColor(profileRank);
  const { changeView, userId } = useHomeContext();
  const { data: lastTrainingResponse, isLoading } = useGetApiIdGetLastTraining(userId, {
    query: { enabled: !!userId },
  });

  const lastTrainingInfo = lastTrainingResponse?.data;
  const isValidTraining =
    !!lastTrainingInfo && typeof lastTrainingInfo === 'object' && 'createdAt' in lastTrainingInfo;

  const lastTrainingInfoData = isValidTraining
    ? (lastTrainingInfo as {
        createdAt?: string | Date;
        planDay?: { name?: string };
      })
    : undefined;

  const navigateTo = useCallback(
    (component: JSX.Element) => {
      changeView(component);
    },
    [changeView],
  );

  if (isLoading) {
    return (
      <Card>
        <ViewLoading />
      </Card>
    );
  }

  return (
    <Card>
      <View className="flex flex-row justify-between w-full ">
        <View className="flex flex-col" style={{ gap: 4 }}>
          <Text
            className="text-primaryColor  text-lg smallPhone:text-base"
            style={{ fontFamily: 'OpenSans_700Bold' }}
          >
            {t('start.lastTraining')}
          </Text>
          <View className="flex flex-col px-1" style={{ gap: 2 }}>
            <View className="flex flex-row" style={{ gap: 4 }}>
              <Text
                className="text-textColor text-sm smallPhone:text-xs"
                style={{ fontFamily: 'OpenSans_300Light' }}
              >
                {t('start.date')}
              </Text>
              <Text
                className="text-textColor text-sm smallPhone:text-xs"
                style={{ fontFamily: 'OpenSans_300Light' }}
              >
                {lastTrainingInfoData?.createdAt
                  ? new Date(lastTrainingInfoData.createdAt).toLocaleString()
                  : 'N/A'}
              </Text>
            </View>
            <View className="flex flex-row" style={{ gap: 4 }}>
              <Text
                className="text-textColor text-sm smallPhone:text-xs"
                style={{ fontFamily: 'OpenSans_300Light' }}
              >
                {t('start.type')}
              </Text>
              {getRankColor && (
                <Text
                  className="text-sm smallPhone:text-xs"
                  style={{ fontFamily: 'OpenSans_400Regular', color: getRankColor }}
                >
                  {lastTrainingInfoData?.planDay?.name ?? 'N/A'}
                </Text>
              )}
            </View>
          </View>
        </View>

        <CustomButton
          buttonStyleSize={ButtonSize.long}
          onPress={() => navigateTo(<AddTraining />)}
          buttonStyleType={ButtonStyle.success}
          textWeight={FontWeights.bold}
          customClasses="self-center"
          text={t('start.newTraining')}
        />
      </View>
    </Card>
  );
};

export default LastTrainingStartInfo;

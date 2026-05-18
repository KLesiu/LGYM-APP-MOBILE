import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View, FlatList } from 'react-native';
import RecordsPopUp from './RecordsPopUp';
import ViewLoading from '../../elements/ViewLoading';
import SearchBox from '../../elements/SearchBox';

import CustomButton, { ButtonSize, ButtonStyle } from '../../elements/CustomButton';
import ConfirmDialog from '../../elements/ConfirmDialog';
import { useHomeContext } from '../HomeContext';
import BackgroundMainSection from '../../elements/BackgroundMainSection';
import RecordsItem from './RecordsItem';
import { FontWeights } from '../../../../enums/FontsProperties';
import {
  useGetApiMainRecordsIdGetLastMainRecords,
  getApiMainRecordsIdDeleteMainRecord,
  getGetApiMainRecordsIdGetLastMainRecordsQueryKey,
  getGetApiMainRecordsIdGetMainRecordsHistoryQueryKey,
} from '../../../../api/generated/main-records/main-records';
import { MainRecordsLastDto } from '../../../../api/generated/model';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

const Records: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [popUp, setPopUp] = useState<boolean>(false);
  const [exercise, setExercise] = useState<string | undefined>();
  const [searchText, setSearchText] = useState<string>('');
  const [choosenRecord, setChoosenRecord] = useState<MainRecordsLastDto | undefined>();
  const [isDeleteRecordConfirmationDialogVisible, setIsDeleteRecordConfirmationDialogVisible] =
    useState<boolean>(false);
  const { userId } = useHomeContext();

  const {
    data: recordsData,
    isLoading: isRecordsLoading,
    refetch: refetchRecords,
  } = useGetApiMainRecordsIdGetLastMainRecords(userId, {
    query: {
      enabled: !!userId,
      refetchOnMount: 'always',
    },
  });

  const refreshRecords = useCallback(async (): Promise<void> => {
    if (!userId) return;

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getGetApiMainRecordsIdGetLastMainRecordsQueryKey(userId),
      }),
      queryClient.invalidateQueries({
        queryKey: getGetApiMainRecordsIdGetMainRecordsHistoryQueryKey(userId),
      }),
    ]);

    await refetchRecords();
  }, [queryClient, refetchRecords, userId]);

  useEffect(() => {
    if (!userId) return;
    void refreshRecords();
  }, [refreshRecords, userId]);

  const filteredRecords = useMemo(() => {
    const records = recordsData?.data;
    if (!Array.isArray(records)) {
      return [];
    }

    const normalizedSearch = searchText.trim().toLowerCase();
    if (!normalizedSearch) {
      return records;
    }

    return records.filter((record) =>
      (record.exerciseDetails?.name || '').toLowerCase().includes(normalizedSearch),
    );
  }, [recordsData, searchText]);

  const changePopUpValue: VoidFunction = useCallback((): void => {
    setPopUp(false);
    void refreshRecords();
  }, [refreshRecords]);

  const showPopUp = useCallback(() => {
    setPopUp(true);
  }, []);

  const updateSettedExerciseRecord = useCallback(
    (exerciseId: string | undefined): void => {
      if (!exerciseId) return;
      setExercise(exerciseId);
      showPopUp();
    },
    [showPopUp],
  );

  const deleteRecord = async () => {
    if (!choosenRecord || !choosenRecord._id) return;
    try {
      await getApiMainRecordsIdDeleteMainRecord(choosenRecord._id);
      await refreshRecords();
    } finally {
      deleteDialogVisible(false);
    }
  };

  const deleteDialogVisible = useCallback((visible: boolean, record?: MainRecordsLastDto) => {
    if (visible) setChoosenRecord(record);
    else setChoosenRecord(undefined);
    setIsDeleteRecordConfirmationDialogVisible(visible);
  }, []);

  return (
    <BackgroundMainSection>
      <View className="flex flex-col h-full w-full" style={{ gap: 8 }}>
        {isRecordsLoading ? (
          <ViewLoading />
        ) : (
          <View className="flex flex-col p-4" style={{ gap: 16 }}>
            <View className="flex flex-row justify-between items-center">
              <Text
                className="text-textColor  text-base "
                style={{ fontFamily: 'OpenSans_700Bold' }}
              >
                {t('records.yourRecords')}
              </Text>
              <CustomButton
                text={t('records.addNewRecords')}
                onPress={() => {
                  setExercise(undefined);
                  showPopUp();
                }}
                buttonStyleType={ButtonStyle.success}
                textWeight={FontWeights.bold}
                buttonStyleSize={ButtonSize.long}
              />
            </View>
            <SearchBox value={searchText} onChangeText={setSearchText} />
            <FlatList
              className="w-full h-full"
              contentContainerStyle={{ padding: 8, flexGrow: 1 }}
              data={filteredRecords}
              keyExtractor={(record, index) => record._id || `${record.exerciseDetails?.name ?? 'record'}-${index}`}
              ListEmptyComponent={
                <View className="w-full py-6">
                  <Text className="text-sm text-fifthColor text-center" style={{ fontFamily: 'OpenSans_400Regular' }}>
                    {searchText.trim().length > 0
                      ? t('records.noSearchResults')
                      : t('records.noRecordsYet')}
                  </Text>
                </View>
              }
              renderItem={({ item: record }) => (
                <RecordsItem
                  record={record}
                  updateSettedExerciseRecord={updateSettedExerciseRecord}
                  deleteDialogVisible={deleteDialogVisible}
                />
              )}
            />
          </View>
        )}

        <ConfirmDialog
          visible={isDeleteRecordConfirmationDialogVisible}
          title={t('records.deleteConfirmTitle', {
            name: choosenRecord?.exerciseDetails?.name || '',
          })}
          message={t('records.deleteConfirmMessage')}
          onConfirm={deleteRecord}
          onCancel={() => deleteDialogVisible(false)}
        />
      </View>
      {popUp && <RecordsPopUp offPopUp={changePopUpValue} exerciseId={exercise} />}
    </BackgroundMainSection>
  );
};

export default Records;

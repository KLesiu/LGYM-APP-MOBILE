import React, { useMemo } from 'react';
import { Text, View, ScrollView } from 'react-native';
import ViewLoading from '../../elements/ViewLoading';
import CreatePlanConfig from './CreatePlanConfig';
import CreatePlanDay from './planDay/CreatePlanDay';
import { PlanDayBaseInfoVm, PlanForm } from './../../../../types/models';
import CustomButton, { ButtonSize, ButtonStyle } from '../../elements/CustomButton';
import PlanIcon from './../../../../img/icons/planIcon.svg';
import ShareIcon from './../../../../img/icons/shareIcon.svg';
import { FontWeights } from './../../../../enums/FontsProperties';
import ConfirmDialog from '../../elements/ConfirmDialog';
import BackgroundMainSection from '../../elements/BackgroundMainSection';
import TrainingPlanItem from './TrainingPlanItem';
import PlanDayProvider from './planDay/CreatePlanDayContext';
import { useHomeContext } from '../HomeContext';
import PlansList from './PlansList';
import DeleteIcon from './../../../../img/icons/deleteIcon.svg';
import PlanShareDialog from './PlanShareDialog';
import PlanCopyDialog from './PlanCopyDialog';
import { useGetApiIdGetPlanConfig } from '../../../../api/generated/plan/plan';
import { useGetApiPlanDayIdGetPlanDaysInfo } from '../../../../api/generated/plan-day/plan-day';
import { useTranslation } from 'react-i18next';
import { useTrainingPlanController } from './hooks/useTrainingPlanController';

const TrainingPlan: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useHomeContext();

  const { data: planConfigData, isLoading: isPlanConfigLoading } = useGetApiIdGetPlanConfig(userId, {
    query: { enabled: !!userId },
  });

  const planConfig = useMemo(() => (planConfigData?.data as PlanForm) || undefined, [planConfigData]);

  const {
    data: planDaysData,
    isLoading: isPlanDaysLoading,
    refetch: refetchPlanDays,
  } = useGetApiPlanDayIdGetPlanDaysInfo(planConfig?._id || '', { query: { enabled: !!planConfig?._id } });
  const refetchPlanDaysAsync = async () => {
    await refetchPlanDays();
  };

  const planDaysBaseInfo = useMemo(() => (planDaysData?.data as PlanDayBaseInfoVm[]) || [], [planDaysData]);

  const {
    isSwitchingPlan,
    isPlanDayFormVisible,
    isPlansListVisible,
    isPreviewPlanDay,
    showPlanConfig,
    currentPlanDay,
    isDeletePlanDayConfirmationDialogVisible,
    isShareCodeDialogShowed,
    isCopyPlanDialogShowed,
    isDeletePlanConfirmationDialogVisible,
    togglePlanConfigPopUp,
    showPlanDayForm,
    showPlansList,
    hidePlansList,
    showShareCodeDialog,
    hideShareCodeDialog,
    showCopyPlanDialog,
    hideCopyPlanDialog,
    hidePlanDayForm,
    reloadSection,
    copyPlan,
    setNewPlanConfig,
    deletePlanDayVisible,
    handleDeletePlanDayConfirm,
    deletePlan,
    handlePlanCreated,
    handlePlanDayCreated,
  } = useTrainingPlanController({
    planConfig,
    onRefetchPlanDays: refetchPlanDaysAsync,
    onRefetchAll: async () => undefined,
  });

  const isLoading = isPlanConfigLoading || isPlanDaysLoading || isSwitchingPlan;

  return (
    <BackgroundMainSection>
      <View className="w-full h-full flex flex-col">
        {isLoading ? (
          <ViewLoading />
        ) : !planConfig ? (
          <View className="flex flex-col w-full justify-center items-center h-full px-5" style={{ gap: 16 }}>
            <View className="w-full" style={{ gap: 4 }}>
              <Text className="text-base smallPhone:text-sm text-fifthColor" style={{ fontFamily: 'OpenSans_400Regular' }}>
                {t('plans.emptyPlanSubtitle')}
              </Text>
            </View>
            <CustomButton onPress={() => togglePlanConfigPopUp(true)} text={t('plans.createPlanCta')} buttonStyleType={ButtonStyle.success} width="w-full" />
            <CustomButton onPress={showCopyPlanDialog} text={t('plans.copyPlan')} buttonStyleType={ButtonStyle.default} width="w-full" />
          </View>
        ) : (
          <View className="flex flex-col h-full">
            {!isPlanDayFormVisible && (
              <View className="p-5" style={{ gap: 16 }}>
                <View>
                  <Text className="text-base smallPhone:text-sm text-primaryColor font-bold" style={{ fontFamily: 'OpenSans_700Bold' }}>
                    {t('plans.currentTrainingPlan')}
                  </Text>
                  <Text style={{ fontFamily: 'OpenSans_700Bold' }} className="text-3xl smallPhone:text-xl text-textColor font-bold">
                    {planConfig.name}
                  </Text>
                </View>
                <View className="flex flex-row" style={{ gap: 16 }}>
                  <CustomButton text={t('plans.addTrainingDay')} onPress={() => showPlanDayForm()} buttonStyleType={ButtonStyle.success} textWeight={FontWeights.bold} buttonStyleSize={ButtonSize.long} customClasses="flex-1" />
                  <View className="flex justify-center items-center w-12 smallPhone:w-10 h-12 smallPhone:h-10 bg-secondaryColor70 rounded-lg ">
                    <CustomButton onPress={showPlansList} buttonStyleSize={ButtonSize.small} customSlots={[<PlanIcon key="plan-icon" />]} />
                  </View>
                  <View className="flex justify-center items-center w-12 smallPhone:w-10 h-12 smallPhone:h-10 bg-secondaryColor70 rounded-lg ">
                    <CustomButton onPress={() => deletePlanDayVisible(true)} buttonStyleSize={ButtonSize.small} customSlots={[<DeleteIcon key="delete-icon" />]} />
                  </View>
                  <View className="flex justify-center items-center w-12 smallPhone:w-10 h-12 smallPhone:h-10 bg-secondaryColor70 rounded-lg ">
                    <CustomButton onPress={showShareCodeDialog} buttonStyleSize={ButtonSize.small} customSlots={[<ShareIcon key="share-icon" />]} />
                  </View>
                </View>
              </View>
            )}

            {planDaysBaseInfo ? (
              <ScrollView className="w-full" contentContainerStyle={{ paddingTop: isPlanDayFormVisible ? 20 : 0 }}>
                <View style={{ gap: 16 }} className="flex flex-col p-5 pb-12">
                  {planDaysBaseInfo.map((planDay) => (
                    <TrainingPlanItem key={planDay._id} item={planDay} showPlanDayForm={showPlanDayForm} deletePlanDayVisible={deletePlanDayVisible} />
                  ))}
                </View>
              </ScrollView>
            ) : (
              <ViewLoading />
            )}
          </View>
        )}
      </View>
      {showPlanConfig && <CreatePlanConfig reloadSection={reloadSection} hidePlanConfig={() => togglePlanConfigPopUp(false)} onSubmitSuccess={handlePlanCreated} />}
      {isPlanDayFormVisible && planConfig && (
        <PlanDayProvider closeForm={hidePlanDayForm}>
          <CreatePlanDay
            {...(typeof isPreviewPlanDay === 'boolean' ? { isPreview: isPreviewPlanDay } : {})}
            {...(planConfig._id ? { planId: planConfig._id } : {})}
            {...(currentPlanDay?._id ? { planDayId: currentPlanDay._id } : {})}
            onSaveSuccess={handlePlanDayCreated}
          />
        </PlanDayProvider>
      )}
      {isPlansListVisible && <PlansList togglePlanConfig={togglePlanConfigPopUp} showCopyPlanDialog={showCopyPlanDialog} goBack={hidePlansList} setNewPlanConfig={setNewPlanConfig} />}
      {isShareCodeDialogShowed && planConfig && <PlanShareDialog visible={isShareCodeDialogShowed} onCancel={hideShareCodeDialog} plan={planConfig} />}
      {isCopyPlanDialogShowed && <PlanCopyDialog visible={isCopyPlanDialogShowed} onCancel={hideCopyPlanDialog} copyPlan={copyPlan} />}
      <ConfirmDialog visible={isDeletePlanDayConfirmationDialogVisible} title={t('plans.deleteConfirmTitle', { name: currentPlanDay?.name || '' })} message={t('plans.deleteConfirmMessage')} onConfirm={handleDeletePlanDayConfirm} onCancel={() => deletePlanDayVisible(false)} />
      <ConfirmDialog visible={isDeletePlanConfirmationDialogVisible} title={t('plans.deleteConfirmTitle', { name: planConfig?.name || '' })} message={t('plans.deleteConfirmMessage')} onConfirm={deletePlan} onCancel={() => {}} />
    </BackgroundMainSection>
  );
};

export default TrainingPlan;

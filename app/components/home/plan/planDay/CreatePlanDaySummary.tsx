import { View, Text, ScrollView } from 'react-native';
import PlanNameIcon from './../../../../../img/icons/planIcon.svg';
import CustomButton, { ButtonStyle } from '../../../elements/CustomButton';
import ExerciseList from './exerciseList/ExerciseList';
import { usePlanDay } from './CreatePlanDayContext';
import { ExerciseForPlanDay } from '../../../../../types/models';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface CreatePlanDaySummaryProps {
  saveCurrentPlan: (planName: string, exercisesArg: ExerciseForPlanDay[]) => Promise<void>;
  isPreview?: boolean | undefined;
  isLoading: boolean;
}

const CreatePlanDaySummary: React.FC<CreatePlanDaySummaryProps> = (props) => {
  const { t } = useTranslation();
  const { exercisesList, goBack, planDayName, closeForm } = usePlanDay();

  const savePlan = async () => {
    await props.saveCurrentPlan(planDayName, exercisesList);
  };

  return (
    <View className="w-full flex-1">
      <View className="px-5 py-2" style={{ gap: 12 }}>
        <View>
          <Text
            className="text-xl smallPhone:text-base text-textColor"
            style={{ fontFamily: 'OpenSans_700Bold' }}
          >
            {t('plans.summary')}
          </Text>
          <Text className="text-sm text-fifthColor" style={{ fontFamily: 'OpenSans_400Regular' }}>
            {t('plans.summaryDescription')}
          </Text>
        </View>
        <View className="flex flex-row" style={{ gap: 8 }}>
          <PlanNameIcon />
          <Text
            className="text-xl smallPhone:text-base text-textColor"
            style={{ fontFamily: 'OpenSans_400Regular' }}
          >
            {planDayName}
          </Text>
        </View>
      </View>
      <ScrollView className="flex-1 w-full px-5">
        <ExerciseList exerciseList={exercisesList} />
      </ScrollView>

      <View className="w-full p-5 flex flex-row justify-between" style={{ gap: 20 }}>
        <CustomButton
          buttonStyleType={ButtonStyle.outlineBlack}
          onPress={props.isPreview ? closeForm : goBack}
          text={props.isPreview ? t('plans.close') : t('plans.back')}
          width="flex-1"
        />

        {!props.isPreview && (
          <CustomButton
            buttonStyleType={ButtonStyle.success}
            onPress={savePlan}
            text={t('common.save')}
            isLoading={props.isLoading}
            width="flex-1"
          />
        )}
      </View>
    </View>
  );
};

export default CreatePlanDaySummary;

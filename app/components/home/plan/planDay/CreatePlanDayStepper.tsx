import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface CreatePlanDayStepperProps {
  currentStep: number;
}

const stepLabels = [
  'plans.stepNameLabel',
  'plans.stepExercisesLabel',
  'plans.stepConfigLabel',
  'plans.stepSummaryLabel',
];

const CreatePlanDayStepper: React.FC<CreatePlanDayStepperProps> = ({ currentStep }) => {
  const { t } = useTranslation();
  const safeCurrentStep = Math.min(Math.max(currentStep, 0), stepLabels.length - 1);

  return (
    <View className="w-full px-5 pt-5 pb-2" style={{ gap: 16 }}>
      <View style={{ gap: 4 }}>
        <Text
          className="text-3xl smallPhone:text-xl text-textColor"
          style={{ fontFamily: 'OpenSans_700Bold' }}
        >
          {t('plans.newPlanDay')}
        </Text>
        <Text className="text-sm text-fifthColor" style={{ fontFamily: 'OpenSans_400Regular' }}>
          {t('plans.stepProgress', {
            current: safeCurrentStep + 1,
            total: stepLabels.length,
          })}
        </Text>
      </View>
      <View className="flex flex-row" style={{ gap: 8 }}>
        {stepLabels.map((label, index) => {
          const isCompleted = index < safeCurrentStep;
          const isCurrent = index === safeCurrentStep;

          return (
            <View key={label} className="flex-1" style={{ gap: 6 }}>
              <View
                className="h-2 rounded-full"
                style={{
                  backgroundColor: isCompleted || isCurrent ? '#20BC2D' : '#3A3A3A',
                  opacity: isCurrent ? 1 : 0.75,
                }}
              />
              <Text
                numberOfLines={2}
                className="text-xs text-center"
                style={{
                  fontFamily: isCurrent ? 'OpenSans_700Bold' : 'OpenSans_400Regular',
                  color: isCompleted || isCurrent ? 'white' : '#A1A1AA',
                }}
              >
                {t(label)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default CreatePlanDayStepper;

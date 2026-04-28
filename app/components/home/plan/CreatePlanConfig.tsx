import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import ViewLoading from '../../elements/ViewLoading';
import CustomButton, { ButtonStyle } from '../../elements/CustomButton';
import Dialog from '../../elements/Dialog';
import { useHomeContext } from '../HomeContext';
import React from 'react';
import { usePostApiIdCreatePlan } from '../../../../api/generated/plan/plan';
import { useTranslation } from 'react-i18next';
import toastService from '../../../services/toastService';
import { getErrorMessage, sanitize } from '../../../../lib/domain/errorHandler';

interface CreatePlanConfigProps {
  reloadSection: VoidFunction;
  hidePlanConfig: VoidFunction;
  onSubmitSuccess?: () => Promise<void> | void;
}

const CreatePlanConfig: React.FC<CreatePlanConfigProps> = (props) => {
  const { t } = useTranslation();
  const { userId } = useHomeContext();
  const [planName, setPlanName] = useState<string>('');

  const { mutate: createPlan, isPending } = usePostApiIdCreatePlan();

  const sendConfig = () => {
    if (!planName.trim()) {
      toastService.showValidationError(t('plans.planNameRequired'));
      return;
    }

    submitPlanConfig();
  };

  const submitPlanConfig = () => {
    createPlan(
      {
        id: userId,
        data: { name: planName.trim() },
      },
      {
        onSuccess: async () => {
          toastService.hide();
          await props.reloadSection();
          await props.onSubmitSuccess?.();
        },
        onError: (error) => {
          const sanitizedError = sanitize(error);
          if (__DEV__ && sanitizedError.devDetails) {
            console.warn('[CreatePlanConfig] failed to create plan', sanitizedError.devDetails);
          }
          const errorMessage = getErrorMessage(error, t('common.tryAgain'));
          toastService.showError(errorMessage, t('common.error'));
        },
      },
    );
  };

  return (
    <Dialog>
      <View className="w-full h-full">
        <View className="px-5 py-2">
          <Text
            className="text-3xl smallPhone:text-xl text-textColor"
            style={{ fontFamily: 'OpenSans_700Bold' }}
          >
            {t('plans.planConfig')}
          </Text>
        </View>
        <View className="px-5">
          <View style={{ gap: 4 }} className="flex flex-col">
            <View className="flex flex-row gap-1">
              <Text
                style={{ fontFamily: 'OpenSans_300Light' }}
                className="  text-textColor  text-base smallPhone:text-sm"
              >
                {t('plans.planName')}:
              </Text>
              <Text className="text-redColor">*</Text>
            </View>
            <TextInput
              style={{
                fontFamily: 'OpenSans_400Regular',
                backgroundColor: 'rgb(30, 30, 30)',
                borderRadius: 8,
              }}
              className=" w-full  px-2 py-4 text-textColor  "
              onChangeText={(text: string) => setPlanName(text)}
              value={planName}
            />
          </View>
        </View>
        <View className="p-5 flex flex-row justify-between" style={{ gap: 20 }}>
          <CustomButton
            text={t('common.cancel')}
            onPress={props.hidePlanConfig}
            buttonStyleType={ButtonStyle.cancel}
            width="flex-1"
          />
          <CustomButton
            text={t('plans.next')}
            isLoading={isPending}
            onPress={sendConfig}
            buttonStyleType={ButtonStyle.success}
            width="flex-1"
          />
        </View>
      </View>
      {isPending && <ViewLoading />}
    </Dialog>
  );
};

export default CreatePlanConfig;

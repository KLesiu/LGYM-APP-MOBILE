import React from 'react';
import { Image, Text, useWindowDimensions, View } from 'react-native';
import type { AppConfigInfoDto } from '../../../api/generated/model';
import CustomButton, { ButtonSize, ButtonStyle } from './CustomButton';
import { useTranslation } from 'react-i18next';
import logoLGYM from './../../../assets/logoLGYMNewX.png';
import { safeOpenUrl } from '../../../lib/safeOpenUrl';
import toastService from '../../services/toastService';

interface UpdateDialogProps {
  config: AppConfigInfoDto;
}

const UpdateDialog: React.FC<UpdateDialogProps> = ({ config }) => {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const logoSize = Math.max(120, Math.min(width * 0.55, height * 0.24, 220));

  const handleUpdatePress = () => {
    if (!config.updateUrl) {
      toastService.showError(t('updateDialog.openLinkError'));
      return;
    }
    safeOpenUrl(config.updateUrl).catch(() => toastService.showError(t('updateDialog.openLinkError')));
  };

  return (
    <View
      className="flex-1  items-center justify-center  bg-bgColor rounded-lg shadow-lg px-4 py-4"
      style={{ gap: 32 }}
    >
      <View className="items-center justify-center" style={{ width: logoSize, height: logoSize }}>
        <Image source={logoLGYM} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
      </View>
      <View className="flex flex-col items-center justify-center">
        <Text className="text-textColor text-xl" style={{ fontFamily: 'OpenSans_700Bold' }}>
          {t('updateDialog.title')}
        </Text>

        <Text
          className="text-textColor text-base text-center"
          style={{ fontFamily: 'OpenSans_300Light' }}
        >
          {t('updateDialog.description', {
            version: config.latestVersion || config.minRequiredVersion || '-',
          })}
        </Text>
      </View>

      {config.releaseNotes && (
        <View className="flex flex-col border border-white p-4 rounded-lg ">
          <Text
            className="text-textColor text-base text-center"
            style={{ fontFamily: 'OpenSans_400Regular' }}
          >
            {t('updateDialog.whatsNew')}
          </Text>
          <Text
            className="text-textColor text-sm text-center"
            style={{ fontFamily: 'OpenSans_300Light' }}
          >
            {config.releaseNotes}
          </Text>
        </View>
      )}
      <CustomButton
        onPress={handleUpdatePress}
        buttonStyleSize={ButtonSize.long}
        buttonStyleType={ButtonStyle.success}
        text={t('updateDialog.updateNow')}
      ></CustomButton>
    </View>
  );
};

export default UpdateDialog;

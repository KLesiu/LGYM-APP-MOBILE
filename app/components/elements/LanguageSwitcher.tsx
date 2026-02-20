import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ButtonStyle } from './CustomButton';
import CustomButton from './CustomButton';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
    } catch (error) {
      console.error('Failed to change language', error);
    }
  };

  return (
    <View style={{ gap: 4 }} className="flex flex-col w-full">
      <Text className="text-textColor text-sm smallPhone:text-xs"
            style={{ fontFamily: "OpenSans_300Light" }}>
        {t('profile.language')}
      </Text>
      <View className="flex flex-row" style={{ gap: 8 }}>
        <CustomButton
            onPress={() => changeLanguage('pl')}
            text="PL"
            buttonStyleType={i18n.language === 'pl' ? ButtonStyle.success : ButtonStyle.outlineBlack}
            width="w-16"
        />
        <CustomButton
            onPress={() => changeLanguage('en')}
            text="EN"
            buttonStyleType={i18n.language === 'en' ? ButtonStyle.success : ButtonStyle.outlineBlack}
            width="w-16"
        />
      </View>
    </View>
  );
};

export default LanguageSwitcher;

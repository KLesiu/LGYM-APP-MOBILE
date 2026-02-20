import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import pl from './locales/pl.json';

const RESOURCES = {
  en: { translation: en },
  pl: { translation: pl },
};

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const storedLanguage = await AsyncStorage.getItem('user-language');
      if (storedLanguage) {
        return callback(storedLanguage);
      }
      
      // Fallback to device locale
      const locales = Localization.getLocales();
      const deviceLanguage = locales[0]?.languageCode;
      
      return callback(deviceLanguage || 'en');
    } catch (error) {
      console.log('Error reading language', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem('user-language', language);
    } catch (error) {
      console.log('Error saving language', error);
    }
  },
};

i18n
  // @ts-ignore
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources: RESOURCES,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react handles escaping
    },
    compatibilityJSON: 'v3', // for android
  } as any);

export default i18n;

import i18n, { type InitOptions } from 'i18next';
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

      const locales = Localization.getLocales();
      const deviceLanguage = locales[0]?.languageCode;

      return callback(deviceLanguage || 'en');
    } catch (error) {
      console.warn(
        '[i18n] Error reading language',
        error instanceof Error ? error.message : String(error),
      );
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem('user-language', language);
    } catch (error) {
      console.warn(
        '[i18n] Error saving language',
        error instanceof Error ? error.message : String(error),
      );
    }
  },
};

const INIT_OPTIONS = {
  resources: RESOURCES,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
} as unknown as InitOptions;

if (!i18n.isInitialized) {
  void i18n
    .use(LANGUAGE_DETECTOR as never)
    .use(initReactI18next)
    .init(INIT_OPTIONS);
}

export default i18n;

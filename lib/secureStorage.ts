import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from './constants';

const SECURE_KEYS = [
  STORAGE_KEYS.token,
  STORAGE_KEYS.email,
  STORAGE_KEYS.id,
  STORAGE_KEYS.username,
  STORAGE_KEYS.roles,
] as const;

type SecureKey = (typeof SECURE_KEYS)[number];

const isStoredValue = (value: string | null | undefined): value is string =>
  typeof value === 'string' && value.length > 0;

const readAsyncStorageValue = async (key: SecureKey): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeSecureValue = async (
  key: SecureKey,
  value: string | null | undefined,
): Promise<void> => {
  if (!isStoredValue(value)) {
    await SecureStore.deleteItemAsync(key);
    return;
  }

  await SecureStore.setItemAsync(key, value);
};

export const secureStorageKeys = SECURE_KEYS;

export const secureStorage = {
  getItem: async (key: SecureKey): Promise<string | null> => {
    const secureValue = await SecureStore.getItemAsync(key);
    if (secureValue !== null) {
      return secureValue;
    }

    const migratedValue = await readAsyncStorageValue(key);
    if (migratedValue !== null) {
      await SecureStore.setItemAsync(key, migratedValue);
      await AsyncStorage.removeItem(key);
    }

    return migratedValue;
  },
  setItem: async (key: SecureKey, value: string): Promise<void> => {
    await writeSecureValue(key, value);
    await AsyncStorage.removeItem(key);
  },
  removeItem: async (key: SecureKey): Promise<void> => {
    await Promise.allSettled([SecureStore.deleteItemAsync(key), AsyncStorage.removeItem(key)]);
  },
  clear: async (): Promise<void> => {
    await Promise.allSettled(
      SECURE_KEYS.flatMap((key) => [
        SecureStore.deleteItemAsync(key),
        AsyncStorage.removeItem(key),
      ]),
    );
  },
  migrateFromAsyncStorage: async (): Promise<void> => {
    for (const key of SECURE_KEYS) {
      const secureValue = await SecureStore.getItemAsync(key);
      if (secureValue !== null) {
        continue;
      }

      const legacyValue = await AsyncStorage.getItem(key);
      if (legacyValue === null) {
        continue;
      }

      await SecureStore.setItemAsync(key, legacyValue);
      await AsyncStorage.removeItem(key);
    }
  },
  getSessionSnapshot: async (): Promise<Record<SecureKey, string | null>> => {
    const entries = await Promise.all(
      SECURE_KEYS.map(async (key) => [key, await SecureStore.getItemAsync(key)] as const),
    );

    return Object.fromEntries(entries) as Record<SecureKey, string | null>;
  },
};

export type SecureStorage = typeof secureStorage;

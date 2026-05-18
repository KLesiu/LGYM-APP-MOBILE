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

const readSecureValue = async (key: SecureKey): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
};

const deleteSecureValue = async (key: SecureKey): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    return;
  }
};

const setSecureValue = async (key: SecureKey, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    return;
  }
};

const writeSecureValue = async (
  key: SecureKey,
  value: string | null | undefined,
): Promise<void> => {
  if (!isStoredValue(value)) {
    await deleteSecureValue(key);
    return;
  }

  await setSecureValue(key, value);
};

export const secureStorageKeys = SECURE_KEYS;

export const secureStorage = {
  getItem: async (key: SecureKey): Promise<string | null> => {
    const secureValue = await readSecureValue(key);
    if (secureValue !== null) {
      return secureValue;
    }

    const migratedValue = await readAsyncStorageValue(key);
    if (migratedValue !== null) {
      await setSecureValue(key, migratedValue);
      await AsyncStorage.removeItem(key);
    }

    return migratedValue;
  },
  setItem: async (key: SecureKey, value: string): Promise<void> => {
    await writeSecureValue(key, value);
    await AsyncStorage.removeItem(key);
  },
  removeItem: async (key: SecureKey): Promise<void> => {
    await Promise.allSettled([deleteSecureValue(key), AsyncStorage.removeItem(key)]);
  },
  clear: async (): Promise<void> => {
    await Promise.allSettled(
      SECURE_KEYS.flatMap((key) => [
        deleteSecureValue(key),
        AsyncStorage.removeItem(key),
      ]),
    );
  },
  migrateFromAsyncStorage: async (): Promise<void> => {
    for (const key of SECURE_KEYS) {
      const secureValue = await readSecureValue(key);
      if (secureValue !== null) {
        continue;
      }

      const legacyValue = await AsyncStorage.getItem(key);
      if (legacyValue === null) {
        continue;
      }

      await setSecureValue(key, legacyValue);
      await AsyncStorage.removeItem(key);
    }
  },
  getSessionSnapshot: async (): Promise<Record<SecureKey, string | null>> => {
    const entries = await Promise.all(
      SECURE_KEYS.map(async (key) => [key, await readSecureValue(key)] as const),
    );

    return Object.fromEntries(entries) as Record<SecureKey, string | null>;
  },
};

export type SecureStorage = typeof secureStorage;

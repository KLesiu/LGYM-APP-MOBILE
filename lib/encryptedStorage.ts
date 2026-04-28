import AsyncStorage from '@react-native-async-storage/async-storage';
import * as CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from './constants';

const ENCRYPTION_KEY_STORAGE_KEY = STORAGE_KEYS.storageEncryptionKey;
const ENCRYPTED_VALUE_PREFIX = 'enc:';
let cachedEncryptionKey: string | null = null;

const getOrCreateEncryptionKey = async (): Promise<string> => {
  if (cachedEncryptionKey) {
    return cachedEncryptionKey;
  }

  const storedKey = await SecureStore.getItemAsync(ENCRYPTION_KEY_STORAGE_KEY);
  if (storedKey) {
    cachedEncryptionKey = storedKey;
    return storedKey;
  }

  const newKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  await SecureStore.setItemAsync(ENCRYPTION_KEY_STORAGE_KEY, newKey);
  cachedEncryptionKey = newKey;
  return newKey;
};

const encryptValue = (value: string, key: string): string => {
  return CryptoJS.AES.encrypt(value, key).toString();
};

const decryptValue = (value: string, key: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(value, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
};

const warnOnCorruptedCiphertext = (key: string) => {
  console.warn(`[encryptedStorage] failed to decrypt value for key "${key}"`);
};

export const resetEncryptedStorageKeyCache = () => {
  cachedEncryptionKey = null;
};

export const encryptedStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const encryptionKey = await getOrCreateEncryptionKey();
    const storedValue = await AsyncStorage.getItem(key);

    if (storedValue === null) {
      return null;
    }

    if (!storedValue.startsWith(ENCRYPTED_VALUE_PREFIX)) {
      await encryptedStorage.setItem(key, storedValue);
      return storedValue;
    }

    const decrypted = decryptValue(storedValue.slice(ENCRYPTED_VALUE_PREFIX.length), encryptionKey);
    if (!decrypted) {
      warnOnCorruptedCiphertext(key);
      return null;
    }

    return decrypted;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    const encryptionKey = await getOrCreateEncryptionKey();
    const encryptedValue = encryptValue(value, encryptionKey);

    await AsyncStorage.setItem(key, `${ENCRYPTED_VALUE_PREFIX}${encryptedValue}`);
  },
  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
};

export type EncryptedStorage = typeof encryptedStorage;

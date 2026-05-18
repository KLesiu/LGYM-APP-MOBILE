import AsyncStorage from '@react-native-async-storage/async-storage';
import * as CryptoJS from 'crypto-js';
import * as ExpoCrypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from './constants';

const ENCRYPTION_KEY_STORAGE_KEY = STORAGE_KEYS.storageEncryptionKey;
const ENCRYPTED_VALUE_PREFIX = 'enc:';
// Prefix keeps valid encrypted empty strings distinguishable from corrupted ciphertext.
const PLAINTEXT_VALUE_PREFIX = 'value:';
let cachedEncryptionKey: string | null = null;

const bytesToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const generateEncryptionKey = async (): Promise<string> => {
  const randomBytes = await ExpoCrypto.getRandomBytesAsync(32);
  return bytesToHex(randomBytes);
};

const readEncryptionKey = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(ENCRYPTION_KEY_STORAGE_KEY);
  } catch {
    return null;
  }
};

const persistEncryptionKey = async (key: string): Promise<boolean> => {
  try {
    await SecureStore.setItemAsync(ENCRYPTION_KEY_STORAGE_KEY, key);
    return true;
  } catch {
    return false;
  }
};

const getOrCreateEncryptionKey = async (): Promise<string> => {
  if (cachedEncryptionKey) {
    return cachedEncryptionKey;
  }

  const storedKey = await readEncryptionKey();
  if (storedKey) {
    cachedEncryptionKey = storedKey;
    return storedKey;
  }

  const newKey = await generateEncryptionKey();
  const persisted = await persistEncryptionKey(newKey);
  if (!persisted) {
    console.warn('[encryptedStorage] failed to persist encryption key');
  }
  cachedEncryptionKey = newKey;
  return newKey;
};

const encryptValue = (value: string, key: string): string => {
  return CryptoJS.AES.encrypt(`${PLAINTEXT_VALUE_PREFIX}${value}`, key).toString();
};

const decryptValue = (value: string, key: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(value, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (decrypted.startsWith(PLAINTEXT_VALUE_PREFIX)) {
      return decrypted.slice(PLAINTEXT_VALUE_PREFIX.length);
    }

    return decrypted.length > 0 ? decrypted : null;
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
    if (decrypted === null) {
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

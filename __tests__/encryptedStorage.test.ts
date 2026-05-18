import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { encryptedStorage, resetEncryptedStorageKeyCache } from '../lib/encryptedStorage';

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe('encryptedStorage', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    jest.clearAllMocks();
    resetEncryptedStorageKeyCache();
    storage.clear();
    mockedSecureStore.getItemAsync.mockReset();
    mockedSecureStore.setItemAsync.mockReset();
    mockedAsyncStorage.getItem.mockReset();
    mockedAsyncStorage.setItem.mockReset();
    mockedAsyncStorage.removeItem.mockReset();
    mockedAsyncStorage.getItem.mockImplementation(async (key) => storage.get(key) ?? null);
    mockedAsyncStorage.setItem.mockImplementation(async (key, value) => {
      storage.set(key, value);
      return undefined;
    });
    mockedAsyncStorage.removeItem.mockImplementation(async (key) => {
      storage.delete(key);
      return undefined;
    });
  });

  it('round-trips encrypted values', async () => {
    mockedSecureStore.getItemAsync.mockResolvedValue(null);
    mockedSecureStore.setItemAsync.mockResolvedValue(undefined);

    await encryptedStorage.setItem('planDay', JSON.stringify({ _id: 'day-1' }));

    expect(mockedAsyncStorage.setItem).toHaveBeenCalledTimes(1);
    const storedValue = storage.get('planDay');
    expect(storedValue).toEqual(expect.stringMatching(/^enc:/));

    const value = await encryptedStorage.getItem('planDay');

    expect(value).toBe(JSON.stringify({ _id: 'day-1' }));
  });

  it('round-trips encrypted empty strings', async () => {
    mockedSecureStore.getItemAsync.mockResolvedValue(null);
    mockedSecureStore.setItemAsync.mockResolvedValue(undefined);

    await encryptedStorage.setItem('notes', '');

    await expect(encryptedStorage.getItem('notes')).resolves.toBe('');
  });

  it('migrates legacy plaintext values on read', async () => {
    mockedSecureStore.getItemAsync.mockResolvedValue(null);
    mockedSecureStore.setItemAsync.mockResolvedValue(undefined);
    storage.set('planDay', JSON.stringify({ _id: 'day-legacy' }));

    const value = await encryptedStorage.getItem('planDay');

    expect(value).toBe(JSON.stringify({ _id: 'day-legacy' }));
    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      'planDay',
      expect.stringMatching(/^enc:/),
    );
  });

  it('returns null for corrupted ciphertext and warns', async () => {
    mockedSecureStore.getItemAsync.mockResolvedValue('0123456789abcdef0123456789abcdef');
    mockedAsyncStorage.getItem.mockResolvedValueOnce('enc:corrupted-value');
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    await expect(encryptedStorage.getItem('gym')).resolves.toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('failed to decrypt value for key "gym"'),
    );

    warnSpy.mockRestore();
  });
});

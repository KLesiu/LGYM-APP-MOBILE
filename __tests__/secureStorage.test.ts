import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { secureStorage, secureStorageKeys } from '../lib/secureStorage';

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe('secureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stores values in SecureStore and clears legacy AsyncStorage', async () => {
    mockedSecureStore.setItemAsync.mockResolvedValue(undefined);
    mockedAsyncStorage.removeItem.mockResolvedValue(undefined);

    await secureStorage.setItem('token', 'abc123');

    expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith('token', 'abc123');
    expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('reads from SecureStore first', async () => {
    mockedSecureStore.getItemAsync.mockResolvedValue('stored-token');

    await expect(secureStorage.getItem('token')).resolves.toBe('stored-token');
    expect(mockedAsyncStorage.getItem).not.toHaveBeenCalled();
  });

  it('migrates legacy AsyncStorage values once', async () => {
    mockedSecureStore.getItemAsync.mockResolvedValueOnce(null);
    mockedAsyncStorage.getItem.mockResolvedValueOnce('legacy-token');
    mockedSecureStore.setItemAsync.mockResolvedValue(undefined);
    mockedAsyncStorage.removeItem.mockResolvedValue(undefined);

    await expect(secureStorage.getItem('token')).resolves.toBe('legacy-token');
    expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith('token', 'legacy-token');
    expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('clears every migrated key from both stores', async () => {
    mockedSecureStore.deleteItemAsync.mockResolvedValue(undefined);
    mockedAsyncStorage.removeItem.mockResolvedValue(undefined);

    await secureStorage.clear();

    expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledTimes(secureStorageKeys.length);
    expect(mockedAsyncStorage.removeItem).toHaveBeenCalledTimes(secureStorageKeys.length);
  });

  it('migrates all legacy keys idempotently', async () => {
    mockedSecureStore.getItemAsync.mockResolvedValue(null);
    mockedAsyncStorage.getItem.mockImplementation(async (key) => {
      if (key === 'token') return 't';
      if (key === 'email') return 'e';
      if (key === 'id') return 'i';
      if (key === 'username') return 'u';
      if (key === 'roles') return '["admin"]';
      return null;
    });
    mockedSecureStore.setItemAsync.mockResolvedValue(undefined);
    mockedAsyncStorage.removeItem.mockResolvedValue(undefined);

    await secureStorage.migrateFromAsyncStorage();

    expect(mockedSecureStore.setItemAsync).toHaveBeenCalledTimes(secureStorageKeys.length);
    expect(mockedAsyncStorage.removeItem).toHaveBeenCalledTimes(secureStorageKeys.length);
  });
});

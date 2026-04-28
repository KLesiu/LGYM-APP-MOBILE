import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../stores/useAuthStore';
import { secureStorage } from '../lib/secureStorage';

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe('useAuthStore', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    jest.clearAllMocks();
    storage.clear();
    mockedSecureStore.getItemAsync.mockReset();
    mockedSecureStore.setItemAsync.mockReset();
    mockedSecureStore.deleteItemAsync.mockReset();
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

    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,
    });
  });

  it('hydrates a stored session into Zustand state', async () => {
    mockedSecureStore.getItemAsync.mockImplementation(async (key) => {
      if (key === 'token') return 'stored-token';
      if (key === 'username') return 'alex';
      if (key === 'id') return 'user-1';
      if (key === 'email') return 'alex@example.com';
      if (key === 'roles') return '["member"]';
      return null;
    });

    await useAuthStore.getState().hydrate();

    const state = useAuthStore.getState();

    expect(state.isHydrated).toBe(true);
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('stored-token');
    expect(state.user?.name).toBe('alex');
    expect(state.user?.email).toBe('alex@example.com');
  });

  it('clears token and user on logout', async () => {
    mockedSecureStore.setItemAsync.mockResolvedValue(undefined);
    mockedSecureStore.deleteItemAsync.mockResolvedValue(undefined);

    await useAuthStore.getState().setSession('token-1', {
      _id: 'user-1',
      name: 'alex',
      email: 'alex@example.com',
      roles: [],
    } as never);

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();

    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalled();
  });
});

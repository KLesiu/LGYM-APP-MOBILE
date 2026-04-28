import type AsyncStorage from '@react-native-async-storage/async-storage';

const waitForInitialization = async (i18n: {
  isInitialized: boolean;
  on: (event: string, callback: () => void) => void;
  off: (event: string, callback: () => void) => void;
}) => {
  if (i18n.isInitialized) {
    return;
  }

  await new Promise<void>((resolve) => {
    const handleInitialized = () => {
      i18n.off('initialized', handleInitialized);
      resolve();
    };

    i18n.on('initialized', handleInitialized);
  });
};

const loadI18n = (): typeof import('../lib/i18n').default => {
  let i18nModule: typeof import('../lib/i18n').default | undefined;

  jest.isolateModules(() => {
    i18nModule = require('../lib/i18n').default;
  });

  if (!i18nModule) {
    throw new Error('Failed to load i18n module');
  }

  return i18nModule;
};

const getAsyncStorageMock = (): jest.Mocked<typeof AsyncStorage> => {
  const asyncStorageModule = require('@react-native-async-storage/async-storage') as {
    default?: typeof AsyncStorage;
  } & Partial<typeof AsyncStorage>;

  return (asyncStorageModule.default ?? asyncStorageModule) as jest.Mocked<typeof AsyncStorage>;
};

describe('lib/i18n', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('prefers the stored language over the device locale', async () => {
    const mockedAsyncStorage = getAsyncStorageMock();

    mockedAsyncStorage.getItem.mockResolvedValue('pl');

    jest.doMock('expo-localization', () => ({
      getLocales: () => [{ languageCode: 'en' }],
    }));

    const i18n = loadI18n();

    await waitForInitialization(i18n);

    expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith('user-language');
    expect(i18n.language).toBe('pl');
  });

  it('falls back to the device locale and persists later language changes', async () => {
    const mockedAsyncStorage = getAsyncStorageMock();

    mockedAsyncStorage.getItem.mockResolvedValue(null);
    mockedAsyncStorage.setItem.mockResolvedValue(undefined);

    jest.doMock('expo-localization', () => ({
      getLocales: () => [{ languageCode: 'pl' }],
    }));

    const i18n = loadI18n();

    await waitForInitialization(i18n);

    expect(i18n.language).toBe('pl');

    await i18n.changeLanguage('en');

    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith('user-language', 'en');
    expect(i18n.language).toBe('en');
  });
});

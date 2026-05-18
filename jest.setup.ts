jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-crypto', () => ({
  getRandomBytes: jest.fn(() => new Uint8Array(Array.from({ length: 32 }, (_, index) => index + 1))),
  getRandomBytesAsync: jest.fn(async () =>
    new Uint8Array(Array.from({ length: 32 }, (_, index) => index + 1))
  ),
}));

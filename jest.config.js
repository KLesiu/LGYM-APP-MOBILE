module.exports = {
  preset: "react-native",
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  moduleNameMapper: {
    "^expo-secure-store$": "<rootDir>/__mocks__/expo-secure-store.ts",
    "^@react-native-async-storage/async-storage$": "<rootDir>/__mocks__/async-storage.ts",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|nativewind|react-native-svg|react-native-reanimated|react-native-gesture-handler|@shopify/react-native-skia)/",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

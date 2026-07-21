const path = require('path');

const resolveFirebaseFile = (envVarName, fallbackRelativePath) => {
  const configuredPath = process.env[envVarName];

  if (configuredPath) {
    return configuredPath;
  }

  return path.join(__dirname, fallbackRelativePath);
};

module.exports = {
  expo: {
    name: 'Training Hub',
    description: 'Neutralny wariant demonstracyjny systemu ewidencji treningowej.',
    slug: 'training-hub-thesis',
    scheme: ['traininghub', 'lgymappmobile', 'com.lesiuuu.lgymappmobile'],
    version: '5.0.1',
    orientation: 'portrait',
    newArchEnabled: true,
    splash: {
      resizeMode: 'contain',
      backgroundColor: '#07111F',
    },
    assetBundlePatterns: ['**/*'],
    android: {
      versionCode: 32,
      package: 'com.lesiuuu.lgymappmobile',
      googleServicesFile: resolveFirebaseFile('GOOGLE_SERVICES_JSON', 'google-services.json'),
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.lesiuuu.lgymappmobile',
      googleServicesFile: resolveFirebaseFile('GOOGLE_SERVICE_INFO_PLIST', 'GoogleService-Info.plist'),
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        UIStatusBarStyle: 'UIStatusBarStyleLightContent',
        UIBackgroundModes: ['remote-notification'],
      },
    },
    extra: {
      eas: {
        projectId: '505ff65d-afab-4678-926a-dbeabae8ef7d',
      },
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: 'https://u.expo.dev/505ff65d-afab-4678-926a-dbeabae8ef7d',
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-image-picker',
      'expo-web-browser',
      'expo-localization',
      '@react-native-firebase/app',
      '@react-native-firebase/messaging',
      [
        'expo-build-properties',
        {
          android: {
            usesCleartextTraffic: true,
          },
          ios: {
            useFrameworks: 'static',
            forceStaticLinking: ['RNFBApp', 'RNFBMessaging'],
          },
        },
      ],
    ],
  },
};

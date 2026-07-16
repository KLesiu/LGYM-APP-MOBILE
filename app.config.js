const path = require('path');
const { version } = require('./package.json');

const resolveFirebaseFile = (envVarName, fallbackRelativePath) => {
  const configuredPath = process.env[envVarName];

  if (configuredPath) {
    return configuredPath;
  }

  return path.join(__dirname, fallbackRelativePath);
};

module.exports = {
  expo: {
    name: 'LGYM-APP',
    slug: 'lgym-app-mobile',
    scheme: ['lgymappmobile', 'com.lesiuuu.lgymappmobile'],
    version,
    orientation: 'portrait',
    icon: './assets/logoLGYMNewX.png',
    newArchEnabled: true,
    splash: {
      resizeMode: 'contain',
      backgroundColor: '#0A0A0A',
      image: './assets/logoLGYMNewX.png',
    },
    assetBundlePatterns: ['**/*'],
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/logoLGYMNewX.png',
        backgroundColor: '#0A0A0A',
      },
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
    web: {
      favicon: './assets/favicon.png',
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
          },
        },
      ],
    ],
  },
};

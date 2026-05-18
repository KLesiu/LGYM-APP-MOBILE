const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

defaultConfig.resolver = {
  ...defaultConfig.resolver,
  assetExts: assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...new Set([...sourceExts, 'svg'])],
};

defaultConfig.transformer = {
  ...defaultConfig.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};

module.exports = defaultConfig;

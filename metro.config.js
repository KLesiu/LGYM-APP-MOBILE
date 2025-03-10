const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx');

defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
    (ext) => ext !== "svg"
  );
  defaultConfig.resolver.sourceExts.push("svg");
  
  defaultConfig.transformer = {
    ...defaultConfig.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };

module.exports = defaultConfig;
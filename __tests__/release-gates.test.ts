const appConfig = require('../app.config.js');
const packageJson = require('../package.json');

describe('mobile release gates', () => {
  it('keeps the Expo public version aligned with package.json', () => {
    expect(appConfig.expo.version).toBe(packageJson.version);
  });

  it('keeps Android and iOS production identifiers aligned', () => {
    expect(appConfig.expo.android.package).toBe('com.lesiuuu.lgymappmobile');
    expect(appConfig.expo.ios.bundleIdentifier).toBe('com.lesiuuu.lgymappmobile');
  });
});

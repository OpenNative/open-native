// https://github.com/nativescript-community/expo-nativescript/blob/6524b9ff787c635cddf8a19799b2fcadc287e986/packages/expo-nativescript-adapter/Platform.ts
import { isIOS, isAndroid, platformNames } from '@nativescript/core';

export type PlatformSelectOSType = keyof typeof platformNames | 'native' | 'electron' | 'default';

export type PlatformSelect = <T>(specifics: { [platform in PlatformSelectOSType]?: T }) => T;

const Platform = {
  /**
   * Denotes the currently running platform.
   * Can be one of ios, android, web.
   */
  OS: isIOS ? 'iOS' : isAndroid ? 'Android' : '<unknown platform>',
  /**
   * Returns the value with the matching platform.
   * Object keys can be any of ios, android, native, web, default.
   *
   * @ios ios, native, default
   * @android android, native, default
   * @web web, default
   */
  select: <T>(specifics: { [platform in PlatformSelectOSType]?: T }): T => {
    return 'ios' in specifics ? specifics.ios : 'native' in specifics ? specifics.native : specifics.default;
  },
  /**
   * Denotes if the DOM API is available in the current environment.
   * The DOM is not available in native React runtimes and Node.js.
   */
  isDOMAvailable: false,
};

export default Platform;

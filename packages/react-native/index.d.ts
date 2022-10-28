import { JSModules } from './src/ios/js-modules';
import { JSModules as JSModulesAndroid } from './src/android/js-modules';
import type DeviceEventEmitter from './device-event-emitter.ios';
import type Platform from './core/Utilities/Platform';
import type { Linking } from './core/Libraries/Linking/Linking';

declare global {
  // eslint-disable-next-line no-var
  var reactNativeBridgeIOS: RCTBridge;
  // eslint-disable-next-line no-var
  var reactNativeBridgeAndroid: com.bridge.Bridge;
  // eslint-disable-next-line no-var
  var jsModulesIOS: JSModules;
  // eslint-disable-next-line no-var
  var jsModulesAndroid: JSModulesAndroid;
}

export const NativeModules: { [name: string]: any };
export const DeviceEventEmitter: DeviceEventEmitter;
export const Platform: Platform;
export const Linking: Linking;

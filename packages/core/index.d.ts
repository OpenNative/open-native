import { JSModules } from './src/ios/js-modules';
import { JSModules as JSModulesAndroid } from './src/android/js-modules';
import type EventEmitter from './Libraries/vendor/emitter/EventEmitter';
export type {
  Platform,
  PlatformSelect,
  PlatformSelectOSType,
} from './Libraries/Utilities/Platform';
import type { Linking } from './Libraries/Linking/Linking';
import EventEmitter from './Libraries/vendor/emitter/EventEmitter';
export { AppRegistry } from './Libraries/ReactNative/AppRegistry';
declare global {
  // eslint-disable-next-line no-var
  var reactNativeBridgeIOS: RCTBridge;
  // eslint-disable-next-line no-var
  var reactNativeBridgeAndroid: com.bridge.Bridge;
  // eslint-disable-next-line no-var
  var jsModulesIOS: JSModules;
  // eslint-disable-next-line no-var
  var jsModulesAndroid: JSModulesAndroid;
  // eslint-disable-next-line no-var
  var __turboModulesProxy: any;
}
/**
 * Loads all modules eagerly in a specific ReactPackage.
 *
 * @platform android
 */
export function loadModulesForPackage(name: string): void;
export const NativeModules: { [name: string]: any };
export const DeviceEventEmitter: EventEmitter;
export const Linking: Linking;
export class TurboModule {}
export function init(): void;
export const TurboModuleRegistry: {
  get<T extends TurboModule>(name: string): T | null;
  getEnforcing<T extends TurboModule>(name: string): T;
};

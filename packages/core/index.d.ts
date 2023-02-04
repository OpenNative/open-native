import { JSModules } from './src/ios/js-modules';
import { JSModules as JSModulesAndroid } from './src/android/js-modules';
import type EventEmitter from './Libraries/vendor/emitter/EventEmitter';
export type {
  Platform,
  PlatformSelect,
  PlatformSelectOSType,
} from './Libraries/Utilities/Platform';
export { Linking } from './Libraries/Linking/Linking';
import EventEmitter from './Libraries/vendor/emitter/EventEmitter';
export { AppRegistry } from './Libraries/ReactNative/AppRegistry';
export { Alert } from './Libraries/Alert/Alert';

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
export const ViewManagers: { [name: string]: any};
export const DeviceEventEmitter: EventEmitter;
export class TurboModule {}
export function init(): void;
export const TurboModuleRegistry: {
  get<T extends TurboModule>(name: string): T | null;
  getEnforcing<T extends TurboModule>(name: string): T;
};
export const Image: {
  /**
   * A polyfill function that will return an object with
   * the `uri` parameter. On iOS you must only pass it the file name,
   * for example `my-image.png` and it will return the path to the file from main app bundle.
   *
   * On android, you have to pass the full path to the asset,
   * for example `file:///android_asset/folder/file.ext`.
   * @param assetPath
   * @returns
   */
  resolveAssetSource: (assetPath: string) => {
    uri: string;
  };
};

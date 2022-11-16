import RCTDeviceEventEmitter from './Libraries/EventEmitter/RCTDeviceEventEmitter';
import * as _TurboModuleRegistry from './Libraries/TurboModule/TurboModuleRegistry';
import { load } from './src/android/nativemodules';
export { default as NativeEventEmitter } from './Libraries/EventEmitter/NativeEventEmitter';
export { Linking } from './Libraries/Linking/Linking';
export { AppRegistry } from './Libraries/ReactNative/AppRegistry';
export type { TurboModule } from './Libraries/TurboModule/RCTExport';
export { Platform } from './Libraries/Utilities/Platform';
export { NativeModules } from './src/ios/nativemodules';
export const DeviceEventEmitter = RCTDeviceEventEmitter;

/**
 * Loads all modules eagerly in a specific ReactPackage.
 *
 * @platform android
 */
export const loadModulesForPackage = (name: string) => undefined;
export const TurboModuleRegistry = _TurboModuleRegistry;
export function init() {
  load();
}

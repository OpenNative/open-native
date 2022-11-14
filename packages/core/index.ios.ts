import RCTDeviceEventEmitter from './Libraries/EventEmitter/RCTDeviceEventEmitter';
export type { TurboModule } from './Libraries/TurboModule/RCTExport';
export { default as NativeEventEmitter } from './Libraries/EventEmitter/NativeEventEmitter';
export { Platform } from './Libraries/Utilities/Platform';
export { NativeModules } from './src/ios/nativemodules';
export { AppRegistry } from './Libraries/ReactNative/AppRegistry';
import * as _TurboModuleRegistry from './Libraries/TurboModule/TurboModuleRegistry';
export { Linking } from './Libraries/Linking/Linking';
export const DeviceEventEmitter = RCTDeviceEventEmitter;

/**
 * Loads all modules eagerly in a specific ReactPackage.
 *
 * @platform android
 */
export const loadModulesForPackage = (name: string) => undefined;
export const TurboModuleRegistry = _TurboModuleRegistry;

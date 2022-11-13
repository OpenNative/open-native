import RCTDeviceEventEmitter from './Libraries/EventEmitter/RCTDeviceEventEmitter';
import { getCurrentBridge } from './src/android/bridge';
export { default as NativeEventEmitter } from './Libraries/EventEmitter/NativeEventEmitter';
export { Platform } from './Libraries/Utilities/Platform';
export {
  NativeModules,
  TurboModuleRegistry,
} from './src/android/nativemodules';
export { Linking } from './Libraries/Linking/Linking';
export const DeviceEventEmitter = RCTDeviceEventEmitter;
/**
 * Loads all modules eagerly in a specific ReactPackage.
 *
 * @platform android
 */
export const loadModulesForPackage = (name: string) => {
  getCurrentBridge()?.loadModulesForPackage(name);
};

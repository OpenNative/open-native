import RCTDeviceEventEmitter from './Libraries/EventEmitter/RCTDeviceEventEmitter';
import { getCurrentBridge } from './src/android/bridge';
export { default as NativeEventEmitter } from './Libraries/EventEmitter/NativeEventEmitter';
export { Platform } from './Libraries/Utilities/Platform';
import * as _TurboModuleRegistry from './Libraries/TurboModule/TurboModuleRegistry';
export type { TurboModule } from './Libraries/TurboModule/RCTExport';
import { load as loadNativeModules } from './src/android/nativemodules';
export { NativeModules } from './src/android/nativemodules';
export { AppRegistry } from './Libraries/ReactNative/AppRegistry';
export { Linking } from './Libraries/Linking/Linking';
export const DeviceEventEmitter = RCTDeviceEventEmitter;
export { Dimensions } from './Libraries/Utilities/Dimensions';
export { Alert } from './Libraries/Alert/Alert';
export {
  ViewManagersAndroid,
  requireNativeViewAndroid,
} from './src/android/viewmanagers';

import {
  load as loadViewManagers,
  requireNativeViewAndroid,
} from './src/android/viewmanagers';
export function requireNativeComponent(viewName: string) {
  return requireNativeViewAndroid(viewName as never);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const requireNativeViewIOS = () => {};

/**
 * Loads all modules eagerly in a specific ReactPackage.
 *
 * @platform android
 */
export const loadModulesForPackage = (name: string) => {
  getCurrentBridge()?.loadModulesForPackage(name);
};
export const TurboModuleRegistry = _TurboModuleRegistry;
export function init() {
  loadNativeModules();
  loadViewManagers();
}

export const Image = {
  resolveAssetSource: (assetPath: string) => {
    return { uri: assetPath };
  },
};

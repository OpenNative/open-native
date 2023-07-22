import RCTDeviceEventEmitter from './Libraries/EventEmitter/RCTDeviceEventEmitter';
import * as _TurboModuleRegistry from './Libraries/TurboModule/TurboModuleRegistry';
import { load } from './src/ios/nativemodules';
export { default as NativeEventEmitter } from './Libraries/EventEmitter/NativeEventEmitter';
export { Linking } from './Libraries/Linking/Linking';
export { AppRegistry } from './Libraries/ReactNative/AppRegistry';
export type { TurboModule } from './Libraries/TurboModule/RCTExport';
export { Platform } from './Libraries/Utilities/Platform';
export { NativeModules } from './src/ios/nativemodules';
export const DeviceEventEmitter = RCTDeviceEventEmitter;
export { Dimensions } from './Libraries/Utilities/Dimensions';
export { Alert } from './Libraries/Alert/Alert';
export { ViewManagersIOS, requireNativeViewIOS } from './src/ios/viewmanagers';
import {
  load as loadViewManagers,
  requireNativeViewIOS,
} from './src/ios/viewmanagers';

export function requireNativeComponent(viewName: string) {
  return requireNativeViewIOS(viewName as never);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const requireNativeViewAndroid = () => {};

/**
 * Loads all modules eagerly in a specific ReactPackage.
 *
 * @platform android
 */
export const loadModulesForPackage = (name: string) => undefined;
export const TurboModuleRegistry = _TurboModuleRegistry;
export function init() {
  load();
  loadViewManagers();
}

export const Image = {
  resolveAssetSource: (assetName: string) => {
    const chunks = assetName.split('.');
    return {
      uri: NSBundle.mainBundle.URLForResourceWithExtension(
        chunks.slice(0, chunks.length - 1).join(),
        chunks[chunks.length - 1]
      ).absoluteString,
    };
  },
};

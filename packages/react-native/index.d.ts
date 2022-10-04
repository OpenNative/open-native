/* eslint-disable no-var */
import JSModulesIOS from './js-modules.ios';
import type DeviceEventEmitter from './device-event-emitter.ios';
import type Platform from './core/Utilities/Platform';

declare global {
  var reactNativeBridgeIOS: RCTBridge;
  var jsModulesIOS: JSModulesIOS;
}

export const NativeModules: { [name: string]: any };
export const DeviceEventEmitter: DeviceEventEmitter;
export const Platform: Platform;

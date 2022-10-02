/* eslint-disable no-var */
import { ReactNativeCommon } from './common';
import JSModulesIOS from './js-modules.ios';
import DeviceEventEmitter from './device-event-emitter.ios';

declare global {
  var reactNativeBridgeIOS: RCTBridge;
  var jsModulesIOS: JSModulesIOS;
}

export const NativeModules: { [name: string]: any };
export const DeviceEventEmitter: DeviceEventEmitter;

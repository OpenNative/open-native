import DeviceEventEmitter from '../../Libraries/EventEmitter/RCTDeviceEventEmitter';
import { JSModules, JSMethodRecord } from './js-modules';

export function getJSModules() {
  if (!global.jsModulesIOS) {
    global.jsModulesIOS = new JSModules(global.reactNativeBridgeIOS);
  }
  return global.jsModulesIOS;
}

/**
 * Loading the bridge as a global object as we won't be accessing
 * it in a specific class but in various places throughout our
 * implmentation.
 */
export function getCurrentBridge() {
  if (!global.reactNativeBridgeIOS) {
    let currentBridge = RCTBridge.currentBridge();
    if (!currentBridge) {
      currentBridge = RCTBridge.alloc().init();
      global.reactNativeBridgeIOS = currentBridge;
      getJSModules().registerJSModule(
        'RCTDeviceEventEmitter',
        DeviceEventEmitter as JSMethodRecord
      );
    }
  }
  return global.reactNativeBridgeIOS;
}

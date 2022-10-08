import DeviceEventEmitter from './core/EventEmitter/RCTDeviceEventEmitter';
import JSModules from './js-modules.ios';

export function getJSModules() {
  if (!global.jsModulesIOS) {
    global.jsModulesIOS = new JSModules();
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
      getJSModules().registerJSModule(
        'RCTDeviceEventEmitter',
        DeviceEventEmitter
      );
    }
    global.reactNativeBridgeIOS = currentBridge;
  }
  return global.reactNativeBridgeIOS;
}

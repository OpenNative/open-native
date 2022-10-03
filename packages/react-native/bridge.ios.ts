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
  if (global.reactNativeBridgeIOS) return global.reactNativeBridgeIOS;
  if (RCTBridge.currentBridge()) {
    global.reactNativeBridgeIOS = RCTBridge.currentBridge();
  } else {
    global.reactNativeBridgeIOS = RCTBridge.alloc().init();
    getJSModules().registerJSModule('RCTDeviceEventEmitter', DeviceEventEmitter);
  }
  return global.reactNativeBridgeIOS;
}

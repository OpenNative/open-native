import { Utils } from '@nativescript/core';
import DeviceEventEmitter from '../../core/EventEmitter/RCTDeviceEventEmitter';
import CatalystInstance from './catalyst-instance';
import { JSModules } from './js-modules';

export function getJSModules() {
  if (!global.jsModulesAndroid) {
    global.jsModulesAndroid = new JSModules();
  }
  return global.jsModulesAndroid;
}

function RCTDeviceEventEmitter() {
  return new com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter(
    {
      emit(eventType, params) {
        DeviceEventEmitter.emit(eventType, params);
      },
    }
  );
}

/**
 * Loading the bridge as a global object as we won't be accessing
 * it in a specific class but in various places throughout our
 * implmentation.
 */
export function getCurrentBridge() {
  if (!global.reactNativeBridgeAndroid) {
    const reactApplicationContext =
      new com.facebook.react.bridge.ReactApplicationContext(
        Utils.android.getApplicationContext()
      );
    global.reactNativeBridgeAndroid = new com.bridge.Bridge(
      reactApplicationContext
    );
    reactApplicationContext.initializeWithInstance(
      new CatalystInstance(
        reactApplicationContext,
        getJSModules(),
        global.reactNativeBridgeAndroid
      )
    );

    getJSModules().registerJSModule(
      'RCTDeviceEventEmitter',
      RCTDeviceEventEmitter()
    );
  }
  return global.reactNativeBridgeAndroid;
}

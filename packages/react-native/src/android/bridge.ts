import { Application, Utils } from '@nativescript/core';
import DeviceEventEmitter from '../../core/EventEmitter/RCTDeviceEventEmitter';
import CatalystInstance from './catalyst-instance';
import { JSModules } from './js-modules';
import { ReactContext } from './types';

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
    const catalysInstance = new CatalystInstance(
      reactApplicationContext,
      getJSModules(),
      global.reactNativeBridgeAndroid
    );
    reactApplicationContext.initializeWithInstance(catalysInstance.instance);
    getJSModules().registerJSModule(
      'RCTDeviceEventEmitter',
      RCTDeviceEventEmitter()
    );
    attachActivityLifecycleListeners(reactApplicationContext);
  }
  return global.reactNativeBridgeAndroid;
}

function attachActivityLifecycleListeners(reactContext: ReactContext) {
  reactContext.setCurrentActivity(
    Application.android.foregroundActivity || Application.android.startActivity
  );
  console.log(reactContext.getCurrentActivity());
  Application.android.on('activityNewIntent', (args) => {
    console.log('intent event');
    reactContext.onNewIntent(args.activity, args.intent);
  });
  Application.android.on('activityCreated', ({ activity }) => {
    console.log('activity created');
    reactContext.onHostResume(activity);
  });
  Application.android.on('activityResumed', ({ activity }) => {
    console.log('activity resumed');
    reactContext.onHostResume(activity);
  });
  Application.android.on('activityPaused', () => {
    console.log('activity paused');
    reactContext.onHostPause();
  });
  Application.android.on('activityDestroyed', () => {
    console.log('activity destroyed');
    reactContext.onHostDestroy();
  });
  Application.android.on('activityResult', (args) => {
    console.log('activity result');
    reactContext.onActivityResult(
      args.activity,
      args.requestCode,
      args.resultCode,
      args.intent
    );
  });
}

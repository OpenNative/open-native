import {
  AndroidActivityBundleEventData,
  AndroidActivityEventData,
  AndroidActivityNewIntentEventData,
  AndroidActivityResultEventData,
  AndroidApplication,
  Application,
  Utils,
} from '@nativescript/core';
import DeviceEventEmitter from '../../Libraries/EventEmitter/RCTDeviceEventEmitter';
import { AppRegistry } from '../../Libraries/ReactNative/AppRegistry';
import CatalystInstance from './catalyst-instance';
import { toJSValue } from './converter';
import { JSModules } from './js-modules';
import { ReactContext } from './types';

export function getJSModules() {
  if (!global.jsModulesAndroid) {
    global.jsModulesAndroid = new JSModules();
  }
  return global.jsModulesAndroid;
}

function emit(eventType, params) {
  const data = toJSValue(params);
  DeviceEventEmitter.emit(eventType, data);
}

function RCTDeviceEventEmitter() {
  return new com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter(
    {
      emit: emit,
    }
  );
}

function RCTNativeAppEventEmitter() {
  return new com.facebook.react.modules.core.RCTNativeAppEventEmitter({
    emit(eventType, params) {
      const data = toJSValue(params);
      DeviceEventEmitter.emit(eventType, data);
    },
  });
}

const viewRegistry = {};

function RCTEventEmitter() {
  return new com.facebook.react.uimanager.events.RCTEventEmitter({
    receiveTouches(param0, param1, param2) {
      console.warn('receiveTouches unimplemented');
    },
    receiveEvent(viewTag, eventName, params) {
      const data = toJSValue(params);
      const view = viewRegistry[viewTag];
      if (view) {
        view.receiveEvent(eventName, data);
      }
    },
  });
}

function RCTModernEventEmitter() {
  return new com.facebook.react.uimanager.events.RCTModernEventEmitter({
    receiveTouches(param0, param1, param2) {
      console.warn('receiveTouches unimplemented');
    },
    receiveEvent(...params) {
      if (params.length === 3) {
        (
          getJSModules().getJSModuleByName(
            'RCTEventEmitter'
          ) as com.facebook.react.uimanager.events.RCTEventEmitter
        ).receiveEvent(params[0], params[1], params[2]);
      } else {
        (
          getJSModules().getJSModuleByName(
            'RCTEventEmitter'
          ) as com.facebook.react.uimanager.events.RCTEventEmitter
        ).receiveEvent(params[1], params[2], params[5]);
      }
    },
  });
}

export function registerView(tag: number, view: any) {
  viewRegistry[tag] = view;
}

/**
 * Loading the bridge as a global object as we won't be accessing
 * it in a specific class but in various places throughout our
 * implmentation.
 */
export function getCurrentBridge() {
  if (!global.reactNativeBridgeAndroid) {
    getJSModules().registerJSModule(
      'RCTDeviceEventEmitter',
      RCTDeviceEventEmitter()
    );
    getJSModules().registerJSModule(
      'RCTNativeAppEventEmitter',
      RCTNativeAppEventEmitter()
    );
    getJSModules().registerJSModule(
      'AppRegistry',
      AppRegistry.appRegistryJSModule
    );
    getJSModules().registerJSModule('RCTEventEmitter', RCTEventEmitter());
    getJSModules().registerJSModule(
      'RCTModernEventEmitter',
      RCTModernEventEmitter()
    );
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

    if (
      (
        Utils.android.getApplication() as com.facebook.react.ReactCustomApplication
      ).getReactNativeHost
    ) {
      const reactNativeHost = (
        Utils.android.getApplication() as com.facebook.react.ReactCustomApplication
      ).getReactNativeHost();
      reactNativeHost
        .getReactInstanceManager?.()
        .setupReactContext?.(reactApplicationContext);
    }
    attachActivityLifecycleListeners(reactApplicationContext);
  }
  return global.reactNativeBridgeAndroid;
}

export function getThemedReactContext(moduleName: string, surfaceId) {
  return new com.facebook.react.uimanager.ThemedReactContext(
    getCurrentBridge().reactContext as never,
    Utils.android.getApplicationContext(),
    moduleName
  );
}

function getActivityName(activity: android.app.Activity) {
  return activity.getClass().getSimpleName();
}

let mMainActivityName: string;
function attachActivityLifecycleListeners(reactContext: ReactContext) {
  reactContext.setCurrentActivity(getActivity());
  Application.android.on(
    AndroidApplication.activityNewIntentEvent,
    (args: AndroidActivityNewIntentEventData) => {
      if (
        !mMainActivityName ||
        mMainActivityName === getActivityName(args.activity)
      ) {
        mMainActivityName = getActivityName(args.activity);
        reactContext.onNewIntent(args.activity, args.intent);
      }
    }
  );
  Application.android.on(
    AndroidApplication.activityCreatedEvent,
    (args: AndroidActivityBundleEventData) => {
      const activityName = getActivityName(args.activity);
      if (!mMainActivityName || mMainActivityName === activityName) {
        mMainActivityName = activityName;
      }
    }
  );
  Application.android.on(
    AndroidApplication.activityResumedEvent,
    (args: AndroidActivityEventData) => {
      const activityName = getActivityName(args.activity);
      if (!mMainActivityName || mMainActivityName === activityName) {
        mMainActivityName = activityName;
        reactContext.onHostResume(args.activity);
      }
    }
  );
  Application.android.on(
    AndroidApplication.activityPausedEvent,
    (args: AndroidActivityEventData) => {
      if (mMainActivityName === getActivityName(args.activity)) {
        reactContext.onHostPause();
      }
    }
  );
  Application.android.on(
    AndroidApplication.activityDestroyedEvent,
    (args: AndroidActivityEventData) => {
      if (mMainActivityName === getActivityName(args.activity)) {
        reactContext.onHostDestroy();
      }
    }
  );
  Application.android.on(
    AndroidApplication.activityResultEvent,
    (args: AndroidActivityResultEventData) => {
      reactContext.onActivityResult(
        args.activity,
        args.requestCode,
        args.resultCode,
        args.intent
      );
    }
  );
}

function getActivity() {
  return (
    Application.android.foregroundActivity || Application.android.startActivity
  );
}

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

function RCTDeviceEventEmitter() {
  return new com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter(
    {
      emit(eventType, params) {
        const data = toJSValue(params);
        setTimeout(() => {
          DeviceEventEmitter.emit(eventType, data);
        }, 1);
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
    getJSModules().registerJSModule(
      'RCTDeviceEventEmitter',
      RCTDeviceEventEmitter()
    );
    getJSModules().registerJSModule(
      'AppRegistry',
      AppRegistry.appRegistryJSModule
    );
    const reactApplicationContext =
      new com.facebook.react.bridge.ReactApplicationContext(
        Utils.android.getApplicationContext()
      );

    const catalysInstance = new CatalystInstance(
      reactApplicationContext,
      getJSModules(),
      global.reactNativeBridgeAndroid
    );
    reactApplicationContext.initializeWithInstance(catalysInstance.instance);
    global.reactNativeBridgeAndroid = new com.bridge.Bridge(
      reactApplicationContext
    );
    if (Utils.android.getApplication().getReactNativeHost) {
      const reactNativeHost = Utils.android
        .getApplication()
        .getReactNativeHost();
      reactNativeHost
        .getReactInstanceManager?.()
        .setupReactContext?.(reactApplicationContext);
    }
    attachActivityLifecycleListeners(reactApplicationContext);
  }
  return global.reactNativeBridgeAndroid;
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
      if (args.activity.getIntent().getData()) {
        reactContext.onActivityResult(
          args.activity,
          args.requestCode,
          args.resultCode,
          args.activity.getIntent()
        );
        return;
      }
      const callback = (_args: Partial<AndroidActivityNewIntentEventData>) => {
        reactContext.onActivityResult(
          args.activity,
          args.requestCode,
          _args.intent.getData() ? -1 : args.resultCode,
          _args.intent
        );
        Application.android.off(
          AndroidApplication.activityNewIntentEvent,
          callback
        );
      };
      Application.android.on(
        AndroidApplication.activityNewIntentEvent,
        callback
      );
      setTimeout(() => {
        Application.android.off(
          AndroidApplication.activityNewIntentEvent,
          callback
        );
        callback({ intent: args.activity.getIntent() });
      }, 1000);
    }
  );
}

function getActivity() {
  return (
    Application.android.foregroundActivity || Application.android.startActivity
  );
}

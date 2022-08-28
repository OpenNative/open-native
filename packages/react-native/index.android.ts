import { Utils } from '@nativescript/core';

export class ReactNative {
  bridge: com.bridge.Bridge;
  reactContext: com.facebook.react.bridge.ReactApplicationContext;
  init() {
    this.reactContext = new com.facebook.react.bridge.ReactApplicationContext(Utils.android.getApplicationContext());
    this.bridge = new com.bridge.Bridge();
    this.bridge.loadAllRegisteredModules(this.reactContext);
  }

  getName() {
    if (!this.bridge) return;
    const RNTestModule = this.bridge.getJSModule('RNTestModule');
    console.log(RNTestModule);
    console.log(RNTestModule?.getName());
  }
}

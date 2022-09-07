import { Utils } from '@nativescript/core';

export class ReactNative {
  bridge = com.bridge.Bridge;
  reactContext: com.facebook.react.bridge.ReactApplicationContext;
  init() {
    if (!com.facebook) {
      console.log('com.facebook does not exist');
      return;
    }
    this.reactContext = new com.facebook.react.bridge.ReactApplicationContext(Utils.android.getApplicationContext());
    this.bridge.loadModules(this.reactContext);
  }

  getName() {
    if (!this.bridge) return;
    const RNTestModule = this.bridge.getJSModule('RNTestModule');
    console.log(RNTestModule);
    console.log(RNTestModule?.getName());
  }

  callbackTest() {
    if (!this.bridge) return;
    //@ts-ignore
    const RNTestModule: com.testmodule.RNTestModule = this.bridge.getJSModule('RNTestModule');

    RNTestModule.testCallback(
      new com.facebook.react.bridge.Callback({
        invoke: (data) => {
          console.log(data[0], 'hello');
        },
      })
    );
    //console.log('Module:', RNTestModule);
  }
}

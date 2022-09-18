import { DemoSharedBase } from '../utils';
import { ReactNative } from '@ammarahm-ed/react-native';

const RNBridge = new ReactNative();
export class DemoSharedReactNative extends DemoSharedBase {
  loadBridge() {
    RNBridge.init();
  }

  getName() {
    console.log(RNBridge.getName());
  }

  callbackTest() {
    RNBridge.callbackTest();
  }

  promiseTest() {
    RNBridge.promiseTest();
  }
}

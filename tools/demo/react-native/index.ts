import { DemoSharedBase } from '../utils';
import { ReactNative } from '@ammarahm-ed/react-native';

let bridgeLoaded = false;
const RNBridge = new ReactNative();
export class DemoSharedReactNative extends DemoSharedBase {
  loadBridge() {
    if (bridgeLoaded) return;
    RNBridge.init();
    bridgeLoaded = true;
    console.log(RNBridge, 'bridge loaded');
  }

  getName() {
    RNBridge.getName();
  }

  callbackTest() {
    RNBridge.callbackTest();
  }

  promiseTest() {
    RNBridge.promiseTest();
  }
}

import { ReactNativeCommon } from './common';

export declare class ReactNative extends ReactNativeCommon {
  bridge: com.bridge.Bridge;
  reactContext: com.facebook.react.bridge.ReactApplicationContext;
  init: () => void;
  getName: () => void;
}

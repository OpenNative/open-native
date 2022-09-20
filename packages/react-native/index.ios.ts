import { ReactNativeCommon } from './common';

export class ReactNative extends ReactNativeCommon {
  bridge: RCTBridge;
  init() {
    if (!this.bridge) {
      this.bridge = RCTBridge.alloc().init();
    }
  }

  getName() {
    return this.bridge?.moduleForName('RNTestModule')?.class().name;
  }
}

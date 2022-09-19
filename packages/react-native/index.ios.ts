import { ReactNativeCommon } from './common';

export class ReactNative extends ReactNativeCommon {
  bridge: RCTBridge;
  init() {
    if (!this.bridge) {
      this.bridge = RCTBridge.alloc().init();
    }
  }

  getName() {
    if (!this.bridge) {
      console.log('bridge not loaded');
      return;
    }
    const module: RCTBridgeModule = this.bridge.moduleForName('RNTestModule');
    console.log('Module:', module);
    return RCTBridgeModuleNameForClass(module.class()) || module.class().name;
  }
}

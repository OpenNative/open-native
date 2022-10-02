import { getCurrentBridge } from './bridge.ios';
import { promisify, toNativeArguments } from './converter.ios';
import RCTDeviceEventEmitter from './core/EventEmitter/RCTDeviceEventEmitter';
import { getModuleMethods, isPromise, TModuleMethodsType, TNativeModuleMap } from './utils.ios';
export { NativeEventEmitter } from './core/EventEmitter/NativeEventEmitter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const NativemModuleMap: TNativeModuleMap = require('@ammarahm-ed/react-native-podspecs/platforms/ios/lib/modulemap.json');

class NativeModuleHolder {
  module: RCTBridgeModule;
  moduleName: string;
  _bridge: RCTBridge;
  moduleMethods: TModuleMethodsType;
  objcMethodsNames: string[];

  constructor(moduleName: string) {
    this.moduleName = moduleName;
    this._bridge = getCurrentBridge();
    this.moduleMethods = NativemModuleMap[this.moduleName];
    this.wrapNativeMethods();
  }

  wrapNativeMethods() {
    for (const method in this.moduleMethods) {
      this[method] = (...args: unknown[]) => {
        this.module = this.module || this._bridge.moduleForName(this.moduleName);
        this.objcMethodsNames = this.objcMethodsNames || getModuleMethods(this.module);
        const jsName = this.moduleMethods[method].jsName;
        if (isPromise(this.moduleMethods, method)) {
          return promisify(this.module[jsName], this.moduleMethods[method].types, args);
        } else {
          return this.module[jsName]?.(...toNativeArguments(this.moduleMethods[method].types, args));
        }
      };
    }
  }
}

class NativeModulesConstructor {
  constructor() {
    for (const moduleName in NativemModuleMap) {
      this[moduleName] = new NativeModuleHolder(moduleName);
    }
  }
}

export const NativeModules = new NativeModulesConstructor();
export const DeviceEventEmitter = RCTDeviceEventEmitter;

import { getCurrentBridge } from './bridge.ios';
import { promisify, toNativeArguments } from './converter.ios';
import RCTDeviceEventEmitter from './core/EventEmitter/RCTDeviceEventEmitter';
import { getModuleMethods, isPromise, TModuleMethodsType, TNativeModuleMap } from './utils.ios';
export { Platform, PlatformSelect, PlatformSelectOSType } from './core/Utilities/Platform';
export { NativeEventEmitter } from './core/EventEmitter/NativeEventEmitter';
export { Linking } from './core/Libraries/Linking/Linking';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const NativeModuleMap = require('@ammarahm-ed/react-native-podspecs/platforms/ios/lib/modulemap.json') as TNativeModuleMap;

class NativeModuleHolder {
  private module: RCTEventEmitter;
  private bridge: RCTBridge = getCurrentBridge();
  moduleMethods: TModuleMethodsType;
  objcMethodsNames: string[];

  constructor(public moduleName: string) {
    this.moduleMethods = NativeModuleMap[this.moduleName];
    this.wrapNativeMethods();
  }

  get nativeModule(): RCTEventEmitter {
    return (this.module = this.module || this.bridge.moduleForName(this.moduleName));
  }

  get moduleNotFound(): boolean {
    if (!this.nativeModule) {
      console.warn(`Trying to register a react native module "${this.moduleName}" that could not be found in module registry.`);
      return true;
    }
    return false;
  }

  wrapNativeMethods() {
    for (const method in this.moduleMethods) {
      this[method] = (...args: unknown[]) => {
        if (this.moduleNotFound) return;
        this.objcMethodsNames = this.objcMethodsNames || getModuleMethods(this.module);
        const jsName = this.moduleMethods[method].j;
        if (isPromise(this.moduleMethods, method)) {
          return promisify(this.nativeModule, jsName, this.moduleMethods[method].t, args);
        } else {
          return this.nativeModule[jsName]?.(...toNativeArguments(this.moduleMethods[method].t, args));
        }
      };
    }
  }

  addListener(eventType: string) {
    if (this.moduleNotFound) return;
    this.module.addListener?.(eventType);
  }

  removeListeners(count: number) {
    if (this.moduleNotFound) return;
    this.module.removeListeners?.(count);
  }
}

function createNativeModules() {
  const modules = {};
  for (const moduleName in NativeModuleMap) {
    modules[moduleName] = new NativeModuleHolder(moduleName);
  }
  return modules;
}

export const NativeModules = createNativeModules();
export const DeviceEventEmitter = RCTDeviceEventEmitter;

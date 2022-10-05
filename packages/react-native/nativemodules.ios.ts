import { getCurrentBridge } from './bridge.ios';
import { promisify, toJSValue, toNativeArguments } from './converter.ios';
import { getModuleMethods, isPromise, TModuleMethodsType, TNativeModuleMap } from './utils.ios';
import DefaultModuleMap from './core/defaultmodulesmap';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ModuleMap = require('@ammarahm-ed/react-native-podspecs/platforms/ios/lib/modulemap.json') as TNativeModuleMap;
const NativeModuleMap = { ...ModuleMap, ...DefaultModuleMap };

class NativeModuleHolder {
  private module: RCTEventEmitter;
  private bridge: RCTBridge = getCurrentBridge();
  moduleMethods: TModuleMethodsType;
  objcMethodsNames: string[];
  hasExportedConstants: boolean;

  constructor(public moduleName: string) {
    this.moduleMethods = NativeModuleMap[this.moduleName].m;
    this.loadConstants();
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

  loadConstants() {
    this.hasExportedConstants = NativeModuleMap[this.moduleName].e;
    if (!this.hasExportedConstants) return;
    const constants = toJSValue(this.nativeModule.constantsToExport?.()) as {};
    if (!constants) {
      console.warn(`${this.moduleName} specifies that it has exported constants but has returned ${constants}.`);
      return;
    }
    for (const key in constants) {
      this[key] = constants[key];
    }
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

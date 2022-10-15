import { getCurrentBridge } from './bridge.ios';
import {
  promisify,
  toNativeArguments,
  RNNativeModuleArgType,
  toJSValue,
  JSONSerialisable,
  ObjcJSONEquivalent,
} from './converter.ios';
import {
  getModuleMethods,
  isPromise,
  TModuleMethodsType,
  TNativeModuleMap,
} from './utils.ios';
import { CoreModuleMap } from './core/CoreModuleMap';
const CommunityModuleMap =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('./platforms/ios/lib_community/modulemap.json') as TNativeModuleMap;
const NativeModuleMap = Object.assign({}, CommunityModuleMap, CoreModuleMap);

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
    return (this.module =
      this.module || this.bridge.moduleForName(this.moduleName));
  }

  get moduleNotFound(): boolean {
    if (!this.nativeModule) {
      console.warn(
        `Trying to register a react native module "${this.moduleName}" that could not be found in module registry.`
      );
      return true;
    }
    return false;
  }

  loadConstants() {
    this.hasExportedConstants = NativeModuleMap[this.moduleName].e;
    if (!this.hasExportedConstants) return;

    const exportedConstants = this.nativeModule.constantsToExport?.();
    if (!exportedConstants) {
      console.warn(
        `${this.moduleName} specifies that it has exported constants but has returned ${exportedConstants}.`
      );
      return;
    }

    // Convert the constants from Obj-C to JS.
    const constantsAsJs = toJSValue(
      exportedConstants as NSDictionary<NSString, ObjcJSONEquivalent>
    ) as Record<string, JSONSerialisable>;
    if (!constantsAsJs) {
      console.warn(
        `${this.moduleName} specifies that it has exported constants but they weren't serialisable.`
      );
      return;
    }

    for (const key in constantsAsJs) {
      this[key] = constantsAsJs[key];
    }
  }

  wrapNativeMethods() {
    for (const method in this.moduleMethods) {
      this[method] = (...args: RNNativeModuleArgType[]) => {
        if (this.moduleNotFound) return;

        this.objcMethodsNames =
          this.objcMethodsNames || getModuleMethods(this.module);
        const jsName = this.moduleMethods[method].j;

        if (isPromise(this.moduleMethods, method)) {
          return promisify(
            this.nativeModule,
            jsName,
            this.moduleMethods[method].t,
            args
          );
        }

        return this.nativeModule[jsName]?.(
          ...toNativeArguments(this.moduleMethods[method].t, args)
        );
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

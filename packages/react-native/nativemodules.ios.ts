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
  isPromise,
  RNNativeModuleMetadata,
  TNativeModuleMap,
  TModuleMethodsType,
} from './utils.ios';
import { NativeModule } from './core/EventEmitter/NativeEventEmitter';

const NativeModuleMap =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('./platforms/ios/lib_community/modulemap.json') as TNativeModuleMap;

class NativeModuleHolder implements Partial<NativeModule> {
  /**
   * The JSModuleInvoker in JSModules() will be indexing into NativeModuleHolder
   * to call methods upon it, so the class needs an index signature expressing
   * the union of all possible values for keys on the class.
   */
  [key: string]: typeof key extends keyof NativeModuleHolder
    ? { [P in keyof NativeModuleHolder]: NativeModuleHolder[P] }
    : ((...args: unknown[]) => number) | JSONSerialisable;

  private readonly nativeModule: RCTBridgeModule | null;
  private readonly bridge: RCTBridge = getCurrentBridge();
  private readonly moduleMetadata: RNNativeModuleMetadata | undefined;

  constructor(public moduleName: string) {
    this.moduleMetadata = NativeModuleMap[this.moduleName];
    this.nativeModule = this.bridge.moduleForName(this.moduleMetadata.j);

    if (!this.nativeModule) {
      console.warn(
        `Trying to register a React Native native module "${this.moduleName}" that could not be found in the module registry.`
      );
    }

    if (!this.moduleMetadata) {
      console.warn(
        `Trying to register a React Native native module "${this.moduleName}" that was unable to be parsed by the autolinker.`
      );
    }

    if (this.moduleMetadata?.e) {
      this.loadConstants();
    }

    if (this.moduleMetadata?.m) {
      this.wrapNativeMethods(this.moduleMetadata?.m);
    }

    // This is uncomfortably dynamic, but it's in line with NativeEventEmitter's
    // expectations that you can technically instantiate a NativeEventEmitter
    // that's missing these methods. Not sure exactly what they had in mind.
    if (this.nativeModule instanceof RCTEventEmitter) {
      // Holding a reference avoids reasserting the type inside each closure.
      const nativeModule = this.nativeModule;

      this.addListener = (eventType: string) => {
        nativeModule.addListener(eventType);
      };
      this.removeListeners = (count: number) => {
        nativeModule.removeListeners(count);
      };
    }
  }

  private loadConstants(): void {
    const exportedConstants:
      | NSDictionary<NSString, ObjcJSONEquivalent>
      | undefined = this.nativeModule.constantsToExport?.();
    if (!exportedConstants) {
      console.warn(
        `${this.moduleName} specifies that it has exported constants, but has returned ${exportedConstants}.`
      );
      return;
    }

    // Convert the constants from Obj-C to JS.
    const constantsAsJs = toJSValue(exportedConstants) as Record<
      string,
      JSONSerialisable
    >;
    if (!constantsAsJs) {
      console.warn(
        `${this.moduleName} specifies that it has exported constants, but they weren't serialisable.`
      );
      return;
    }

    for (const key in constantsAsJs) {
      this[key] = constantsAsJs[key];
    }
  }

  private wrapNativeMethods(moduleMethods: TModuleMethodsType): void {
    for (const exportedMethodName in moduleMethods) {
      const { j: jsName, t: methodTypes } = moduleMethods[exportedMethodName];
      this[exportedMethodName] = (...args: RNNativeModuleArgType[]) => {
        if (!this.nativeModule) {
          throw new Error(
            `Unable to wrap method "${exportedMethodName}" on module "${this.moduleName}" as the module was not found in the bridge.`
          );
        }

        if (isPromise(moduleMethods, exportedMethodName)) {
          return promisify(this.nativeModule, jsName, methodTypes, args);
        }

        return this.nativeModule[jsName]?.(
          ...toNativeArguments(methodTypes, args)
        );
      };
    }
  }

  addListener?(eventType: string): void;
  removeListeners?(count: number): void;
}

export const NativeModules = Object.keys(NativeModuleMap).reduce(
  (acc, moduleName) => {
    acc[moduleName] = new NativeModuleHolder(moduleName);
    return acc;
  },
  {}
);

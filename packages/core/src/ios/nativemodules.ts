import { getCurrentBridge } from './bridge';
import {
  promisify,
  toNativeArguments,
  RNNativeModuleArgType,
  toJSValue,
  JSONSerialisable,
  ObjcJSONEquivalent,
} from './converter';
import {
  isPromise,
  RNNativeModuleMetadata,
  TNativeModuleMap,
  TModuleMethodsType,
} from './utils';
import { NativeModule } from '../../Libraries/EventEmitter/NativeEventEmitter';

const NativeModuleMap =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../../platforms/ios/lib_community/modulemap.json') as TNativeModuleMap;

class NativeModuleHolder implements Partial<NativeModule> {
  /**
   * The JSModuleInvoker in JSModules() will be indexing into NativeModuleHolder
   * to call methods upon it, so the class needs an index signature expressing
   * the union of all possible values for keys on the class.
   */
  [key: string]: typeof key extends keyof NativeModuleHolder
    ? { [P in keyof NativeModuleHolder]: NativeModuleHolder[P] }
    : ((...args: unknown[]) => number) | JSONSerialisable;

  private readonly bridge: RCTBridge = getCurrentBridge();
  private readonly moduleMetadata: RNNativeModuleMetadata | undefined;
  private nativeModuleInstance: RCTBridgeModule;

  constructor(public moduleName: string) {
    this.moduleMetadata = NativeModuleMap[this.moduleName];

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

  /**
   * Using a getter to ensure that module is lazily loaded
   * upon access by a method call.
   */
  get nativeModule(): RCTBridgeModule {
    // I'm unclear whether we need to look up via the Obj-C name or the exported
    // name. Looking up 'RCTLinkingManager' (the Obj-C and JS name) fails, but
    // 'LinkingManager' (the exported name, or perhaps just the Obj-C name with
    // 'RCT' stripped) succeeds.
    //
    // If we ever find that this fails to find modules with aliased names, then
    // I think we can conclude that it's instead the Obj-C name (which is
    // identical to the jsName exposed in the modulemap) with 'RCT' removed.
    // We'll know it's failed because we'll see the warning.

    this.nativeModuleInstance =
      this.nativeModuleInstance || this.bridge.moduleForName(this.moduleName);

    if (!this.nativeModuleInstance) {
      console.warn(
        `Trying to register a React Native native module "${this.moduleName}" that could not be found in the module registry.`
      );
    }

    return this.nativeModuleInstance;
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
          if (this.nativeModule.methodQueue) {
            dispatch_async(this.nativeModule.methodQueue, () =>
              promisify(this.nativeModule, jsName, methodTypes, args)
            );
          } else {
            promisify(this.nativeModule, jsName, methodTypes, args);
          }
          return;
        }

        if (this.nativeModule.methodQueue) {
          dispatch_async(this.nativeModule.methodQueue, () =>
            this.nativeModule[jsName]?.(...toNativeArguments(methodTypes, args))
          );
          return;
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

global.__turboModulesProxy = NativeModules;

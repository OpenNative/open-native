import { NativeModule } from '../../Libraries/EventEmitter/NativeEventEmitter';
import { getCurrentBridge } from './bridge';
import {
  JavaJSONEquivalent,
  JSONSerialisable,
  promisify,
  RNNativeModuleArgType,
  toJSValue,
  toNativeArguments,
} from './converter';
import { BaseJavaModule, Bridge } from './types';
import {
  isPromise,
  RNNativeModuleMetadata,
  TModuleMethodsType,
  TNativeModuleMap,
} from './utils';

const NativeModuleMap =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../../react-android/bridge/modulemap.json') as TNativeModuleMap;

class NativeModuleHolder implements Partial<NativeModule> {
  /**
   * The JSModuleInvoker in JSModules() will be indexing into NativeModuleHolder
   * to call methods upon it, so the class needs an index signature expressing
   * the union of all possible values for keys on the class.
   */
  [key: string]: typeof key extends keyof NativeModuleHolder
    ? { [P in keyof NativeModuleHolder]: NativeModuleHolder[P] }
    : ((...args: unknown[]) => number) | JSONSerialisable;

  private readonly bridge: Bridge = getCurrentBridge();
  private readonly moduleMetadata: RNNativeModuleMetadata | undefined;
  private nativeModuleInstance: com.facebook.react.bridge.BaseJavaModule | null;

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
  }

  addListener = (eventType: string) => {
    //
  };

  removeListener = (eventType: string) => {
    //
  };

  removeListeners = (count: number) => {
    //
  };

  /**
   * Using a getter to ensure that native module is lazily
   * loaded upon access by a method call.
   */
  get nativeModule(): BaseJavaModule {
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
      this.nativeModuleInstance ||
      (this.bridge.getModuleByName(this.moduleName) as BaseJavaModule);

    if (!this.nativeModuleInstance) {
      console.warn(
        `Trying to register a React Native native module "${this.moduleName}" that could not be found in the module registry.`
      );
    }

    return this.nativeModuleInstance;
  }

  private loadConstants(): void {
    const exportedConstants:
      | java.util.Map<string, JavaJSONEquivalent>
      | undefined = this.nativeModule.getConstants?.();
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
}

export const NativeModules = Object.keys(NativeModuleMap).reduce(
  (acc, moduleName) => {
    acc[moduleName] = new NativeModuleHolder(moduleName);
    return acc;
  },
  {}
);
global.__turboModulesProxy = NativeModules;
export const load = () => null;

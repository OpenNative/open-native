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

export const NativeModuleMap =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../../platforms/ios/lib_community/modulemap.json') as TNativeModuleMap;

export class NativeModuleHolder implements Partial<NativeModule> {
  /**
   * The JSModuleInvoker in JSModules() will be indexing into NativeModuleHolder
   * to call methods upon it, so the class needs an index signature expressing
   * the union of all possible values for keys on the class.
   */
  [key: string]: typeof key extends keyof NativeModuleHolder
    ? { [P in keyof NativeModuleHolder]: NativeModuleHolder[P] }
    : ((...args: unknown[]) => number) | JSONSerialisable | any;

  private readonly bridge: RCTBridge = getCurrentBridge();
  public readonly moduleMetadata: RNNativeModuleMetadata | undefined;
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
  }

  addListener = (eventType: string) => {
    (this.nativeModule as RCTEventEmitter)?.addListener?.(eventType);
  };

  removeListener = (eventType: string) => {
    //
  };

  removeListeners = (count: number) => {
    (this.nativeModule as RCTEventEmitter)?.removeListeners?.(count);
  };

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
    this.constants = constantsAsJs;
    for (const key in constantsAsJs) {
      this[key] = constantsAsJs[key];
    }
  }

  getConstants() {
    return this.constants;
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
          return promisify(
            this.nativeModule,
            this.moduleMetadata.mq,
            jsName,
            methodTypes,
            args
          );
        }

        if (this.moduleMetadata.mq) {
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
}

export const NativeModules = Object.keys(NativeModuleMap).reduce(
  (acc, moduleName) => {
    if (!NativeModuleMap[moduleName].v) {
      acc[moduleName] = new NativeModuleHolder(moduleName);
    }
    return acc;
  },
  {}
);

global.__turboModulesProxy = NativeModules;
export const load = () => null;

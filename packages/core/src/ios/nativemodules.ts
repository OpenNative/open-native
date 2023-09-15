import { Utils } from '@nativescript/core';
import { NativeModule } from '../../Libraries/EventEmitter/NativeEventEmitter';
import { getCurrentBridge } from './bridge';
import {
  JSONSerialisable,
  ObjcJSONEquivalent,
  RNNativeModuleArgType,
  invokeNativeMethod,
  toJSValue,
} from './converter';
import {
  ModuleMetadata,
  getModuleClasses,
  parseModuleMetadata,
} from './metadata';

export class NativeModuleHolder implements Partial<NativeModule> {
  private readonly bridge: RCTBridge = getCurrentBridge();
  public readonly moduleMetadata: ModuleMetadata | undefined;

  private nativeModuleInstance: RCTBridgeModule;
  private __invocationCache: { [name: string]: NSInvocation } = {};
  public constants: { [name: string]: JSONSerialisable } = {};

  constructor(public moduleName: string) {
    this.moduleMetadata = parseModuleMetadata(moduleName);
    this.loadConstants();
    this.wrapNativeMethods();
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
    this.nativeModuleInstance =
      this.nativeModuleInstance || this.bridge.moduleForName(this.moduleName);

    if (!this.nativeModuleInstance) {
      console.warn(
        `Trying to register a native module "${this.moduleName}" that could not be found in the module registry.`
      );
    }

    return this.nativeModuleInstance;
  }

  private loadConstants(): void {
    const exportedConstants:
      | NSDictionary<NSString, ObjcJSONEquivalent>
      | undefined = this.nativeModule.constantsToExport?.();

    if (!exportedConstants) return;
    // Convert the constants from Obj-C to JS.
    this.constants = toJSValue(exportedConstants) as Record<
      string,
      JSONSerialisable
    >;

    if (!this.constants) return;

    for (const key in this.constants) {
      this[key] = this.constants[key];
    }
  }

  getConstants() {
    return this.constants;
  }

  private wrapNativeMethods(): void {
    for (const exportedMethodName in this.moduleMetadata.methods) {
      const { types, sync, selector } =
        this.moduleMetadata.methods[exportedMethodName];

      this[exportedMethodName] = (...args: RNNativeModuleArgType[]) => {
        if (!this.nativeModule) {
          throw new Error(
            `Unable to wrap method "${exportedMethodName}" on module "${this.moduleName}" as the module was not found in the bridge.`
          );
        }
        if (
          this.nativeModule.respondsToSelector('methodQueue') &&
          this.nativeModule.methodQueue &&
          this.nativeModule.methodQueue !== dispatch_get_current_queue()
        ) {
          dispatch_async(this.nativeModule.methodQueue, () => {
            invokeNativeMethod.call(this, selector, types, args, sync);
          });
        } else {
          return toJSValue(
            invokeNativeMethod.call(this, selector, types, args, sync)
          );
        }
      };
    }
  }
}

const ModuleInstances = {};
const Modules = {};
for (const module of getModuleClasses() as string[]) {
  Object.defineProperty(Modules, module, {
    get() {
      if (ModuleInstances[module]) return ModuleInstances[module];
      return (ModuleInstances[module] = new NativeModuleHolder(
        module as string
      ));
    },
  });
}
export const NativeModules = Modules;
global.__turboModulesProxy = NativeModules;
export const load = () => null;

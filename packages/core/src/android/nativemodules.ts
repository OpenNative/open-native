import { Utils } from '@nativescript/core';
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
import {
  getModuleClasses,
  ModuleMetadata,
  parseModuleMetadata,
} from './metadata';
import { BaseJavaModule, Bridge } from './types';
import { isPromise } from './utils';

export class NativeModuleHolder implements Partial<NativeModule> {
  private readonly bridge: Bridge = getCurrentBridge();
  public readonly moduleMetadata: ModuleMetadata | undefined;
  private nativeModuleInstance: com.facebook.react.bridge.BaseJavaModule | null;
  public constants: { [name: string]: JSONSerialisable } = {};
  public viewManager: boolean;

  constructor(public moduleName: string) {
    this.moduleMetadata = parseModuleMetadata(moduleName);

    if (!this.moduleMetadata) {
      console.warn(
        `Trying to register a React Native native module "${this.moduleName}" that was unable to be parsed by the autolinker.`
      );
    }

    this.loadConstants();

    this.wrapNativeMethods();
  }

  addListener = (...args: any[]) => {
    this.nativeModule['addListener']?.(...args);
  };

  removeListener = (...args: any[]) => {
    this.nativeModule['removeListener']?.(...args);
  };

  removeListeners = (...args: any[]) => {
    this.nativeModule['removeListeners']?.(...args);
  };

  /**
   * Using a getter to ensure that native module is lazily
   * loaded upon access by a method call.
   */
  get nativeModule(): BaseJavaModule {
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
    if (!exportedConstants) return;
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
      const { types } = this.moduleMetadata.methods[exportedMethodName];
      this[exportedMethodName] = (...args: RNNativeModuleArgType[]) => {
        if (!this.nativeModule) {
          throw new Error(
            `Unable to wrap method "${exportedMethodName}" on module "${this.moduleName}" as the module was not found in the bridge.`
          );
        }

        if (this.viewManager) {
          if (types.length === 1) {
            this.nativeModule[exportedMethodName]?.(args[0]);
          } else {
            const arr = toNativeArguments([types[1]], args.slice(1));
            this.nativeModule[exportedMethodName]?.(args[0], ...arr);
          }
          return;
        }

        if (isPromise(types)) {
          return promisify(this.nativeModule, exportedMethodName, types, args);
        }

        return toJSValue(
          this.nativeModule[exportedMethodName]?.(
            ...toNativeArguments(types, args)
          )
        );
      };
    }
  }

  toString() {
    return `${this.moduleName}(${this.nativeModule})`;
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
global.__turboModulesProxy = Modules;

export const load = () => null;

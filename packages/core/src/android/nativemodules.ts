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
import { ModuleMetadata, parseModuleMetadata } from './metadata';
import { BaseJavaModule, Bridge } from './types';
import { isPromise } from './utils';

class NativeModuleHolder implements Partial<NativeModule> {
  private readonly bridge: Bridge = getCurrentBridge();
  public readonly moduleMetadata: ModuleMetadata | undefined;
  private nativeModuleInstance: com.facebook.react.bridge.BaseJavaModule | null;
  public constants: { [name: string]: JSONSerialisable } = {};

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
      (this.bridge.getModuleByName(
        this.moduleName,
        //@ts-ignore
        this.moduleMetadata.v || false
      ) as BaseJavaModule);

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
    for (const exportedMethodName in this.moduleMetadata) {
      const { types } = this.moduleMetadata[exportedMethodName];
      this[exportedMethodName] = (...args: RNNativeModuleArgType[]) => {
        if (!this.nativeModule) {
          throw new Error(
            `Unable to wrap method "${exportedMethodName}" on module "${this.moduleName}" as the module was not found in the bridge.`
          );
        }
        
// TODO
//         if (this.moduleMetadata.v) {
//           // In case of ViewManagers, the first argument is always the Native View instance followed by
//           // the props.
//           if (methodTypes.length === 2) {
//             this.nativeModule[jsName]?.(args[0]);
//           } else {
//             this.nativeModule[jsName]?.(
//               args[0],
//               ...toNativeArguments(
//                 [methodTypes[0], ...methodTypes.slice(2)],
//                 args.slice(1)
//               )
//             );
//           }
//           return;
//         }


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
}

const nativeModuleProxyHandle: ProxyHandler<{}> = {
  get: (target, prop) => {
    if (target[prop]) return target[prop];
    if (!getCurrentBridge().isModuleAvailable(prop as string)) {
      console.warn(
        `Trying to get a Native Module "${
          prop as string
        }" does not exist in the native module registry.`
      );
      return null;
    }

    return (target[prop] = new NativeModuleHolder(prop as string));
  },
};

export const NativeModules = new Proxy({}, nativeModuleProxyHandle);

global.__turboModulesProxy = NativeModules;
export const load = () => null;

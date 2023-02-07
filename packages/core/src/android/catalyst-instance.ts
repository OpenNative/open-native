import { toJSValue } from './converter';
import { JSModules } from './js-modules';
import {
  Bridge,
  JavaScriptContextHolder,
  JavaScriptModule,
  JSIModule,
  JSIModuleType,
  NativeModule,
  ReactApplicationContext,
} from './types';

export default class CatalystInstance {
  instance: com.facebook.react.bridge.CatalystInstance;
  public destroy(): void {
    return;
  }

  constructor(
    public reactContext: ReactApplicationContext,
    public jsModules: JSModules,
    public bridge: Bridge
  ) {
    this.instance = new com.facebook.react.bridge.CatalystInstance({
      destroy() {
        return;
      },
      getJSIModule(param0: JSIModuleType): JSIModule {
        return null;
      },

      getJSModule(clazz: java.lang.Class<any>): JavaScriptModule {
        return jsModules.getJSModule(clazz);
      },
      getNativeModule(param0: unknown): NativeModule {
        if (typeof param0 === 'string') {
          return bridge.getModuleByName(param0 as string, false);
        } else {
          return bridge.getModuleForClass(
            param0 as java.lang.Class<any>,
            false
          );
        }
      },

      getNativeModules(): java.util.Collection<NativeModule> {
        return bridge.modules.values();
      },

      isDestroyed(): boolean {
        return false;
      },

      hasNativeModule(param0: java.lang.Class<any>): boolean {
        return bridge.hasNativeModule(param0);
      },

      setTurboModuleManager(param0: JSIModule): void {
        return;
      },
      getJavaScriptContextHolder(): JavaScriptContextHolder {
        return new com.facebook.react.bridge.JavaScriptContextHolder();
      },
      callFunction(name, method, args) {
        const module = jsModules.getJSModuleByName(name);
        if (module && module[method]) {
          module[method](...((toJSValue(args) || []) as []));
        }
      },
    });
  }
}

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
        return this.jsModules.getJSModule(clazz);
      },
      getNativeModule(param0: unknown): NativeModule {
        if (typeof param0 === 'string') {
          return this.bridge.getModuleByName(param0 as string);
        } else {
          return this.bridge.getModuleForClass(param0 as java.lang.Class<any>);
        }
      },

      getNativeModules(): java.util.Collection<NativeModule> {
        return this.bridge.modules;
      },

      isDestroyed(): boolean {
        return false;
      },

      hasNativeModule(param0: java.lang.Class<any>): boolean {
        return this.bridge.hasNativeModule(param0);
      },

      setTurboModuleManager(param0: JSIModule): void {
        return;
      },
      getJavaScriptContextHolder(): JavaScriptContextHolder {
        return null;
      },
    });
  }
}

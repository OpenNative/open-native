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

export default class CatalystInstance
  implements com.facebook.react.bridge.CatalystInstance
{
  public destroy(): void {
    return;
  }

  constructor(
    public reactContext: ReactApplicationContext,
    public jsModules: JSModules,
    public bridge: Bridge
  ) {}

  public getJSIModule(param0: JSIModuleType): JSIModule {
    return null;
  }

  public getJSModule(clazz: java.lang.Class<any>): JavaScriptModule {
    return this.jsModules.getJSModule(clazz);
  }
  public getNativeModule(param0: java.lang.Class<any>): NativeModule;
  public getNativeModule(param0: string): NativeModule;
  public getNativeModule(param0: unknown): NativeModule {
    if (typeof param0 === 'string') {
      return this.bridge.getModuleByName(param0 as string);
    } else {
      return this.bridge.getModuleForClass(param0 as java.lang.Class<any>);
    }
  }

  public getNativeModules(): java.util.Collection<NativeModule> {
    return this.bridge.modules;
  }

  public isDestroyed(): boolean {
    return false;
  }

  public hasNativeModule(param0: java.lang.Class<any>): boolean {
    return this.bridge.hasNativeModule(param0);
  }

  public setTurboModuleManager(param0: JSIModule): void {
    return;
  }

  public getJavaScriptContextHolder(): JavaScriptContextHolder {
    return null;
  }
}

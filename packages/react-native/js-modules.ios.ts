import { getCurrentBridge } from './bridge.ios';
import { toJSValue, JSValuePassableIntoObjc } from './converter.ios';

export type JSMethodRecord = {
  [methodName: string]: (...args: unknown[]) => unknown;
};

export class JSModules {
  private readonly bridge: RCTBridge = getCurrentBridge();
  // If the only modules entering this module record are internal ones, we could
  // type this more strongly with generic typings. But for now, it's loose.
  private readonly modules: { [moduleName: string]: JSMethodRecord } = {};

  constructor() {
    this.bridge.setJSModuleInvokerCallback(this.jsModuleInvoker.bind(this));
  }

  private jsModuleInvoker(
    moduleName: string,
    methodName: string,
    args: NSArray<NSObject>
  ): unknown {
    const jsModule = this.modules[moduleName];
    if (!jsModule) {
      throw new Error(`Unrecognized name for JS module, "${moduleName}".`);
    }
    const jsMethod = jsModule[methodName];
    if (!jsMethod) {
      throw new Error(
        `Unrecognized method name "${methodName}" for JS module, "${moduleName}".`
      );
    }

    // Given an NSArray of native args from Obj-C, convert those into JS
    // primitive types and call the JS method with it.
    return jsMethod(...(toJSValue(args) as JSValuePassableIntoObjc[]));
  }

  registerJSModule(name: string, module: JSMethodRecord) {
    this.modules[name] = module;
  }

  unregisterJSModule(name: string) {
    delete this.modules[name];
  }
}

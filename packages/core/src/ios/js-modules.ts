import { JSValuePassableIntoObjc, toJSValue } from './converter';

export type JSMethodRecord = {
  [methodName: string]: (...args: unknown[]) => unknown;
};

export class JSModules {
  // If the only modules entering this module record are internal ones, we could
  // type this more strongly with generic typings. But for now, it's loose.
  private readonly modules: { [moduleName: string]: JSMethodRecord } = {};

  constructor(public bridge: RCTBridge) {
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
    if (!jsModule[methodName]) {
      throw new Error(
        `Unrecognized method name "${methodName}" for JS module, "${moduleName}".`
      );
    }
    // Run callback on next event loop.
    if (moduleName === 'RCTDeviceEventEmitter') {
      const params = toJSValue(args) as JSValuePassableIntoObjc[];
      setTimeout(() => {
        jsModule[methodName](...params);
      }, 1);
      return;
    }
    // Given an NSArray of native args from Obj-C, convert those into JS
    // primitive types and call the JS method with it.
    return jsModule[methodName](
      ...(toJSValue(args) as JSValuePassableIntoObjc[])
    );
  }

  registerJSModule(name: string, module: JSMethodRecord) {
    this.modules[name] = module;
  }

  unregisterJSModule(name: string) {
    delete this.modules[name];
  }
}

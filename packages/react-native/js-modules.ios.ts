import { getCurrentBridge } from './bridge.ios';
import { toJSValue } from './converter.ios';

class JSModules {
  private bridge: RCTBridge = getCurrentBridge();
  private modules: { [name: string]: any } = {};
  constructor() {
    this.bridge.setJSModuleInvokerCallback(this.jsModuleInvoker);
  }

  jsModuleInvoker(moduleName: string, methodName: string, args: NSArray<any>) {
    return this.modules[moduleName]?.[methodName]?.(...(toJSValue(args) as unknown[]));
  }

  registerJSModule(name: string, module: any) {
    this.modules[name] = module;
  }

  unregisterJSModule(name: string) {
    delete this.modules[name];
  }
}

export default JSModules;

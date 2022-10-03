import { getCurrentBridge } from './bridge.ios';
import { toJSValue } from './converter.ios';

class JSModules {
  _bridge: RCTBridge;
  _modules: { [name: string]: any };
  constructor() {
    this._bridge = getCurrentBridge();
    this._bridge.setJSModuleInvokerCallback(this.jsModuleInvoker);
    this._modules = {};
  }

  jsModuleInvoker(moduleName: string, methodName: string, args: NSArray<any>) {
    this._modules[moduleName]?.[methodName]?.(...toJSValue(args));
  }

  registerJSModule(name: string, module: any) {
    this._modules[name] = module;
  }

  unregisterJSModule(name: string) {
    delete this._modules[name];
  }
}

export default JSModules;

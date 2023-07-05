import { JavaScriptModule } from './types';

export class JSModules {
  private readonly modules: { [moduleName: string]: JavaScriptModule } = {};

  getJSModuleByName(name: string): JavaScriptModule {
    return this.modules[name];
  }

  getJSModule(clazz: java.lang.Class<any>): JavaScriptModule {
    let name = clazz.getSimpleName();
    const dollarSignIndex = name.lastIndexOf('$');
    if (dollarSignIndex != -1) {
      name = name.substring(dollarSignIndex + 1);
    }
    return this.modules[name];
  }

  registerJSModule(name: string, module: JavaScriptModule) {
    this.modules[name] = module;
  }

  unregisterJSModule(name: string) {
    delete this.modules[name];
  }
}

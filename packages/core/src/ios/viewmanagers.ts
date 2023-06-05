import { NativeModuleHolder, NativeModuleMap } from './nativemodules';
import { toJSValue } from './converter';
import { getCurrentBridge } from './bridge';

function isEventProp(prop) {
  return (
    prop.t === 'RCTDirectEventBlock' ||
    prop.t === 'RCTBubblingEventBlock' ||
    prop.t === 'RCTCapturingEventBlock'
  );
}

class ViewManagerHolder extends NativeModuleHolder {
  props: { [name: string]: number | string } = {};
  mappedEvents: { [name: string]: string } = {};
  viewEvents = [];
  static id = 0;

  constructor(name) {
    super(name);
    if (this.moduleMetadata.p) {
      for (const prop of this.moduleMetadata.p) {
        if (isEventProp(prop)) {
          this.viewEvents[prop.j] = prop.j;
          continue;
        }
        this.props[prop.j] = prop.t;
      }
    }
  }

  _createViewInstance(): any {
    return (this.nativeModule as RCTViewManager).view();
  }

  __getViewId() {
    return ViewManagerHolder.id++;
  }

  __registerView(tag: number, view: any) {
    getCurrentBridge().uiManager.registerViewReactTag(view, tag);
  }

  __getJSEventName(eventName: string) {
    let jsEventName = eventName;
    if (this.mappedEvents[jsEventName]) return this.mappedEvents[jsEventName];
    jsEventName = this.viewEvents[jsEventName];

    if (jsEventName.startsWith('top'))
      jsEventName = jsEventName.replace('top', '');
    if (jsEventName.startsWith('on'))
      jsEventName = jsEventName.replace('on', '');
    this.mappedEvents[eventName] =
      jsEventName[0].toLowerCase() + jsEventName.slice(1);
    return this.mappedEvents[eventName];
  }

  public isNativeProp(prop: string) {
    return !!this.props[prop];
  }

  public setNativeProp(view: any, prop: string, ...params: any[]) {
    if (this.props[prop]) {
      view[prop] = params[0];
      return;
    }
    console.warn(
      `Setter for prop ${prop} on view $${this.moduleName} not found`
    );
  }

  public getExportedViewConstants(): any {
    const exportedConstants = (this.nativeModule as RCTViewManager)
      ?.constantsToExport;

    return exportedConstants ? toJSValue(exportedConstants) : {};
  }
}

export const ViewManagers: { [name: string]: ViewManagerHolder } = Object.keys(
  NativeModuleMap
).reduce((acc, moduleName) => {
  if (NativeModuleMap[moduleName].v) {
    acc[moduleName] = new ViewManagerHolder(moduleName);
  }
  return acc;
}, {});
global.__viewManagerProxy = ViewManagers;
export const load = () => null;

// When event is subscribed, check for it's native event &
// bind it with the view instance in a callback that will
// emit the JS event through the eventEmitter.

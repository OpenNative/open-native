/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventData, Utils, View } from '@nativescript/core';
import { RNObjcSerialisableType, isNullOrUndefined } from '../common';
import { getCurrentBridge } from './bridge';
import { toJSValue, toNativeArguments } from './converter';
import { NativeModuleHolder } from './nativemodules';
import type { ViewManagers as ViewManagerInterfaces } from './view-manager-types';

type ViewEventReciever = { subscribe: () => void; unsubscribe: () => void };
type ViewProps<K extends keyof ViewManagerInterfaces> =
  keyof ViewManagerInterfaces[K];

function isEventProp(type: number) {
  return type === RNObjcSerialisableType.RCTEventType;
}

class ViewManagerHolder extends NativeModuleHolder {
  props: { [name: string]: number | string } = {};
  viewEvents: { [name: string]: { nativeName: string; type: number } } = {};
  static id = 0;

  constructor(name) {
    super(name);

    for (const propName in this.moduleMetadata.props) {
      const prop = this.moduleMetadata.props[propName];
      if (isEventProp(prop.jsType)) {
        this.viewEvents[this.__getJSEventName(propName)] = {
          nativeName: propName,
          type: prop.jsType,
        };
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

  __unRegisterView(tag: number) {
    getCurrentBridge().uiManager.unRegisterView(tag);
  }

  __getJSEventName(eventName: string) {
    let jsEventName = eventName;
    if (jsEventName.startsWith('top'))
      jsEventName = jsEventName.replace('top', '');
    if (jsEventName.startsWith('on'))
      jsEventName = jsEventName.replace('on', '');
    jsEventName = jsEventName[0].toLowerCase() + jsEventName.slice(1);

    return jsEventName;
  }

  public isNativeProp(prop: string) {
    return !!this.moduleMetadata.props[prop];
  }

  public setNativeProp(view: any, prop: string, ...params: any[]) {
    const propInfo = this.moduleMetadata.props[prop];
    if (!propInfo) {
      console.warn(
        `Setter for prop ${prop} on view $${this.moduleName} not found`
      );
      return;
    }

    const requiresRCTConvert = propInfo.jsType == RNObjcSerialisableType.other;
    const propKey = propInfo.key || prop;
    if (
      !propInfo.setDefaultValue &&
      (view as UIView).respondsToSelector(propInfo.getter || prop)
    ) {
      propInfo.defaultValue = view.valueForKey(propKey);
      propInfo.setDefaultValue = true;
    }
    const nativeParams = toNativeArguments(
      [propInfo.jsType] as never,
      params,
      undefined,
      undefined,
      false
    );

    if (!isNullOrUndefined(nativeParams.arguments[0])) {
      if (requiresRCTConvert) {
        (this.nativeModule as RCTViewManager).convertAndSetOnViewTypeJson(
          propInfo.setter,
          view,
          `${propInfo.type}:`,
          nativeParams[0]
        );
      } else {
        const param = nativeParams.arguments[0];
        if (propInfo.keyPath === '__custom__') {
          (this.nativeModule as RCTViewManager).callCustomSetterOnViewWithProp(
            propInfo.customSetter,
            view,
            param
          );
        } else {
          view.setValueForKey(param, propKey);
        }
      }
    } else {
      view.setValueForKey(propInfo.defaultValue, propKey);
    }
    return;
  }

  public getExportedViewConstants(): any {
    const exportedConstants = (this.nativeModule as RCTViewManager)
      ?.constantsToExport;

    return exportedConstants ? toJSValue(exportedConstants) : {};
  }
}
// TODO
let MODULE_CLASS_NAMES = [];
const viewManagerProxyHandle: ProxyHandler<{}> = {
  get: (target, prop) => {
    if (target[prop]) return target[prop];

    if (!MODULE_CLASS_NAMES.length)
      MODULE_CLASS_NAMES = Utils.ios.collections.nsArrayToJSArray(
        RCTGetModuleClasses().allKeys
      );
    if (MODULE_CLASS_NAMES.indexOf(prop as string) === -1) {
      console.warn(
        `Trying to get a View Manager "${
          prop as string
        }" does not exist in the view manager registry.`
      );
      return null;
    }

    return (target[prop] = new ViewManagerHolder(prop as string));
  },
};

export const ViewManagersIOS = new Proxy({}, viewManagerProxyHandle);
global.__viewManagerProxy = ViewManagersIOS;
export const load = () => null;

// When event is subscribed, check for it's native event &
// bind it with the view instance in a callback that will
// emit the JS event through the eventEmitter.

const _nativeViewCache = {};

export function requireNativeViewIOS<T extends keyof ViewManagerInterfaces>(
  key: T
): Omit<View, ViewProps<T>> & ViewManagerInterfaces[T] {
  if (!ViewManagersIOS[key as any]) {
    throw new Error(`ViewManager with name ${name} was not found.`);
  }
  if (_nativeViewCache[key as string]) return _nativeViewCache[key as string];

  (_nativeViewCache[key as string] = class extends View {
    nativeProps: { [name: string]: any[] } = {};
    _viewTag: number;
    _viewManager = ViewManagersIOS[key as any];
    _viewEventRecievers: {
      [name: string]: ViewEventReciever;
    } = {};
    constructor() {
      super();
      const viewManager = ViewManagersIOS[key as any];
      for (const prop in viewManager.moduleMetadata.props) {
        Object.defineProperty(this, prop, {
          set(newValue) {
            if (newValue === this.nativeProps[prop]) return;
            this.nativeProps[prop] = newValue;
            if (this.nativeViewProtected) {
              viewManager.setNativeProp(
                this.nativeViewProtected,
                prop,
                this.nativeProps[prop]
              );
            }
          },
          get() {
            return this.nativeProps[prop];
          },
        });
      }
    }

    createNativeView() {
      this._viewTag = this._viewManager.__getViewId();
      const nativeView = this._viewManager._createViewInstance();
      this._viewManager.__registerView(this._viewTag, this);
      return nativeView;
    }

    initNativeView(): void {
      if (this.nativeViewProtected) {
        for (const prop in this.nativeProps) {
          if (this.nativeProps[prop] === undefined) continue;
          this._viewManager.setNativeProp(
            this.nativeViewProtected,
            prop,
            this.nativeProps[prop]
          );
        }
        for (const key in this._viewEventRecievers) {
          this._viewEventRecievers[key]?.subscribe();
        }
      }
    }

    receiveEvent(eventName: string, data: unknown) {
      this.notify({
        eventName: eventName,
        object: this,
        nativeEvent: data,
      });
    }
    disposeNativeView(): void {
      if (this.nativeViewProtected) {
        this._viewManager.__unRegisterView(this._viewTag);
      }
    }
    addEventListener(
      arg: string,
      callback: (data: EventData) => void,
      thisArg?: any
    ): void {
      const events = arg.split(',');
      for (const event of events) {
        const viewEventReciever = this.createViewEventReceiver(event);
        this._viewEventRecievers[event] = viewEventReciever;
        viewEventReciever?.subscribe();
      }
      super.addEventListener(arg, callback, thisArg);
    }

    removeEventListener(arg: string, callback?: any, thisArg?: any): void {
      super.removeEventListener(arg, callback, thisArg);

      const events = arg.split(',');
      for (const event of events) {
        if (!this.hasListeners(event)) {
          this._viewEventRecievers[event]?.unsubscribe();
        }
      }
    }

    createViewEventReceiver(eventName: string) {
      if (this._viewEventRecievers[eventName])
        return this._viewEventRecievers[eventName];

      if (this._viewManager.viewEvents[eventName]) {
        const nativeEventBlockName =
          this._viewManager.viewEvents[eventName].nativeName;

        return {
          subscribe: () => {
            if (this.nativeViewProtected) {
              this.nativeViewProtected[nativeEventBlockName] = (
                event: NSDictionary<string, unknown>
              ) => {
                const jsEventObject = toJSValue(event);
                this.receiveEvent(eventName as string, jsEventObject);
              };
            }
          },
          unsubscribe: () => {
            if (this.nativeViewProtected) {
              this.nativeViewProtected[nativeEventBlockName] = null;
            }
          },
        };
      }
    }
  }) as unknown as Omit<View, keyof ViewManagerInterfaces[T]> &
    ViewManagerInterfaces[T];
  return _nativeViewCache[key as string];
}

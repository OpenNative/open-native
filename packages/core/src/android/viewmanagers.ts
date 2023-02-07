/* eslint-disable @typescript-eslint/no-explicit-any */
import { View } from '@nativescript/core';
import { getThemedReactContext, registerView } from './bridge';
import { toJSValue } from './converter';
import { NativeModuleHolder, NativeModuleMap } from './nativemodules';
import type { ViewManagers as ViewManagerInterfaces } from './view-manager-types';

class ViewManagerHolder
  extends NativeModuleHolder
  implements
    Partial<
      Omit<com.facebook.react.uimanager.ViewManager<any, any>, 'getConstants'>
    >
{
  props: { [name: string]: string } = {};
  propDefaults: { [name: string]: any } = {};
  directEvents: {
    [name: string]: {
      registrationName: string;
    };
  };
  bubblingEvents: {
    [name: string]: {
      phasedRegistrationNames: {
        bubbled: string;
      };
    };
  };
  mappedEvents: { [name: string]: string } = {};
  themedReactContext: any;
  static id = 0;

  constructor(name) {
    super(name);
    if (this.moduleMetadata.m) {
      for (const method in this.moduleMetadata.m) {
        this.props[this.moduleMetadata.m[method].p] = method;
        this.propDefaults[this.moduleMetadata.m[method].p] =
          this.moduleMetadata.m[method].d;
      }
    }
  }

  _createViewInstance(surfaceId = -1): any {
    this.themedReactContext = getThemedReactContext(this.moduleName, surfaceId);
    if (!this.directEvents) {
      this.directEvents = toJSValue(
        (
          this.nativeModule as com.facebook.react.uimanager.ViewManager<
            any,
            any
          >
        ).getExportedCustomDirectEventTypeConstants()
      ) as any;
      this.bubblingEvents = toJSValue(
        (
          this.nativeModule as com.facebook.react.uimanager.ViewManager<
            any,
            any
          >
        ).getExportedCustomBubblingEventTypeConstants()
      ) as any;
    }
    return (
      this.nativeModule as com.facebook.react.uimanager.ViewManager<any, any>
    )?.createViewInstance?.(this.themedReactContext);
  }

  __getViewId() {
    return ViewManagerHolder.id++;
  }

  __registerView(tag: number, view: any) {
    registerView(tag, view);
  }

  __getJSEventName(eventName: string) {
    let jsEventName = eventName;
    if (this.mappedEvents[jsEventName]) return this.mappedEvents[jsEventName];
    if (this.directEvents && this.directEvents[jsEventName]) {
      jsEventName = this.directEvents[jsEventName].registrationName;
    }

    if (this.bubblingEvents && this.bubblingEvents[jsEventName]) {
      jsEventName =
        this.bubblingEvents[eventName].phasedRegistrationNames.bubbled;
    }

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
      this[this.props[prop]]?.(view, ...params);
      return;
    }
    console.warn(
      `Setter for prop ${prop} on view $${this.moduleName} not found`
    );
  }

  public getExportedViewConstants(): any {
    const exportedConstants = (
      this.nativeModule as com.facebook.react.uimanager.ViewManager<any, any>
    )?.getExportedViewConstants();

    return exportedConstants ? toJSValue(exportedConstants) : {};
  }
}

export const ViewManagers: { [name: string]: ViewManagerHolder } = Object.keys(
  NativeModuleMap
).reduce((acc, moduleName) => {
  if (NativeModuleMap[moduleName].v) {
    acc[moduleName] = new ViewManagerHolder(moduleName);

    return acc;
  }
  return acc;
}, {});

global.__viewManagerProxy = ViewManagers;
export const load = () => null;

const _nativeViewCache = {};
type ViewProps<K extends keyof ViewManagerInterfaces> =
  keyof ViewManagerInterfaces[K];
export function requireNativeView<T extends keyof ViewManagerInterfaces>(
  key: T
): Omit<View, ViewProps<T>> & ViewManagerInterfaces[T] {
  if (!ViewManagers[key]) {
    throw new Error(`ViewManager with name ${name} was not found.`);
  }
  if (_nativeViewCache[key as string]) return _nativeViewCache[key as string];

  return (_nativeViewCache[key as string] = class extends View {
    nativeProps: { [name: string]: any[] } = {};
    _viewTag: number;
    _viewManager = ViewManagers[key];
    constructor() {
      super();
      const viewManager = ViewManagers[key];
      for (const prop in viewManager.props) {
        Object.defineProperty(this, prop, {
          set(newValue) {
            console.log(prop, newValue);
            if (newValue === this.nativeProps[prop]) return;
            this.nativeProps[prop] =
              newValue === undefined
                ? this._viewManager.propDefaults[prop]
                : newValue;
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
      const nativeView = this._viewManager._createViewInstance(this._viewTag);
      nativeView.setId(this._viewTag);
      this._viewManager.__registerView(this._viewTag, this);
      return nativeView;
    }

    initNativeView(): void {
      if (this.nativeViewProtected) {
        for (const prop in this._viewManager.propDefaults) {
          if (
            this.nativeProps[prop] === undefined &&
            typeof this._viewManager.propDefaults[prop] !== 'undefined'
          )
            this.nativeProps[prop] = this._viewManager.propDefaults[prop];
        }
        for (const prop in this.nativeProps) {
          this._viewManager.setNativeProp(
            this.nativeViewProtected,
            prop,
            this.nativeProps[prop]
          );
        }
      }
    }

    receiveEvent(eventName: string, data: unknown) {
      this.notify({
        eventName: this._viewManager.__getJSEventName(eventName),
        object: this,
        nativeEvent: data,
      });
    }
    disposeNativeView(): void {
      if (this.nativeViewProtected) {
        (
          this._viewManager
            .nativeModule as com.facebook.react.uimanager.ViewManager<any, any>
        ).onDropViewInstance?.(this.nativeViewProtected);
      }
    }
  }) as unknown as Omit<View, keyof ViewManagerInterfaces[T]> &
    ViewManagerInterfaces[T];
}

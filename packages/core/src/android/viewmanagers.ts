/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  View,
  CustomLayoutView,
  LayoutBase,
  ViewBase,
} from '@nativescript/core';
import {
  getCurrentBridge,
  getThemedReactContext,
  registerView,
} from './bridge';
import { toJSValue } from './converter';
import { NativeModuleHolder } from './nativemodules';
import type { ViewManagers as ViewManagerInterfaces } from './view-manager-types';
import { RNJavaSerialisableType, isNullOrUndefined } from '../common';
import { ModuleMetadata } from './metadata';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { RNNativeViewAndroid } from '@open-native/core';

type ViewProps<K extends keyof ViewManagerInterfaces> =
  keyof ViewManagerInterfaces[K];

type ViewType<T extends keyof ViewManagerInterfaces> = Omit<
  View,
  ViewProps<T>
> &
  ViewManagerInterfaces[T];

declare module '@open-native/core' {
  interface RNNativeViewAndroid<T extends keyof ViewManagerInterfaces> {
    prototype: ViewType<T>;
    new (): ViewType<T>;
  }
}

function getDefaultValue(method: ModuleMetadata['methods']['name']) {
  const type = method.types[1];
  if (type === undefined) return;
  switch (type) {
    case RNJavaSerialisableType.boolean:
    case RNJavaSerialisableType.nonnullBoolean:
    case RNJavaSerialisableType.javaBoolean:
    case RNJavaSerialisableType.nonnullJavaBoolean:
      return method.defaultBoolean;
    case RNJavaSerialisableType.float:
    case RNJavaSerialisableType.nonnullFloat:
    case RNJavaSerialisableType.javaFloat:
      return method.defaultFloat;
    case RNJavaSerialisableType.int:
    case RNJavaSerialisableType.nonnullInt:
    case RNJavaSerialisableType.nonnullJavaInteger:
    case RNJavaSerialisableType.javaInteger:
      return method.defaultInt;
    case RNJavaSerialisableType.double:
    case RNJavaSerialisableType.nonnullDouble:
    case RNJavaSerialisableType.nonnullJavaFloat:
    case RNJavaSerialisableType.javaDouble:
      return method.defautlDouble;
  }
}

type PropSetter = {
  method: string;
  defaultValue: any;
};

class ViewManagerHolder
  extends NativeModuleHolder
  implements
    Partial<
      Omit<com.facebook.react.uimanager.ViewManager<any, any>, 'getConstants'>
    >
{
  props: {
    [name: string]: PropSetter;
  } = {};
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
  public viewManager = true;
  static id = 0;

  constructor(name) {
    super(name);
    for (const methodName in this.moduleMetadata.methods) {
      const method = this.moduleMetadata.methods[methodName];
      if (method.prop) {
        this.props[method.prop] = {
          method: methodName,
          defaultValue: getDefaultValue(method),
        };
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
        ).getExportedCustomDirectEventTypeConstants?.() || {}
      ) as any;
      this.bubblingEvents = toJSValue(
        (
          this.nativeModule as com.facebook.react.uimanager.ViewManager<
            any,
            any
          >
        ).getExportedCustomBubblingEventTypeConstants?.() || {}
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
      this[this.props[prop].method]?.(view, ...params);
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

const NATIVE_VIEW_CACHE = {};
export function requireNativeViewAndroid<T extends keyof ViewManagerInterfaces>(
  key: T
): RNNativeViewAndroid<T> {
  const ViewManager = ViewManagersAndroid[key as any];
  const isViewGroup = ViewManager.moduleMetadata.viewGroup;
  if (!ViewManager) {
    throw new Error(`ViewManager with name ${name} was not found.`);
  }
  if (NATIVE_VIEW_CACHE[key as string]) return NATIVE_VIEW_CACHE[key as string];
  const ViewClass = class extends (isViewGroup ? LayoutBase : View) {
    nativeProps: { [name: string]: any[] } = {};
    _viewTag: number;
    _viewManager: ViewManagerHolder = ViewManager;
    constructor() {
      super();
    }

    createNativeView() {
      this._viewTag = this._viewManager.__getViewId();
      const nativeView = this._viewManager._createViewInstance(this._viewTag);
      nativeView.setId(this._viewTag);
      this._viewManager.__registerView(this._viewTag, this);
      return nativeView;
    }

    initNativeView(): void {
      if (!this.nativeViewProtected) return;

      for (const prop in this._viewManager.props) {
        if (isNullOrUndefined(this.nativeProps[prop])) continue;
        this._viewManager.setNativeProp(
          this.nativeViewProtected,
          prop,
          isNullOrUndefined(this.nativeProps[prop])
            ? this._viewManager.props[prop].defaultValue
            : this.nativeProps[prop]
        );
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
  };

  // as unknown as Omit<typeof View, keyof ViewManagerInterfaces[T]> &
  // ViewManagerInterfaces[T];

  const viewManager = ViewManager as ViewManagerHolder;
  for (const prop in viewManager.props) {
    Object.defineProperty(ViewClass.prototype, prop, {
      set(newValue) {
        if (newValue === this.nativeProps[prop]) return;
        this.nativeProps[prop] =
          newValue === undefined
            ? this._viewManager.props[prop].defaultValue
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

  if (isViewGroup) {
    ViewClass.prototype._addViewToNativeVisualTree = function (child, atIndex) {
      if (child.nativeViewProtected) {
        this._viewManager.nativeModule.addView(
          this.nativeViewProtected,
          child.nativeViewProtected,
          atIndex
        );
        return true;
      }
      return false;
    };

    ViewClass.prototype._removeViewFromNativeVisualTree = function (child) {
      if (child.nativeViewProtected) {
        this._viewManager.nativeModule.removeView(
          this.nativeViewProtected,
          child.nativeViewProtected
        );
        return true;
      }
      return false;
    };
  }

  NATIVE_VIEW_CACHE[key as any] = ViewClass;
  return ViewClass as any;
}

const viewManagersProxyHandle: ProxyHandler<{}> = {
  get: (target, prop) => {
    if (target[prop]) return target[prop];
    if (!getCurrentBridge().isModuleAvailable(prop as string)) {
      console.warn(
        `Trying to get ViewManager "${
          prop as string
        }" that does not exist in the View Manager registry.`
      );
      return null;
    }
    return (target[prop] = new ViewManagerHolder(prop as string));
  },
};

export const ViewManagersAndroid = new Proxy({}, viewManagersProxyHandle);

global.__viewManagerProxy = ViewManagersAndroid;

export const load = () => null;

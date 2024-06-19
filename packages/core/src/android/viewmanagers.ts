/* eslint-disable @typescript-eslint/no-explicit-any */
import { LayoutBase, Utils, View } from '@nativescript/core';
import { RNJavaSerialisableType, isNullOrUndefined } from '../common';
import { getThemedReactContext, registerView } from './bridge';
import { toJSValue, toNativeValue } from './converter';
import { ModuleMetadata, getModuleClasses } from './metadata';
import { NativeModuleHolder } from './nativemodules';
import type { ViewManagers as ViewManagerInterfaces } from './view-manager-types';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RNNativeViewAndroid } from '@open-native/core';
import { ReadableArray } from './types';

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

  public getEvents(): any {
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

    const events = [];
    for (const name of Object.keys(this.directEvents)) {
      events.push(
        this.__getJSEventName(this.directEvents[name].registrationName)
      );
    }

    for (const name of Object.keys(this.bubblingEvents)) {
      events.push(
        this.__getJSEventName(
          this.bubblingEvents[name].phasedRegistrationNames.bubbled
        )
      );
    }

    return events;
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
      (
        this._viewManager
          .nativeModule as com.facebook.react.uimanager.ViewManager<any, any>
      ).addEventEmitters(
        this._viewManager.themedReactContext,
        this.nativeViewProtected
      );
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

  const viewManager = ViewManager as ViewManagerHolder;
  const events = viewManager.getEvents() || [];
  for (const event of events) {
    ViewClass[event + 'Event'] = event;
  }

  const commandsMap = (
    viewManager.nativeModule as com.facebook.react.uimanager.ViewManager<
      any,
      any
    >
  ).getCommandsMap();

  if (commandsMap) {
    const commandNames = Utils.android.collections.stringSetToStringArray(
      commandsMap.keySet()
    );
    const commands = {};
    for (const commandName of commandNames as string[]) {
      commands[commandName] = function (...args: any[]) {
        if (!this.nativeViewProtected) return;

        (
          viewManager.nativeModule as com.facebook.react.uimanager.ViewManager<
            any,
            any
          >
        ).receiveCommand(
          this.nativeViewProtected,
          commandName,
          toNativeValue(args || [], false) as ReadableArray
        );
      };
    }
    ViewClass.prototype['commands'] = commands;
  }

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

const ViewManagerInstances = {};
const ViewManagerModules = {};
for (const module of getModuleClasses() as string[]) {
  if (!module.startsWith('$$')) continue;
  Object.defineProperty(ViewManagerModules, module.slice(2), {
    get() {
      if (ViewManagerInstances[module]) return ViewManagerInstances[module];
      return (ViewManagerInstances[module] = new ViewManagerHolder(
        module as string
      ));
    },
  });
}
export const ViewManagersAndroid = ViewManagerModules;
global.__viewManagerProxy = ViewManagersAndroid;

export const load = () => null;

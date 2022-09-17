declare module com {
  export module bridge {
    export class Bridge {
      public static class: java.lang.Class<com.bridge.Bridge>;
      public static TAG: string;
      public static packages: java.util.List<com.facebook.react.ReactPackage>;
      public static modules: java.util.List<com.facebook.react.bridge.NativeModule>;
      public static getJSModule(param0: string): com.facebook.react.bridge.NativeModule;
      public static add(param0: com.facebook.react.ReactPackage): void;
      public static loadModules(param0: com.facebook.react.bridge.ReactApplicationContext): void;
      public constructor();
    }
  }
}

declare module com {
  export module bridge {
    export class BuildConfig {
      public static class: java.lang.Class<com.bridge.BuildConfig>;
      public static DEBUG: boolean;
      public static LIBRARY_PACKAGE_NAME: string;
      public static BUILD_TYPE: string;
      public constructor();
    }
  }
}

declare module com {
  export module facebook {
    export module proguard {
      export module annotations {
        export class KeepGettersAndSetters {
          public static class: java.lang.Class<com.facebook.proguard.annotations.KeepGettersAndSetters>;
          /**
           * Constructs a new instance of the com.facebook.proguard.annotations.KeepGettersAndSetters interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: {});
          public constructor();
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export class BuildConfig {
        public static class: java.lang.Class<com.facebook.react.BuildConfig>;
        public static DEBUG: boolean;
        public static LIBRARY_PACKAGE_NAME: string;
        public static BUILD_TYPE: string;
        public constructor();
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export class ReactPackage {
        public static class: java.lang.Class<com.facebook.react.ReactPackage>;
        /**
         * Constructs a new instance of the com.facebook.react.ReactPackage interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
         */
        public constructor(implementation: { createNativeModules(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.bridge.NativeModule>; createViewManagers(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.uimanager.ViewManager> });
        public constructor();
        public createNativeModules(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.bridge.NativeModule>;
        public createViewManagers(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.uimanager.ViewManager>;
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class ActivityEventListener {
          public static class: java.lang.Class<com.facebook.react.bridge.ActivityEventListener>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.ActivityEventListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: { onActivityResult(param0: globalAndroid.app.Activity, param1: number, param2: number, param3: globalAndroid.content.Intent): void; onNewIntent(param0: globalAndroid.content.Intent): void });
          public constructor();
          public onNewIntent(param0: globalAndroid.content.Intent): void;
          public onActivityResult(param0: globalAndroid.app.Activity, param1: number, param2: number, param3: globalAndroid.content.Intent): void;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class Arguments {
          public static class: java.lang.Class<com.facebook.react.bridge.Arguments>;
          public static fromBundle(param0: globalAndroid.os.Bundle): com.facebook.react.bridge.WritableMap;
          public static makeNativeArray(param0: any): com.facebook.react.bridge.WritableNativeArray;
          public static fromList(param0: java.util.List<any>): com.facebook.react.bridge.WritableArray;
          public static createMap(): com.facebook.react.bridge.WritableMap;
          public static fromArray(param0: any): com.facebook.react.bridge.WritableArray;
          public static makeNativeArray(param0: java.util.List<any>): com.facebook.react.bridge.WritableNativeArray;
          public static makeNativeMap(param0: java.util.Map<string, any>): com.facebook.react.bridge.WritableNativeMap;
          public static fromJavaArgs(param0: androidNative.Array<any>): com.facebook.react.bridge.WritableNativeArray;
          public static toBundle(param0: com.facebook.react.bridge.ReadableMap): globalAndroid.os.Bundle;
          public constructor();
          public static toList(param0: com.facebook.react.bridge.ReadableArray): java.util.ArrayList<any>;
          public static createArray(): com.facebook.react.bridge.WritableArray;
          public static makeNativeMap(param0: globalAndroid.os.Bundle): com.facebook.react.bridge.WritableNativeMap;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class AssertionException {
          public static class: java.lang.Class<com.facebook.react.bridge.AssertionException>;
          public constructor(param0: string);
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export abstract class BaseJavaModule extends com.facebook.react.bridge.NativeModule {
          public static class: java.lang.Class<com.facebook.react.bridge.BaseJavaModule>;
          public static METHOD_TYPE_ASYNC: string;
          public static METHOD_TYPE_PROMISE: string;
          public static METHOD_TYPE_SYNC: string;
          public getConstants(): java.util.Map<string, any>;
          public onCatalystInstanceDestroy(): void;
          public constructor();
          public canOverrideExistingModule(): boolean;
          public getName(): string;
          public initialize(): void;
          public hasConstants(): boolean;
          public invalidate(): void;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class Callback {
          public static class: java.lang.Class<com.facebook.react.bridge.Callback>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.Callback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: { invoke(param0: androidNative.Array<any>): void });
          public constructor();
          public invoke(param0: androidNative.Array<any>): void;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class CatalystInstance {
          public static class: java.lang.Class<com.facebook.react.bridge.CatalystInstance>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.CatalystInstance interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: { destroy(): void; isDestroyed(): boolean; getJSModule(param0: java.lang.Class<any>): com.facebook.react.bridge.JavaScriptModule; hasNativeModule(param0: java.lang.Class<any>): boolean; getNativeModule(param0: java.lang.Class<any>): com.facebook.react.bridge.NativeModule; getNativeModule(param0: string): com.facebook.react.bridge.NativeModule; getJSIModule(param0: com.facebook.react.bridge.JSIModuleType): com.facebook.react.bridge.JSIModule; getNativeModules(): java.util.Collection<com.facebook.react.bridge.NativeModule>; getJavaScriptContextHolder(): com.facebook.react.bridge.JavaScriptContextHolder; setTurboModuleManager(param0: com.facebook.react.bridge.JSIModule): void });
          public constructor();
          public destroy(): void;
          public getJSIModule(param0: com.facebook.react.bridge.JSIModuleType): com.facebook.react.bridge.JSIModule;
          public getNativeModule(param0: java.lang.Class<any>): com.facebook.react.bridge.NativeModule;
          public setTurboModuleManager(param0: com.facebook.react.bridge.JSIModule): void;
          public getJSModule(param0: java.lang.Class<any>): com.facebook.react.bridge.JavaScriptModule;
          public getNativeModule(param0: string): com.facebook.react.bridge.NativeModule;
          /** @deprecated */
          public getJavaScriptContextHolder(): com.facebook.react.bridge.JavaScriptContextHolder;
          public getNativeModules(): java.util.Collection<com.facebook.react.bridge.NativeModule>;
          public hasNativeModule(param0: java.lang.Class<any>): boolean;
          public isDestroyed(): boolean;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class Dynamic {
          public static class: java.lang.Class<com.facebook.react.bridge.Dynamic>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.Dynamic interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: { isNull(): boolean; asBoolean(): boolean; asDouble(): number; asInt(): number; asString(): string; asArray(): com.facebook.react.bridge.ReadableArray; asMap(): com.facebook.react.bridge.ReadableMap; getType(): com.facebook.react.bridge.ReadableType; recycle(): void });
          public constructor();
          public asMap(): com.facebook.react.bridge.ReadableMap;
          public asInt(): number;
          public recycle(): void;
          public asBoolean(): boolean;
          public isNull(): boolean;
          public asString(): string;
          public asArray(): com.facebook.react.bridge.ReadableArray;
          public getType(): com.facebook.react.bridge.ReadableType;
          public asDouble(): number;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class DynamicFromArray extends com.facebook.react.bridge.Dynamic {
          public static class: java.lang.Class<com.facebook.react.bridge.DynamicFromArray>;
          public asMap(): com.facebook.react.bridge.ReadableMap;
          public asInt(): number;
          public static create(param0: com.facebook.react.bridge.ReadableArray, param1: number): com.facebook.react.bridge.DynamicFromArray;
          public recycle(): void;
          public asBoolean(): boolean;
          public isNull(): boolean;
          public asString(): string;
          public asArray(): com.facebook.react.bridge.ReadableArray;
          public getType(): com.facebook.react.bridge.ReadableType;
          public asDouble(): number;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class DynamicFromMap extends com.facebook.react.bridge.Dynamic {
          public static class: java.lang.Class<com.facebook.react.bridge.DynamicFromMap>;
          public asMap(): com.facebook.react.bridge.ReadableMap;
          public asInt(): number;
          public static create(param0: com.facebook.react.bridge.ReadableMap, param1: string): com.facebook.react.bridge.DynamicFromMap;
          public recycle(): void;
          public asBoolean(): boolean;
          public isNull(): boolean;
          public asString(): string;
          public asArray(): com.facebook.react.bridge.ReadableArray;
          public getType(): com.facebook.react.bridge.ReadableType;
          public asDouble(): number;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class DynamicFromObject extends com.facebook.react.bridge.Dynamic {
          public static class: java.lang.Class<com.facebook.react.bridge.DynamicFromObject>;
          public asMap(): com.facebook.react.bridge.ReadableMap;
          public asInt(): number;
          public recycle(): void;
          public asBoolean(): boolean;
          public isNull(): boolean;
          public constructor(param0: any);
          public asString(): string;
          public asArray(): com.facebook.react.bridge.ReadableArray;
          public getType(): com.facebook.react.bridge.ReadableType;
          public asDouble(): number;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class JSIModule {
          public static class: java.lang.Class<com.facebook.react.bridge.JSIModule>;
          public constructor();
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class JSIModuleType {
          public static class: java.lang.Class<com.facebook.react.bridge.JSIModuleType>;
          public static TurboModuleManager: com.facebook.react.bridge.JSIModuleType;
          public static UIManager: com.facebook.react.bridge.JSIModuleType;
          public static valueOf(param0: string): com.facebook.react.bridge.JSIModuleType;
          public static values(): androidNative.Array<com.facebook.react.bridge.JSIModuleType>;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class JavaScriptContextHolder {
          public static class: java.lang.Class<com.facebook.react.bridge.JavaScriptContextHolder>;
          public constructor();
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class JavaScriptModule {
          public static class: java.lang.Class<com.facebook.react.bridge.JavaScriptModule>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.JavaScriptModule interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: {});
          public constructor();
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class LifecycleEventListener {
          public static class: java.lang.Class<com.facebook.react.bridge.LifecycleEventListener>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.LifecycleEventListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: { onHostResume(): void; onHostPause(): void; onHostDestroy(): void });
          public constructor();
          public onHostResume(): void;
          public onHostDestroy(): void;
          public onHostPause(): void;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class NativeModule {
          public static class: java.lang.Class<com.facebook.react.bridge.NativeModule>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.NativeModule interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: { getName(): string; initialize(): void; canOverrideExistingModule(): boolean; onCatalystInstanceDestroy(): void; invalidate(): void });
          public constructor();
          public onCatalystInstanceDestroy(): void;
          public getName(): string;
          public canOverrideExistingModule(): boolean;
          public initialize(): void;
          public invalidate(): void;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class NoSuchKeyException {
          public static class: java.lang.Class<com.facebook.react.bridge.NoSuchKeyException>;
          public constructor(param0: string);
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class Promise {
          public static class: java.lang.Class<com.facebook.react.bridge.Promise>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.Promise interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: {
            resolve(param0: any): void;
            reject(param0: string, param1: string): void;
            reject(param0: string, param1: java.lang.Throwable): void;
            reject(param0: string, param1: string, param2: java.lang.Throwable): void;
            reject(param0: java.lang.Throwable): void;
            reject(param0: java.lang.Throwable, param1: com.facebook.react.bridge.WritableMap): void;
            reject(param0: string, param1: com.facebook.react.bridge.WritableMap): void;
            reject(param0: string, param1: java.lang.Throwable, param2: com.facebook.react.bridge.WritableMap): void;
            reject(param0: string, param1: string, param2: com.facebook.react.bridge.WritableMap): void;
            reject(param0: string, param1: string, param2: java.lang.Throwable, param3: com.facebook.react.bridge.WritableMap): void;
            reject(param0: string): void;
          });
          public constructor();
          /** @deprecated */
          public reject(param0: string): void;
          public reject(param0: string, param1: string): void;
          public resolve(param0: any): void;
          public reject(param0: java.lang.Throwable): void;
          public reject(param0: string, param1: com.facebook.react.bridge.WritableMap): void;
          public reject(param0: string, param1: string, param2: com.facebook.react.bridge.WritableMap): void;
          public reject(param0: string, param1: java.lang.Throwable): void;
          public reject(param0: string, param1: string, param2: java.lang.Throwable): void;
          public reject(param0: string, param1: java.lang.Throwable, param2: com.facebook.react.bridge.WritableMap): void;
          public reject(param0: string, param1: string, param2: java.lang.Throwable, param3: com.facebook.react.bridge.WritableMap): void;
          public reject(param0: java.lang.Throwable, param1: com.facebook.react.bridge.WritableMap): void;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class ReactApplicationContext extends com.facebook.react.bridge.ReactContext {
          public static class: java.lang.Class<com.facebook.react.bridge.ReactApplicationContext>;
          public constructor(param0: globalAndroid.content.Context);
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class ReactContext {
          public static class: java.lang.Class<com.facebook.react.bridge.ReactContext>;
          public initializeWithInstance(param0: com.facebook.react.bridge.CatalystInstance): void;
          public getCatalystInstance(): com.facebook.react.bridge.CatalystInstance;
          public hasCurrentActivity(): boolean;
          public onWindowFocusChange(param0: boolean): void;
          public getJSIModule(param0: com.facebook.react.bridge.JSIModuleType): com.facebook.react.bridge.JSIModule;
          public runOnUiQueueThread(param0: java.lang.Runnable): void;
          public getSourceURL(): string;
          public onHostDestroy(): void;
          public hasNativeModule(param0: java.lang.Class<any>): boolean;
          /** @deprecated */
          public isBridgeless(): boolean;
          public onHostPause(): void;
          /** @deprecated */
          public hasActiveCatalystInstance(): boolean;
          public hasCatalystInstance(): boolean;
          public getJavaScriptContextHolder(): com.facebook.react.bridge.JavaScriptContextHolder;
          public destroy(): void;
          public removeActivityEventListener(param0: com.facebook.react.bridge.ActivityEventListener): void;
          public getLifecycleState(): com.facebook.react.common.LifecycleState;
          public onActivityResult(param0: globalAndroid.app.Activity, param1: number, param2: number, param3: globalAndroid.content.Intent): void;
          public startActivityForResult(param0: globalAndroid.content.Intent, param1: number, param2: globalAndroid.os.Bundle): boolean;
          public getNativeModules(): java.util.Collection<com.facebook.react.bridge.NativeModule>;
          public onHostResume(param0: globalAndroid.app.Activity): void;
          public getCurrentActivity(): globalAndroid.app.Activity;
          public getNativeModule(param0: java.lang.Class<any>): com.facebook.react.bridge.NativeModule;
          public getJSModule(param0: java.lang.Class<any>): com.facebook.react.bridge.JavaScriptModule;
          public removeLifecycleEventListener(param0: com.facebook.react.bridge.LifecycleEventListener): void;
          public addLifecycleEventListener(param0: com.facebook.react.bridge.LifecycleEventListener): void;
          public addActivityEventListener(param0: com.facebook.react.bridge.ActivityEventListener): void;
          public getSystemService(param0: string): any;
          public constructor(param0: globalAndroid.content.Context);
          public hasActiveReactInstance(): boolean;
          public addWindowFocusChangeListener(param0: com.facebook.react.bridge.WindowFocusChangeListener): void;
          public onNewIntent(param0: globalAndroid.app.Activity, param1: globalAndroid.content.Intent): void;
          public registerSegment(param0: number, param1: string, param2: com.facebook.react.bridge.Callback): void;
          public removeWindowFocusChangeListener(param0: com.facebook.react.bridge.WindowFocusChangeListener): void;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export abstract class ReactContextBaseJavaModule extends com.facebook.react.bridge.BaseJavaModule {
          public static class: java.lang.Class<com.facebook.react.bridge.ReactContextBaseJavaModule>;
          public getCurrentActivity(): globalAndroid.app.Activity;
          public getReactApplicationContext(): com.facebook.react.bridge.ReactApplicationContext;
          public onCatalystInstanceDestroy(): void;
          public constructor();
          public getName(): string;
          public canOverrideExistingModule(): boolean;
          public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
          public getReactApplicationContextIfActiveOrWarn(): com.facebook.react.bridge.ReactApplicationContext;
          public initialize(): void;
          public invalidate(): void;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class ReactMethod {
          public static class: java.lang.Class<com.facebook.react.bridge.ReactMethod>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.ReactMethod interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: { isBlockingSynchronousMethod(): boolean });
          public constructor();
          public isBlockingSynchronousMethod(): boolean;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class ReactNoCrashBridgeNotAllowedSoftException extends com.facebook.react.bridge.ReactNoCrashSoftException {
          public static class: java.lang.Class<com.facebook.react.bridge.ReactNoCrashBridgeNotAllowedSoftException>;
          public constructor(param0: string, param1: java.lang.Throwable);
          public constructor(param0: string);
          public constructor(param0: java.lang.Throwable);
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class ReactNoCrashSoftException {
          public static class: java.lang.Class<com.facebook.react.bridge.ReactNoCrashSoftException>;
          public constructor(param0: string, param1: java.lang.Throwable);
          public constructor(param0: string);
          public constructor(param0: java.lang.Throwable);
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class ReactSoftExceptionLogger {
          public static class: java.lang.Class<com.facebook.react.bridge.ReactSoftExceptionLogger>;
          public constructor();
          public static logSoftExceptionVerbose(param0: string, param1: java.lang.Throwable): void;
          public static addListener(param0: com.facebook.react.bridge.ReactSoftExceptionLogger.ReactSoftExceptionListener): void;
          public static logSoftException(param0: string, param1: java.lang.Throwable): void;
          public static removeListener(param0: com.facebook.react.bridge.ReactSoftExceptionLogger.ReactSoftExceptionListener): void;
          public static clearListeners(): void;
        }
        export module ReactSoftExceptionLogger {
          export class ReactSoftExceptionListener {
            public static class: java.lang.Class<com.facebook.react.bridge.ReactSoftExceptionLogger.ReactSoftExceptionListener>;
            /**
             * Constructs a new instance of the com.facebook.react.bridge.ReactSoftExceptionLogger$ReactSoftExceptionListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
             */
            public constructor(implementation: { logSoftException(param0: string, param1: java.lang.Throwable): void });
            public constructor();
            public logSoftException(param0: string, param1: java.lang.Throwable): void;
          }
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class ReadableArray {
          public static class: java.lang.Class<com.facebook.react.bridge.ReadableArray>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.ReadableArray interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: { size(): number; isNull(param0: number): boolean; getBoolean(param0: number): boolean; getDouble(param0: number): number; getInt(param0: number): number; getString(param0: number): string; getArray(param0: number): com.facebook.react.bridge.ReadableArray; getMap(param0: number): com.facebook.react.bridge.ReadableMap; getDynamic(param0: number): com.facebook.react.bridge.Dynamic; getType(param0: number): com.facebook.react.bridge.ReadableType; toArrayList(): java.util.ArrayList<any> });
          public constructor();
          public getDynamic(param0: number): com.facebook.react.bridge.Dynamic;
          public getInt(param0: number): number;
          public isNull(param0: number): boolean;
          public getDouble(param0: number): number;
          public getBoolean(param0: number): boolean;
          public toArrayList(): java.util.ArrayList<any>;
          public getArray(param0: number): com.facebook.react.bridge.ReadableArray;
          public getString(param0: number): string;
          public size(): number;
          public getMap(param0: number): com.facebook.react.bridge.ReadableMap;
          public getType(param0: number): com.facebook.react.bridge.ReadableType;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class ReadableMap {
          public static class: java.lang.Class<com.facebook.react.bridge.ReadableMap>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.ReadableMap interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: { hasKey(param0: string): boolean; isNull(param0: string): boolean; getBoolean(param0: string): boolean; getDouble(param0: string): number; getInt(param0: string): number; getString(param0: string): string; getArray(param0: string): com.facebook.react.bridge.ReadableArray; getMap(param0: string): com.facebook.react.bridge.ReadableMap; getDynamic(param0: string): com.facebook.react.bridge.Dynamic; getType(param0: string): com.facebook.react.bridge.ReadableType; getEntryIterator(): java.util.Iterator<java.util.Map.Entry<string, any>>; keySetIterator(): com.facebook.react.bridge.ReadableMapKeySetIterator; toHashMap(): java.util.HashMap<string, any> });
          public constructor();
          public getType(param0: string): com.facebook.react.bridge.ReadableType;
          public getInt(param0: string): number;
          public isNull(param0: string): boolean;
          public getString(param0: string): string;
          public keySetIterator(): com.facebook.react.bridge.ReadableMapKeySetIterator;
          public getBoolean(param0: string): boolean;
          public hasKey(param0: string): boolean;
          public getEntryIterator(): java.util.Iterator<java.util.Map.Entry<string, any>>;
          public getDynamic(param0: string): com.facebook.react.bridge.Dynamic;
          public toHashMap(): java.util.HashMap<string, any>;
          public getDouble(param0: string): number;
          public getMap(param0: string): com.facebook.react.bridge.ReadableMap;
          public getArray(param0: string): com.facebook.react.bridge.ReadableArray;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class ReadableMapKeySetIterator {
          public static class: java.lang.Class<com.facebook.react.bridge.ReadableMapKeySetIterator>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.ReadableMapKeySetIterator interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: { hasNextKey(): boolean; nextKey(): string });
          public constructor();
          public nextKey(): string;
          public hasNextKey(): boolean;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class ReadableNativeArray extends com.facebook.react.bridge.ReadableArray {
          public static class: java.lang.Class<com.facebook.react.bridge.ReadableNativeArray>;
          public mLocalArray: java.util.ArrayList<any>;
          public isNull(param0: number): boolean;
          public getDouble(param0: number): number;
          public toArrayList(): java.util.ArrayList<any>;
          public getString(param0: number): string;
          public size(): number;
          public getMap(param0: number): com.facebook.react.bridge.ReadableMap;
          public getType(param0: number): com.facebook.react.bridge.ReadableType;
          public getDynamic(param0: number): com.facebook.react.bridge.Dynamic;
          public equals(param0: any): boolean;
          public getInt(param0: number): number;
          public constructor();
          public getBoolean(param0: number): boolean;
          public getArray(param0: number): com.facebook.react.bridge.ReadableArray;
          public getArray(param0: number): com.facebook.react.bridge.ReadableNativeArray;
          public hashCode(): number;
          public getMap(param0: number): com.facebook.react.bridge.ReadableNativeMap;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class ReadableNativeMap extends com.facebook.react.bridge.ReadableMap {
          public static class: java.lang.Class<com.facebook.react.bridge.ReadableNativeMap>;
          public mLocalMap: java.util.HashMap<string, any>;
          public getType(param0: string): com.facebook.react.bridge.ReadableType;
          public getInt(param0: string): number;
          public isNull(param0: string): boolean;
          public getString(param0: string): string;
          public keySetIterator(): com.facebook.react.bridge.ReadableMapKeySetIterator;
          public equals(param0: any): boolean;
          public getBoolean(param0: string): boolean;
          public hasKey(param0: string): boolean;
          public constructor();
          public getEntryIterator(): java.util.Iterator<java.util.Map.Entry<string, any>>;
          public getDynamic(param0: string): com.facebook.react.bridge.Dynamic;
          public toHashMap(): java.util.HashMap<string, any>;
          public getDouble(param0: string): number;
          public getMap(param0: string): com.facebook.react.bridge.ReadableMap;
          public hashCode(): number;
          public getArray(param0: string): com.facebook.react.bridge.ReadableArray;
          public getMap(param0: string): com.facebook.react.bridge.ReadableNativeMap;
        }
        export module ReadableNativeMap {
          export class ReadableNativeMapKeySetIterator extends com.facebook.react.bridge.ReadableMapKeySetIterator {
            public static class: java.lang.Class<com.facebook.react.bridge.ReadableNativeMap.ReadableNativeMapKeySetIterator>;
            public constructor(param0: com.facebook.react.bridge.ReadableNativeMap);
            public nextKey(): string;
            public hasNextKey(): boolean;
          }
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class ReadableType {
          public static class: java.lang.Class<com.facebook.react.bridge.ReadableType>;
          public static Null: com.facebook.react.bridge.ReadableType;
          public static Boolean: com.facebook.react.bridge.ReadableType;
          public static Number: com.facebook.react.bridge.ReadableType;
          public static String: com.facebook.react.bridge.ReadableType;
          public static Map: com.facebook.react.bridge.ReadableType;
          public static Array: com.facebook.react.bridge.ReadableType;
          public static values(): androidNative.Array<com.facebook.react.bridge.ReadableType>;
          public static valueOf(param0: string): com.facebook.react.bridge.ReadableType;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class SoftAssertions {
          public static class: java.lang.Class<com.facebook.react.bridge.SoftAssertions>;
          public constructor();
          public static assertUnreachable(param0: string): void;
          public static assertNotNull(param0: any): any;
          public static assertCondition(param0: boolean, param1: string): void;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class UiThreadUtil {
          public static class: java.lang.Class<com.facebook.react.bridge.UiThreadUtil>;
          public static runOnUiThread(param0: java.lang.Runnable, param1: number): void;
          public constructor();
          public static assertNotOnUiThread(): void;
          public static assertOnUiThread(): void;
          public static runOnUiThread(param0: java.lang.Runnable): void;
          public static isOnUiThread(): boolean;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class UnexpectedNativeTypeException {
          public static class: java.lang.Class<com.facebook.react.bridge.UnexpectedNativeTypeException>;
          public constructor(param0: string);
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class WindowFocusChangeListener {
          public static class: java.lang.Class<com.facebook.react.bridge.WindowFocusChangeListener>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.WindowFocusChangeListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: { onWindowFocusChange(param0: boolean): void });
          public constructor();
          public onWindowFocusChange(param0: boolean): void;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class WritableArray extends com.facebook.react.bridge.ReadableArray {
          public static class: java.lang.Class<com.facebook.react.bridge.WritableArray>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.WritableArray interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: {
            pushNull(): void;
            pushBoolean(param0: boolean): void;
            pushDouble(param0: number): void;
            pushInt(param0: number): void;
            pushString(param0: string): void;
            pushArray(param0: com.facebook.react.bridge.ReadableArray): void;
            pushMap(param0: com.facebook.react.bridge.ReadableMap): void;
            size(): number;
            isNull(param0: number): boolean;
            getBoolean(param0: number): boolean;
            getDouble(param0: number): number;
            getInt(param0: number): number;
            getString(param0: number): string;
            getArray(param0: number): com.facebook.react.bridge.ReadableArray;
            getMap(param0: number): com.facebook.react.bridge.ReadableMap;
            getDynamic(param0: number): com.facebook.react.bridge.Dynamic;
            getType(param0: number): com.facebook.react.bridge.ReadableType;
            toArrayList(): java.util.ArrayList<any>;
          });
          public constructor();
          public isNull(param0: number): boolean;
          public getDouble(param0: number): number;
          public toArrayList(): java.util.ArrayList<any>;
          public getString(param0: number): string;
          public pushBoolean(param0: boolean): void;
          public size(): number;
          public getMap(param0: number): com.facebook.react.bridge.ReadableMap;
          public pushNull(): void;
          public getType(param0: number): com.facebook.react.bridge.ReadableType;
          public getDynamic(param0: number): com.facebook.react.bridge.Dynamic;
          public pushMap(param0: com.facebook.react.bridge.ReadableMap): void;
          public getInt(param0: number): number;
          public pushArray(param0: com.facebook.react.bridge.ReadableArray): void;
          public pushString(param0: string): void;
          public getBoolean(param0: number): boolean;
          public getArray(param0: number): com.facebook.react.bridge.ReadableArray;
          public pushDouble(param0: number): void;
          public pushInt(param0: number): void;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class WritableMap extends com.facebook.react.bridge.ReadableMap {
          public static class: java.lang.Class<com.facebook.react.bridge.WritableMap>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.WritableMap interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: {
            putNull(param0: string): void;
            putBoolean(param0: string, param1: boolean): void;
            putDouble(param0: string, param1: number): void;
            putInt(param0: string, param1: number): void;
            putString(param0: string, param1: string): void;
            putArray(param0: string, param1: com.facebook.react.bridge.ReadableArray): void;
            putMap(param0: string, param1: com.facebook.react.bridge.ReadableMap): void;
            merge(param0: com.facebook.react.bridge.ReadableMap): void;
            copy(): com.facebook.react.bridge.WritableMap;
            hasKey(param0: string): boolean;
            isNull(param0: string): boolean;
            getBoolean(param0: string): boolean;
            getDouble(param0: string): number;
            getInt(param0: string): number;
            getString(param0: string): string;
            getArray(param0: string): com.facebook.react.bridge.ReadableArray;
            getMap(param0: string): com.facebook.react.bridge.ReadableMap;
            getDynamic(param0: string): com.facebook.react.bridge.Dynamic;
            getType(param0: string): com.facebook.react.bridge.ReadableType;
            getEntryIterator(): java.util.Iterator<java.util.Map.Entry<string, any>>;
            keySetIterator(): com.facebook.react.bridge.ReadableMapKeySetIterator;
            toHashMap(): java.util.HashMap<string, any>;
          });
          public constructor();
          public putString(param0: string, param1: string): void;
          public getType(param0: string): com.facebook.react.bridge.ReadableType;
          public copy(): com.facebook.react.bridge.WritableMap;
          public getInt(param0: string): number;
          public isNull(param0: string): boolean;
          public getString(param0: string): string;
          public keySetIterator(): com.facebook.react.bridge.ReadableMapKeySetIterator;
          public putDouble(param0: string, param1: number): void;
          public putInt(param0: string, param1: number): void;
          public getBoolean(param0: string): boolean;
          public putMap(param0: string, param1: com.facebook.react.bridge.ReadableMap): void;
          public putNull(param0: string): void;
          public hasKey(param0: string): boolean;
          public getEntryIterator(): java.util.Iterator<java.util.Map.Entry<string, any>>;
          public putArray(param0: string, param1: com.facebook.react.bridge.ReadableArray): void;
          public getDynamic(param0: string): com.facebook.react.bridge.Dynamic;
          public toHashMap(): java.util.HashMap<string, any>;
          public getDouble(param0: string): number;
          public getMap(param0: string): com.facebook.react.bridge.ReadableMap;
          public putBoolean(param0: string, param1: boolean): void;
          public merge(param0: com.facebook.react.bridge.ReadableMap): void;
          public getArray(param0: string): com.facebook.react.bridge.ReadableArray;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class WritableNativeArray extends com.facebook.react.bridge.ReadableNativeArray implements com.facebook.react.bridge.WritableArray {
          public static class: java.lang.Class<com.facebook.react.bridge.WritableNativeArray>;
          public isNull(param0: number): boolean;
          public getDouble(param0: number): number;
          public toArrayList(): java.util.ArrayList<any>;
          public getString(param0: number): string;
          public pushBoolean(param0: boolean): void;
          public size(): number;
          public getMap(param0: number): com.facebook.react.bridge.ReadableMap;
          public pushNull(): void;
          public getType(param0: number): com.facebook.react.bridge.ReadableType;
          public getDynamic(param0: number): com.facebook.react.bridge.Dynamic;
          public pushMap(param0: com.facebook.react.bridge.ReadableMap): void;
          public getInt(param0: number): number;
          public pushArray(param0: com.facebook.react.bridge.ReadableArray): void;
          public constructor();
          public pushString(param0: string): void;
          public getBoolean(param0: number): boolean;
          public getArray(param0: number): com.facebook.react.bridge.ReadableArray;
          public getArray(param0: number): com.facebook.react.bridge.ReadableNativeArray;
          public pushDouble(param0: number): void;
          public pushInt(param0: number): void;
          public getMap(param0: number): com.facebook.react.bridge.ReadableNativeMap;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module bridge {
        export class WritableNativeMap extends com.facebook.react.bridge.ReadableNativeMap implements com.facebook.react.bridge.WritableMap {
          public static class: java.lang.Class<com.facebook.react.bridge.WritableNativeMap>;
          public putString(param0: string, param1: string): void;
          public getType(param0: string): com.facebook.react.bridge.ReadableType;
          public copy(): com.facebook.react.bridge.WritableMap;
          public getInt(param0: string): number;
          public isNull(param0: string): boolean;
          public getString(param0: string): string;
          public keySetIterator(): com.facebook.react.bridge.ReadableMapKeySetIterator;
          public putDouble(param0: string, param1: number): void;
          public putInt(param0: string, param1: number): void;
          public getBoolean(param0: string): boolean;
          public putMap(param0: string, param1: com.facebook.react.bridge.ReadableMap): void;
          public putNull(param0: string): void;
          public hasKey(param0: string): boolean;
          public constructor();
          public getEntryIterator(): java.util.Iterator<java.util.Map.Entry<string, any>>;
          public putArray(param0: string, param1: com.facebook.react.bridge.ReadableArray): void;
          public getDynamic(param0: string): com.facebook.react.bridge.Dynamic;
          public toHashMap(): java.util.HashMap<string, any>;
          public getDouble(param0: string): number;
          public getMap(param0: string): com.facebook.react.bridge.ReadableMap;
          public putBoolean(param0: string, param1: boolean): void;
          public merge(param0: com.facebook.react.bridge.ReadableMap): void;
          public getArray(param0: string): com.facebook.react.bridge.ReadableArray;
          public getMap(param0: string): com.facebook.react.bridge.ReadableNativeMap;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module common {
        export class LifecycleState {
          public static class: java.lang.Class<com.facebook.react.common.LifecycleState>;
          public static BEFORE_CREATE: com.facebook.react.common.LifecycleState;
          public static BEFORE_RESUME: com.facebook.react.common.LifecycleState;
          public static RESUMED: com.facebook.react.common.LifecycleState;
          public static valueOf(param0: string): com.facebook.react.common.LifecycleState;
          public static values(): androidNative.Array<com.facebook.react.common.LifecycleState>;
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module module {
        export module annotations {
          export class ReactModule {
            public static class: java.lang.Class<com.facebook.react.module.annotations.ReactModule>;
            /**
             * Constructs a new instance of the com.facebook.react.module.annotations.ReactModule interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
             */
            public constructor(implementation: { name(): string; canOverrideExistingModule(): boolean; needsEagerInit(): boolean; hasConstants(): boolean; isCxxModule(): boolean });
            public constructor();
            public name(): string;
            public canOverrideExistingModule(): boolean;
            public needsEagerInit(): boolean;
            public hasConstants(): boolean;
            public isCxxModule(): boolean;
          }
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module module {
        export module annotations {
          export class ReactModuleList {
            public static class: java.lang.Class<com.facebook.react.module.annotations.ReactModuleList>;
            /**
             * Constructs a new instance of the com.facebook.react.module.annotations.ReactModuleList interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
             */
            public constructor(implementation: { nativeModules(): androidNative.Array<java.lang.Class<any>> });
            public constructor();
            public nativeModules(): androidNative.Array<java.lang.Class<any>>;
          }
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module module {
        export module model {
          export class ReactModuleInfo {
            public static class: java.lang.Class<com.facebook.react.module.model.ReactModuleInfo>;
            public isTurboModule(): boolean;
            public constructor(param0: string, param1: string, param2: boolean, param3: boolean, param4: boolean, param5: boolean, param6: boolean);
            public name(): string;
            public className(): string;
            public canOverrideExistingModule(): boolean;
            public needsEagerInit(): boolean;
            public hasConstants(): boolean;
            public isCxxModule(): boolean;
          }
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module module {
        export module model {
          export class ReactModuleInfoProvider {
            public static class: java.lang.Class<com.facebook.react.module.model.ReactModuleInfoProvider>;
            /**
             * Constructs a new instance of the com.facebook.react.module.model.ReactModuleInfoProvider interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
             */
            public constructor(implementation: { getReactModuleInfos(): java.util.Map<string, com.facebook.react.module.model.ReactModuleInfo> });
            public constructor();
            public getReactModuleInfos(): java.util.Map<string, com.facebook.react.module.model.ReactModuleInfo>;
          }
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module modules {
        export module core {
          export class DeviceEventManagerModule extends com.facebook.react.bridge.ReactContextBaseJavaModule {
            public static class: java.lang.Class<com.facebook.react.modules.core.DeviceEventManagerModule>;
            public static NAME: string;
            public constructor();
            public invalidate(): void;
            public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
            public canOverrideExistingModule(): boolean;
            public initialize(): void;
            public onCatalystInstanceDestroy(): void;
            public getName(): string;
          }
          export module DeviceEventManagerModule {
            export class RCTDeviceEventEmitter extends com.facebook.react.bridge.JavaScriptModule {
              public static class: java.lang.Class<com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter>;
              /**
               * Constructs a new instance of the com.facebook.react.modules.core.DeviceEventManagerModule$RCTDeviceEventEmitter interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
               */
              public constructor(implementation: { emit(param0: string, param1: any): void });
              public constructor();
              public emit(param0: string, param1: any): void;
            }
          }
        }
      }
    }
  }
}

declare module com {
  export module facebook {
    export module react {
      export module uimanager {
        export class ViewManager {
          public static class: java.lang.Class<com.facebook.react.uimanager.ViewManager>;
          public constructor();
        }
      }
    }
  }
}

declare module com {
  export module testmodule {
    export class BuildConfig {
      public static class: java.lang.Class<com.testmodule.BuildConfig>;
      public static DEBUG: boolean;
      public static LIBRARY_PACKAGE_NAME: string;
      public static BUILD_TYPE: string;
      public constructor();
    }
  }
}

declare module com {
  export module testmodule {
    export class RNTestModule extends com.facebook.react.bridge.ReactContextBaseJavaModule {
      public static class: java.lang.Class<com.testmodule.RNTestModule>;
      public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
      public invalidate(): void;
      public getName(): string;
      public testCallback(param0: com.facebook.react.bridge.Callback): void;
      public testPromise(param0: com.facebook.react.bridge.Promise): void;
      public show(param0: string, param1: number): void;
      public initialize(): void;
      public constructor();
      public getConstants(): java.util.Map<string, any>;
      public onCatalystInstanceDestroy(): void;
      public canOverrideExistingModule(): boolean;
    }
  }
}

declare module com {
  export module testmodule {
    export class RNTestModulePackage extends com.facebook.react.ReactPackage {
      public static class: java.lang.Class<com.testmodule.RNTestModulePackage>;
      public createNativeModules(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.bridge.NativeModule>;
      public createViewManagers(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.uimanager.ViewManager>;
      public constructor();
    }
  }
}

//Generics information:

/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
/// <reference path="android-declarations.d.ts"/>

declare module com {
  export module bridge {
    export class Bridge {
      public static class: java.lang.Class<com.bridge.Bridge>;
      public TAG: string;
      public static packages: java.util.List<com.facebook.react.ReactPackage>;
      public static modules: java.util.List<com.facebook.react.bridge.NativeModule>;
      public static add(param0: com.facebook.react.ReactPackage): void;
      public getJSModule(param0: string): com.facebook.react.bridge.NativeModule;
      public loadAllRegisteredModules(param0: com.facebook.react.bridge.ReactApplicationContext): void;
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
        public constructor(implementation: { createNativeModules(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.bridge.NativeModule> });
        public constructor();
        public createNativeModules(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.bridge.NativeModule>;
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
        export class Promise {
          public static class: java.lang.Class<com.facebook.react.bridge.Promise>;
          /**
           * Constructs a new instance of the com.facebook.react.bridge.Promise interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
           */
          public constructor(implementation: { resolve(param0: any): void; reject(param0: string, param1: string): void; reject(param0: string, param1: java.lang.Throwable): void; reject(param0: string, param1: string, param2: java.lang.Throwable): void; reject(param0: java.lang.Throwable): void; reject(param0: string): void });
          public constructor();
          /** @deprecated */
          public reject(param0: string): void;
          public reject(param0: string, param1: string): void;
          public resolve(param0: any): void;
          public reject(param0: java.lang.Throwable): void;
          public reject(param0: string, param1: java.lang.Throwable): void;
          public reject(param0: string, param1: string, param2: java.lang.Throwable): void;
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
          public constructor(param0: globalAndroid.content.Context);
          public getCurrentActivity(): globalAndroid.app.Activity;
          public hasActiveReactInstance(): boolean;
          public hasCurrentActivity(): boolean;
          public onNewIntent(param0: globalAndroid.app.Activity, param1: globalAndroid.content.Intent): void;
          public onHostResume(param0: globalAndroid.app.Activity): void;
          public initialize(): void;
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
      public constructor();
    }
  }
}

//Generics information:

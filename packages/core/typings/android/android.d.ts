/// <reference path="android-declarations.d.ts"/>

declare module com {
	export module bridge {
		export class Bridge {
			public static class: java.lang.Class<com.bridge.Bridge>;
			public static TAG: string;
			public static packages: com.bridge.Packages;
			public modules: java.util.HashMap<string,com.facebook.react.bridge.NativeModule>;
			public reactContext: com.facebook.react.bridge.ReactApplicationContext;
			public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
			public getModuleByName(param0: string, param1: boolean): com.facebook.react.bridge.NativeModule;
			public loadModulesForPackage(param0: string): void;
			public loadModules(): void;
			public getModuleForClass(param0: java.lang.Class<any>, param1: boolean): com.facebook.react.bridge.NativeModule;
			public hasNativeModule(param0: java.lang.Class<any>): boolean;
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
	export module bridge {
		export class Packages {
			public static class: java.lang.Class<com.bridge.Packages>;
			public static list: java.util.List<com.facebook.react.ReactPackage>;
			public static moduleClasses: java.util.HashMap<string,java.lang.Class<any>>;
			public static modulePackageMap: java.util.HashMap<string,string>;
			public static init(): void;
			public constructor();
		}
	}
}

declare module com {
	export module facebook {
		export module fbreact {
			export module specs {
				export abstract class NativeAppStateSpec extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ReactModuleWithSpec, com.facebook.react.turbomodule.core.interfaces.TurboModule {
					public static class: java.lang.Class<com.facebook.fbreact.specs.NativeAppStateSpec>;
					public getConstants(): java.util.Map<string,any>;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public canOverrideExistingModule(): boolean;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public getCurrentAppState(param0: com.facebook.react.bridge.Callback, param1: com.facebook.react.bridge.Callback): void;
					public addListener(param0: string): void;
					public removeListeners(param0: number): void;
					public initialize(): void;
					public getTypedExportedConstants(): java.util.Map<string,any>;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module fbreact {
			export module specs {
				export abstract class NativeAppearanceSpec extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ReactModuleWithSpec, com.facebook.react.turbomodule.core.interfaces.TurboModule {
					public static class: java.lang.Class<com.facebook.fbreact.specs.NativeAppearanceSpec>;
					public getColorScheme(): string;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public canOverrideExistingModule(): boolean;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public addListener(param0: string): void;
					public removeListeners(param0: number): void;
					public initialize(): void;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module fbreact {
			export module specs {
				export abstract class NativeClipboardSpec extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ReactModuleWithSpec, com.facebook.react.turbomodule.core.interfaces.TurboModule {
					public static class: java.lang.Class<com.facebook.fbreact.specs.NativeClipboardSpec>;
					public setString(param0: string): void;
					public getString(param0: com.facebook.react.bridge.Promise): void;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public canOverrideExistingModule(): boolean;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public initialize(): void;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module fbreact {
			export module specs {
				export abstract class NativeDeviceEventManagerSpec extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ReactModuleWithSpec, com.facebook.react.turbomodule.core.interfaces.TurboModule {
					public static class: java.lang.Class<com.facebook.fbreact.specs.NativeDeviceEventManagerSpec>;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public canOverrideExistingModule(): boolean;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public invokeDefaultBackPressHandler(): void;
					public initialize(): void;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module fbreact {
			export module specs {
				export abstract class NativeDeviceInfoSpec extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ReactModuleWithSpec, com.facebook.react.turbomodule.core.interfaces.TurboModule {
					public static class: java.lang.Class<com.facebook.fbreact.specs.NativeDeviceInfoSpec>;
					public getConstants(): java.util.Map<string,any>;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public canOverrideExistingModule(): boolean;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public initialize(): void;
					public getTypedExportedConstants(): java.util.Map<string,any>;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module fbreact {
			export module specs {
				export abstract class NativeDialogManagerAndroidSpec extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ReactModuleWithSpec, com.facebook.react.turbomodule.core.interfaces.TurboModule {
					public static class: java.lang.Class<com.facebook.fbreact.specs.NativeDialogManagerAndroidSpec>;
					public showAlert(param0: com.facebook.react.bridge.ReadableMap, param1: com.facebook.react.bridge.Callback, param2: com.facebook.react.bridge.Callback): void;
					public getConstants(): java.util.Map<string,any>;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public canOverrideExistingModule(): boolean;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public initialize(): void;
					public getTypedExportedConstants(): java.util.Map<string,any>;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module fbreact {
			export module specs {
				export abstract class NativeHeadlessJsTaskSupportSpec extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ReactModuleWithSpec, com.facebook.react.turbomodule.core.interfaces.TurboModule {
					public static class: java.lang.Class<com.facebook.fbreact.specs.NativeHeadlessJsTaskSupportSpec>;
					public notifyTaskFinished(param0: number): void;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public canOverrideExistingModule(): boolean;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public notifyTaskRetry(param0: number, param1: com.facebook.react.bridge.Promise): void;
					public initialize(): void;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module fbreact {
			export module specs {
				export abstract class NativeIntentAndroidSpec extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ReactModuleWithSpec, com.facebook.react.turbomodule.core.interfaces.TurboModule {
					public static class: java.lang.Class<com.facebook.fbreact.specs.NativeIntentAndroidSpec>;
					public sendIntent(param0: string, param1: com.facebook.react.bridge.ReadableArray, param2: com.facebook.react.bridge.Promise): void;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public canOverrideExistingModule(): boolean;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public canOpenURL(param0: string, param1: com.facebook.react.bridge.Promise): void;
					public getInitialURL(param0: com.facebook.react.bridge.Promise): void;
					public openURL(param0: string, param1: com.facebook.react.bridge.Promise): void;
					public openSettings(param0: com.facebook.react.bridge.Promise): void;
					public initialize(): void;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module fbreact {
			export module specs {
				export abstract class NativeLinkingManagerSpec extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ReactModuleWithSpec, com.facebook.react.turbomodule.core.interfaces.TurboModule {
					public static class: java.lang.Class<com.facebook.fbreact.specs.NativeLinkingManagerSpec>;
					public canOverrideExistingModule(): boolean;
					public getInitialURL(param0: com.facebook.react.bridge.Promise): void;
					public openURL(param0: string, param1: com.facebook.react.bridge.Promise): void;
					public addListener(param0: string): void;
					public removeListeners(param0: number): void;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public canOpenURL(param0: string, param1: com.facebook.react.bridge.Promise): void;
					public openSettings(param0: com.facebook.react.bridge.Promise): void;
					public initialize(): void;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module fbreact {
			export module specs {
				export abstract class NativePermissionsAndroidSpec extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ReactModuleWithSpec, com.facebook.react.turbomodule.core.interfaces.TurboModule {
					public static class: java.lang.Class<com.facebook.fbreact.specs.NativePermissionsAndroidSpec>;
					public checkPermission(param0: string, param1: com.facebook.react.bridge.Promise): void;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public canOverrideExistingModule(): boolean;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public shouldShowRequestPermissionRationale(param0: string, param1: com.facebook.react.bridge.Promise): void;
					public requestPermission(param0: string, param1: com.facebook.react.bridge.Promise): void;
					public initialize(): void;
					public requestMultiplePermissions(param0: com.facebook.react.bridge.ReadableArray, param1: com.facebook.react.bridge.Promise): void;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module fbreact {
			export module specs {
				export abstract class NativePlatformConstantsAndroidSpec extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ReactModuleWithSpec, com.facebook.react.turbomodule.core.interfaces.TurboModule {
					public static class: java.lang.Class<com.facebook.fbreact.specs.NativePlatformConstantsAndroidSpec>;
					public getConstants(): java.util.Map<string,any>;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public canOverrideExistingModule(): boolean;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public getAndroidID(): string;
					public initialize(): void;
					public getTypedExportedConstants(): java.util.Map<string,any>;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module fbreact {
			export module specs {
				export abstract class NativeStatusBarManagerAndroidSpec extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ReactModuleWithSpec, com.facebook.react.turbomodule.core.interfaces.TurboModule {
					public static class: java.lang.Class<com.facebook.fbreact.specs.NativeStatusBarManagerAndroidSpec>;
					public getConstants(): java.util.Map<string,any>;
					public setStyle(param0: string): void;
					public setHidden(param0: boolean): void;
					public canOverrideExistingModule(): boolean;
					public setTranslucent(param0: boolean): void;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public setColor(param0: number, param1: boolean): void;
					public initialize(): void;
					public getTypedExportedConstants(): java.util.Map<string,any>;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module fbreact {
			export module specs {
				export abstract class NativeVibrationSpec extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ReactModuleWithSpec, com.facebook.react.turbomodule.core.interfaces.TurboModule {
					public static class: java.lang.Class<com.facebook.fbreact.specs.NativeVibrationSpec>;
					public vibrate(param0: number): void;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public canOverrideExistingModule(): boolean;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public cancel(): void;
					public vibrateByPattern(param0: com.facebook.react.bridge.ReadableArray, param1: number): void;
					public initialize(): void;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module fbreact {
			export module specs {
				export abstract class NativeWebSocketModuleSpec extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ReactModuleWithSpec, com.facebook.react.turbomodule.core.interfaces.TurboModule {
					public static class: java.lang.Class<com.facebook.fbreact.specs.NativeWebSocketModuleSpec>;
					public sendBinary(param0: string, param1: number): void;
					public canOverrideExistingModule(): boolean;
					public close(param0: number, param1: string, param2: number): void;
					public send(param0: string, param1: number): void;
					public addListener(param0: string): void;
					public removeListeners(param0: number): void;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public connect(param0: string, param1: com.facebook.react.bridge.ReadableArray, param2: com.facebook.react.bridge.ReadableMap, param3: number): void;
					public getName(): string;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public ping(param0: number): void;
					public initialize(): void;
					public invalidate(): void;
				}
			}
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
					public constructor(implementation: {
					});
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
			export abstract class HeadlessJsTaskService implements com.facebook.react.jstasks.HeadlessJsTaskEventListener {
				public static class: java.lang.Class<com.facebook.react.HeadlessJsTaskService>;
				public onHeadlessJsTaskFinish(param0: number): void;
				public onBind(param0: globalAndroid.content.Intent): globalAndroid.os.IBinder;
				public onStartCommand(param0: globalAndroid.content.Intent, param1: number, param2: number): number;
				public getTaskConfig(param0: globalAndroid.content.Intent): com.facebook.react.jstasks.HeadlessJsTaskConfig;
				public static acquireWakeLockNow(param0: globalAndroid.content.Context): void;
				public onHeadlessJsTaskStart(param0: number): void;
				public getReactNativeHost(): com.facebook.react.ReactNativeHost;
				public onDestroy(): void;
				public startTask(param0: com.facebook.react.jstasks.HeadlessJsTaskConfig): void;
				public constructor();
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export class RNCoreModulesPackage extends com.facebook.react.ReactPackage {
				public static class: java.lang.Class<com.facebook.react.RNCoreModulesPackage>;
				public createNativeModules(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.bridge.NativeModule>;
				public createViewManagers(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.uimanager.ViewManager<any,any>>;
				public constructor();
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export class ReactApplication {
				public static class: java.lang.Class<com.facebook.react.ReactApplication>;
				/**
				 * Constructs a new instance of the com.facebook.react.ReactApplication interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
				 */
				public constructor(implementation: {
					getReactNativeHost(): com.facebook.react.ReactNativeHost;
				});
				public constructor();
				public getReactNativeHost(): com.facebook.react.ReactNativeHost;
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export class ReactInstanceManager {
				public static class: java.lang.Class<com.facebook.react.ReactInstanceManager>;
				public addReactInstanceEventListener(param0: com.facebook.react.ReactInstanceManager.ReactInstanceEventListener): void;
				public hasStartedCreatingInitialContext(): boolean;
				public getCurrentReactContext(): com.facebook.react.bridge.ReactContext;
				public setupReactContext(param0: com.facebook.react.bridge.ReactApplicationContext): void;
				public removeReactInstanceEventListener(param0: com.facebook.react.ReactInstanceManager.ReactInstanceEventListener): void;
				public getJsExecutorName(): string;
				public createReactContextInBackground(): void;
			}
			export module ReactInstanceManager {
				export class ReactInstanceEventListener {
					public static class: java.lang.Class<com.facebook.react.ReactInstanceManager.ReactInstanceEventListener>;
					/**
					 * Constructs a new instance of the com.facebook.react.ReactInstanceManager$ReactInstanceEventListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onReactContextInitialized(param0: com.facebook.react.bridge.ReactContext): void;
					});
					public constructor();
					public onReactContextInitialized(param0: com.facebook.react.bridge.ReactContext): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export class ReactNativeHost {
				public static class: java.lang.Class<com.facebook.react.ReactNativeHost>;
				public constructor(param0: globalAndroid.app.Application);
				public createReactInstanceManager(): com.facebook.react.ReactInstanceManager;
				public clear(): void;
				public getReactInstanceManager(): com.facebook.react.ReactInstanceManager;
				public getApplication(): globalAndroid.app.Application;
				public getShouldRequireActivity(): boolean;
				public hasInstance(): boolean;
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
				public constructor(implementation: {
					createNativeModules(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.bridge.NativeModule>;
					createViewManagers(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.uimanager.ViewManager<any,any>>;
				});
				public constructor();
				public createNativeModules(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.bridge.NativeModule>;
				public createViewManagers(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.uimanager.ViewManager<any,any>>;
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export abstract class TurboReactPackage extends com.facebook.react.ReactPackage {
				public static class: java.lang.Class<com.facebook.react.TurboReactPackage>;
				public getModule(param0: string, param1: com.facebook.react.bridge.ReactApplicationContext): com.facebook.react.bridge.NativeModule;
				public getViewManagers(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.uimanager.ViewManager<any,any>>;
				public createNativeModules(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.bridge.NativeModule>;
				public createViewManagers(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.uimanager.ViewManager<any,any>>;
				public getReactModuleInfoProvider(): com.facebook.react.module.model.ReactModuleInfoProvider;
				public constructor();
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
					public constructor(implementation: {
						onActivityResult(param0: globalAndroid.app.Activity, param1: number, param2: number, param3: globalAndroid.content.Intent): void;
						onNewIntent(param0: globalAndroid.content.Intent): void;
					});
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
					public static makeNativeMap(param0: java.util.Map<string,any>): com.facebook.react.bridge.WritableNativeMap;
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
					public getConstants(): java.util.Map<string,any>;
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
					public constructor(implementation: {
						invoke(param0: androidNative.Array<any>): void;
					});
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
					public constructor(implementation: {
						destroy(): void;
						isDestroyed(): boolean;
						getJSModule(param0: java.lang.Class<any>): com.facebook.react.bridge.JavaScriptModule;
						hasNativeModule(param0: java.lang.Class<any>): boolean;
						getNativeModule(param0: java.lang.Class<any>): com.facebook.react.bridge.NativeModule;
						getNativeModule(param0: string): com.facebook.react.bridge.NativeModule;
						getJSIModule(param0: com.facebook.react.bridge.JSIModuleType): com.facebook.react.bridge.JSIModule;
						getNativeModules(): java.util.Collection<com.facebook.react.bridge.NativeModule>;
						getJavaScriptContextHolder(): com.facebook.react.bridge.JavaScriptContextHolder;
						setTurboModuleManager(param0: com.facebook.react.bridge.JSIModule): void;
						callFunction(param0: string, param1: string, param2: com.facebook.react.bridge.ReadableNativeArray): void;
					});
					public constructor();
					public destroy(): void;
					public callFunction(param0: string, param1: string, param2: com.facebook.react.bridge.ReadableNativeArray): void;
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
					public constructor(implementation: {
						isNull(): boolean;
						asBoolean(): boolean;
						asDouble(): number;
						asInt(): number;
						asString(): string;
						asArray(): com.facebook.react.bridge.ReadableArray;
						asMap(): com.facebook.react.bridge.ReadableMap;
						getType(): com.facebook.react.bridge.ReadableType;
						recycle(): void;
					});
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
				export abstract class GuardedAsyncTask<Params, Progress>  extends globalAndroid.os.AsyncTask<any,any,java.lang.Void> {
					public static class: java.lang.Class<com.facebook.react.bridge.GuardedAsyncTask<any,any>>;
					/** @deprecated */
					public constructor(param0: com.facebook.react.bridge.ReactContext);
					public doInBackgroundGuarded(param0: androidNative.Array<any>): void;
					public doInBackground(param0: androidNative.Array<any>): java.lang.Void;
					public constructor(param0: com.facebook.react.bridge.NativeModuleCallExceptionHandler);
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module bridge {
				export abstract class GuardedResultAsyncTask<Result>  extends globalAndroid.os.AsyncTask<java.lang.Void,java.lang.Void,any> {
					public static class: java.lang.Class<com.facebook.react.bridge.GuardedResultAsyncTask<any>>;
					/** @deprecated */
					public constructor(param0: com.facebook.react.bridge.ReactContext);
					public doInBackground(param0: androidNative.Array<java.lang.Void>): any;
					public constructor(param0: com.facebook.react.bridge.NativeModuleCallExceptionHandler);
					public onPostExecuteGuarded(param0: any): void;
					public onPostExecute(param0: any): void;
					public doInBackgroundGuarded(): any;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module bridge {
				export class JSApplicationCausedNativeException {
					public static class: java.lang.Class<com.facebook.react.bridge.JSApplicationCausedNativeException>;
					public constructor(param0: string, param1: java.lang.Throwable);
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
				export class JSApplicationIllegalArgumentException extends com.facebook.react.bridge.JSApplicationCausedNativeException {
					public static class: java.lang.Class<com.facebook.react.bridge.JSApplicationIllegalArgumentException>;
					public constructor(param0: string, param1: java.lang.Throwable);
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
				export class JSONUtils {
					public static class: java.lang.Class<com.facebook.react.bridge.JSONUtils>;
					public static fromHashMap(param0: java.util.Map<string,any>): com.facebook.react.bridge.WritableMap;
					public static fromArrayList(param0: java.util.List<any>): com.facebook.react.bridge.WritableArray;
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
				export class JavaOnlyArray implements com.facebook.react.bridge.ReadableArray, com.facebook.react.bridge.WritableArray {
					public static class: java.lang.Class<com.facebook.react.bridge.JavaOnlyArray>;
					public size(): number;
					public static from(param0: java.util.List<any>): com.facebook.react.bridge.JavaOnlyArray;
					public pushNull(): void;
					public getDynamic(param0: number): com.facebook.react.bridge.Dynamic;
					public static of(param0: androidNative.Array<any>): com.facebook.react.bridge.JavaOnlyArray;
					public toString(): string;
					public pushArray(param0: com.facebook.react.bridge.ReadableArray): void;
					public static deepClone(param0: com.facebook.react.bridge.ReadableArray): com.facebook.react.bridge.JavaOnlyArray;
					public constructor();
					public pushString(param0: string): void;
					public hashCode(): number;
					public isNull(param0: number): boolean;
					public getDouble(param0: number): number;
					public toArrayList(): java.util.ArrayList<any>;
					public getString(param0: number): string;
					public pushBoolean(param0: boolean): void;
					public getMap(param0: number): com.facebook.react.bridge.ReadableMap;
					public getType(param0: number): com.facebook.react.bridge.ReadableType;
					public equals(param0: any): boolean;
					public pushMap(param0: com.facebook.react.bridge.ReadableMap): void;
					public getInt(param0: number): number;
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
				export class JavaOnlyMap implements com.facebook.react.bridge.ReadableMap, com.facebook.react.bridge.WritableMap {
					public static class: java.lang.Class<com.facebook.react.bridge.JavaOnlyMap>;
					public getType(param0: string): com.facebook.react.bridge.ReadableType;
					public static of(param0: androidNative.Array<any>): com.facebook.react.bridge.JavaOnlyMap;
					public isNull(param0: string): boolean;
					public putDouble(param0: string, param1: number): void;
					public getBoolean(param0: string): boolean;
					public toString(): string;
					public putNull(param0: string): void;
					public constructor();
					public getDynamic(param0: string): com.facebook.react.bridge.Dynamic;
					public hashCode(): number;
					public putString(param0: string, param1: string): void;
					public getInt(param0: string): number;
					public copy(): com.facebook.react.bridge.WritableMap;
					public static deepClone(param0: com.facebook.react.bridge.ReadableMap): com.facebook.react.bridge.JavaOnlyMap;
					public getString(param0: string): string;
					public keySetIterator(): com.facebook.react.bridge.ReadableMapKeySetIterator;
					public putInt(param0: string, param1: number): void;
					public equals(param0: any): boolean;
					public putMap(param0: string, param1: com.facebook.react.bridge.ReadableMap): void;
					public hasKey(param0: string): boolean;
					public getEntryIterator(): java.util.Iterator<java.util.Map.Entry<string,any>>;
					public putArray(param0: string, param1: com.facebook.react.bridge.ReadableArray): void;
					public toHashMap(): java.util.HashMap<string,any>;
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
				export class JavaScriptContextHolder {
					public static class: java.lang.Class<com.facebook.react.bridge.JavaScriptContextHolder>;
					public constructor();
					public get(): number;
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
					public constructor(implementation: {
					});
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
					public constructor(implementation: {
						onHostResume(): void;
						onHostPause(): void;
						onHostDestroy(): void;
					});
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
					public constructor(implementation: {
						getName(): string;
						initialize(): void;
						canOverrideExistingModule(): boolean;
						onCatalystInstanceDestroy(): void;
						invalidate(): void;
					});
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
				export class NativeModuleCallExceptionHandler {
					public static class: java.lang.Class<com.facebook.react.bridge.NativeModuleCallExceptionHandler>;
					/**
					 * Constructs a new instance of the com.facebook.react.bridge.NativeModuleCallExceptionHandler interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						handleException(param0: java.lang.Exception): void;
					});
					public constructor();
					public handleException(param0: java.lang.Exception): void;
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
				export class PromiseImpl extends com.facebook.react.bridge.Promise {
					public static class: java.lang.Class<com.facebook.react.bridge.PromiseImpl>;
					public constructor(param0: com.facebook.react.bridge.Callback, param1: com.facebook.react.bridge.Callback);
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
					public setNativeModuleCallExceptionHandler(param0: com.facebook.react.bridge.NativeModuleCallExceptionHandler): void;
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
					public handleException(param0: java.lang.Exception): void;
					public hasActiveReactInstance(): boolean;
					public addWindowFocusChangeListener(param0: com.facebook.react.bridge.WindowFocusChangeListener): void;
					public setCurrentActivity(param0: globalAndroid.app.Activity): void;
					public onNewIntent(param0: globalAndroid.app.Activity, param1: globalAndroid.content.Intent): void;
					public getExceptionHandler(): com.facebook.react.bridge.NativeModuleCallExceptionHandler;
					public registerSegment(param0: number, param1: string, param2: com.facebook.react.bridge.Callback): void;
					public removeWindowFocusChangeListener(param0: com.facebook.react.bridge.WindowFocusChangeListener): void;
				}
				export module ReactContext {
					export class ExceptionHandlerWrapper extends com.facebook.react.bridge.NativeModuleCallExceptionHandler {
						public static class: java.lang.Class<com.facebook.react.bridge.ReactContext.ExceptionHandlerWrapper>;
						public handleException(param0: java.lang.Exception): void;
						public constructor(param0: com.facebook.react.bridge.ReactContext);
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
					public constructor(implementation: {
						isBlockingSynchronousMethod(): boolean;
					});
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
				export class ReactModuleWithSpec {
					public static class: java.lang.Class<com.facebook.react.bridge.ReactModuleWithSpec>;
					/**
					 * Constructs a new instance of the com.facebook.react.bridge.ReactModuleWithSpec interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
					});
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
						public constructor(implementation: {
							logSoftException(param0: string, param1: java.lang.Throwable): void;
						});
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
					public constructor(implementation: {
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
					public constructor(implementation: {
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
						getEntryIterator(): java.util.Iterator<java.util.Map.Entry<string,any>>;
						keySetIterator(): com.facebook.react.bridge.ReadableMapKeySetIterator;
						toHashMap(): java.util.HashMap<string,any>;
					});
					public constructor();
					public getType(param0: string): com.facebook.react.bridge.ReadableType;
					public getInt(param0: string): number;
					public isNull(param0: string): boolean;
					public getString(param0: string): string;
					public keySetIterator(): com.facebook.react.bridge.ReadableMapKeySetIterator;
					public getBoolean(param0: string): boolean;
					public hasKey(param0: string): boolean;
					public getEntryIterator(): java.util.Iterator<java.util.Map.Entry<string,any>>;
					public getDynamic(param0: string): com.facebook.react.bridge.Dynamic;
					public toHashMap(): java.util.HashMap<string,any>;
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
					public constructor(implementation: {
						hasNextKey(): boolean;
						nextKey(): string;
					});
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
					public mLocalMap: java.util.HashMap<string,any>;
					public getType(param0: string): com.facebook.react.bridge.ReadableType;
					public getInt(param0: string): number;
					public isNull(param0: string): boolean;
					public getString(param0: string): string;
					public keySetIterator(): com.facebook.react.bridge.ReadableMapKeySetIterator;
					public equals(param0: any): boolean;
					public getBoolean(param0: string): boolean;
					public hasKey(param0: string): boolean;
					public constructor();
					public getEntryIterator(): java.util.Iterator<java.util.Map.Entry<string,any>>;
					public getDynamic(param0: string): com.facebook.react.bridge.Dynamic;
					public toHashMap(): java.util.HashMap<string,any>;
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
					public constructor(implementation: {
						onWindowFocusChange(param0: boolean): void;
					});
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
						getEntryIterator(): java.util.Iterator<java.util.Map.Entry<string,any>>;
						keySetIterator(): com.facebook.react.bridge.ReadableMapKeySetIterator;
						toHashMap(): java.util.HashMap<string,any>;
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
					public getEntryIterator(): java.util.Iterator<java.util.Map.Entry<string,any>>;
					public putArray(param0: string, param1: com.facebook.react.bridge.ReadableArray): void;
					public getDynamic(param0: string): com.facebook.react.bridge.Dynamic;
					public toHashMap(): java.util.HashMap<string,any>;
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
					public getEntryIterator(): java.util.Iterator<java.util.Map.Entry<string,any>>;
					public putArray(param0: string, param1: com.facebook.react.bridge.ReadableArray): void;
					public getDynamic(param0: string): com.facebook.react.bridge.Dynamic;
					public toHashMap(): java.util.HashMap<string,any>;
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
			export module common {
				export class MapBuilder {
					public static class: java.lang.Class<com.facebook.react.common.MapBuilder>;
					public static of(param0: any, param1: any): java.util.Map<any,any>;
					public static of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any, param12: any, param13: any): java.util.Map<any,any>;
					public static of(param0: any, param1: any, param2: any, param3: any): java.util.Map<any,any>;
					public static of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any): java.util.Map<any,any>;
					public static newHashMap(): java.util.HashMap<any,any>;
					public constructor();
					public static builder(): com.facebook.react.common.MapBuilder.Builder<any,any>;
					public static of(): java.util.Map<any,any>;
					public static of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any): java.util.Map<any,any>;
					public static of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any): java.util.Map<any,any>;
					public static of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any): java.util.Map<any,any>;
				}
				export module MapBuilder {
					export class Builder<K, V>  extends java.lang.Object {
						public static class: java.lang.Class<com.facebook.react.common.MapBuilder.Builder<any,any>>;
						public build(): java.util.Map<K,V>;
						public put(param0: K, param1: V): com.facebook.react.common.MapBuilder.Builder<K,V>;
					}
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module common {
				export class ReactConstants {
					public static class: java.lang.Class<com.facebook.react.common.ReactConstants>;
					public static TAG: string;
					public constructor();
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module common {
				export class SystemClock {
					public static class: java.lang.Class<com.facebook.react.common.SystemClock>;
					public static uptimeMillis(): number;
					public constructor();
					public static currentTimeMillis(): number;
					public static nanoTime(): number;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module common {
				export module annotations {
					export class VisibleForTesting {
						public static class: java.lang.Class<com.facebook.react.common.annotations.VisibleForTesting>;
						/**
						 * Constructs a new instance of the com.facebook.react.common.annotations.VisibleForTesting interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
						});
						public constructor();
					}
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module common {
				export module build {
					export class ReactBuildConfig {
						public static class: java.lang.Class<com.facebook.react.common.build.ReactBuildConfig>;
						public static DEBUG: boolean;
						public static IS_INTERNAL_BUILD: boolean;
						public constructor();
					}
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module jstasks {
				export class HeadlessJsTaskConfig {
					public static class: java.lang.Class<com.facebook.react.jstasks.HeadlessJsTaskConfig>;
					public constructor(param0: com.facebook.react.jstasks.HeadlessJsTaskConfig);
					public constructor(param0: string, param1: com.facebook.react.bridge.WritableMap, param2: number);
					public constructor(param0: string, param1: com.facebook.react.bridge.WritableMap);
					public constructor(param0: string, param1: com.facebook.react.bridge.WritableMap, param2: number, param3: boolean, param4: com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy);
					public constructor(param0: string, param1: com.facebook.react.bridge.WritableMap, param2: number, param3: boolean);
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module jstasks {
				export class HeadlessJsTaskContext {
					public static class: java.lang.Class<com.facebook.react.jstasks.HeadlessJsTaskContext>;
					public addTaskEventListener(param0: com.facebook.react.jstasks.HeadlessJsTaskEventListener): void;
					public isTaskRunning(param0: number): boolean;
					public static getInstance(param0: com.facebook.react.bridge.ReactContext): com.facebook.react.jstasks.HeadlessJsTaskContext;
					public retryTask(param0: number): boolean;
					public finishTask(param0: number): void;
					public hasActiveTasks(): boolean;
					public removeTaskEventListener(param0: com.facebook.react.jstasks.HeadlessJsTaskEventListener): void;
					public startTask(param0: com.facebook.react.jstasks.HeadlessJsTaskConfig): number;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module jstasks {
				export class HeadlessJsTaskEventListener {
					public static class: java.lang.Class<com.facebook.react.jstasks.HeadlessJsTaskEventListener>;
					/**
					 * Constructs a new instance of the com.facebook.react.jstasks.HeadlessJsTaskEventListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onHeadlessJsTaskStart(param0: number): void;
						onHeadlessJsTaskFinish(param0: number): void;
					});
					public constructor();
					public onHeadlessJsTaskStart(param0: number): void;
					public onHeadlessJsTaskFinish(param0: number): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module jstasks {
				export class HeadlessJsTaskRetryPolicy {
					public static class: java.lang.Class<com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy>;
					/**
					 * Constructs a new instance of the com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						canRetry(): boolean;
						getDelay(): number;
						update(): com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy;
						copy(): com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy;
					});
					public constructor();
					public getDelay(): number;
					public canRetry(): boolean;
					public update(): com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy;
					public copy(): com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module jstasks {
				export class LinearCountingRetryPolicy extends com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy {
					public static class: java.lang.Class<com.facebook.react.jstasks.LinearCountingRetryPolicy>;
					public getDelay(): number;
					public canRetry(): boolean;
					public update(): com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy;
					public copy(): com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy;
					public constructor(param0: number, param1: number);
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module jstasks {
				export class NoRetryPolicy extends com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy {
					public static class: java.lang.Class<com.facebook.react.jstasks.NoRetryPolicy>;
					public static INSTANCE: com.facebook.react.jstasks.NoRetryPolicy;
					public getDelay(): number;
					public canRetry(): boolean;
					public update(): com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy;
					public copy(): com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy;
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
						public constructor(implementation: {
							name(): string;
							canOverrideExistingModule(): boolean;
							needsEagerInit(): boolean;
							hasConstants(): boolean;
							isCxxModule(): boolean;
						});
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
						public constructor(implementation: {
							nativeModules(): androidNative.Array<java.lang.Class<any>>;
						});
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
						public constructor(implementation: {
							getReactModuleInfos(): java.util.Map<string,com.facebook.react.module.model.ReactModuleInfo>;
						});
						public constructor();
						public getReactModuleInfos(): java.util.Map<string,com.facebook.react.module.model.ReactModuleInfo>;
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
				export module appregistry {
					export class AppRegistry extends com.facebook.react.bridge.JavaScriptModule {
						public static class: java.lang.Class<com.facebook.react.modules.appregistry.AppRegistry>;
						/**
						 * Constructs a new instance of the com.facebook.react.modules.appregistry.AppRegistry interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							runApplication(param0: string, param1: com.facebook.react.bridge.WritableMap): void;
							unmountApplicationComponentAtRootTag(param0: number): void;
							startHeadlessTask(param0: number, param1: string, param2: com.facebook.react.bridge.WritableMap): void;
						});
						public constructor();
						public unmountApplicationComponentAtRootTag(param0: number): void;
						public runApplication(param0: string, param1: com.facebook.react.bridge.WritableMap): void;
						public startHeadlessTask(param0: number, param1: string, param2: com.facebook.react.bridge.WritableMap): void;
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
				export module common {
					export class ModuleDataCleaner {
						public static class: java.lang.Class<com.facebook.react.modules.common.ModuleDataCleaner>;
						public constructor();
						public static cleanDataFromModules(param0: com.facebook.react.bridge.CatalystInstance): void;
					}
					export module ModuleDataCleaner {
						export class Cleanable {
							public static class: java.lang.Class<com.facebook.react.modules.common.ModuleDataCleaner.Cleanable>;
							/**
							 * Constructs a new instance of the com.facebook.react.modules.common.ModuleDataCleaner$Cleanable interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
								clearSensitiveData(): void;
							});
							public constructor();
							public clearSensitiveData(): void;
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
							public constructor(implementation: {
								emit(param0: string, param1: any): void;
							});
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
			export module modules {
				export module core {
					export class HeadlessJsTaskSupportModule extends com.facebook.fbreact.specs.NativeHeadlessJsTaskSupportSpec {
						public static class: java.lang.Class<com.facebook.react.modules.core.HeadlessJsTaskSupportModule>;
						public static NAME: string;
						public constructor();
						public invalidate(): void;
						public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
						public canOverrideExistingModule(): boolean;
						public initialize(): void;
						public onCatalystInstanceDestroy(): void;
						public notifyTaskRetry(param0: number, param1: com.facebook.react.bridge.Promise): void;
						public notifyTaskFinished(param0: number): void;
						public getName(): string;
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
					export class PermissionAwareActivity {
						public static class: java.lang.Class<com.facebook.react.modules.core.PermissionAwareActivity>;
						/**
						 * Constructs a new instance of the com.facebook.react.modules.core.PermissionAwareActivity interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							checkPermission(param0: string, param1: number, param2: number): number;
							checkSelfPermission(param0: string): number;
							shouldShowRequestPermissionRationale(param0: string): boolean;
							requestPermissions(param0: androidNative.Array<string>, param1: number, param2: com.facebook.react.modules.core.PermissionListener): void;
						});
						public constructor();
						public checkSelfPermission(param0: string): number;
						public checkPermission(param0: string, param1: number, param2: number): number;
						public requestPermissions(param0: androidNative.Array<string>, param1: number, param2: com.facebook.react.modules.core.PermissionListener): void;
						public shouldShowRequestPermissionRationale(param0: string): boolean;
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
					export class PermissionListener {
						public static class: java.lang.Class<com.facebook.react.modules.core.PermissionListener>;
						/**
						 * Constructs a new instance of the com.facebook.react.modules.core.PermissionListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							onRequestPermissionsResult(param0: number, param1: androidNative.Array<string>, param2: androidNative.Array<number>): boolean;
						});
						public constructor();
						public onRequestPermissionsResult(param0: number, param1: androidNative.Array<string>, param2: androidNative.Array<number>): boolean;
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
					export class RCTNativeAppEventEmitter extends com.facebook.react.bridge.JavaScriptModule {
						public static class: java.lang.Class<com.facebook.react.modules.core.RCTNativeAppEventEmitter>;
						/**
						 * Constructs a new instance of the com.facebook.react.modules.core.RCTNativeAppEventEmitter interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							emit(param0: string, param1: any): void;
						});
						public constructor();
						public emit(param0: string, param1: any): void;
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
				export module dialog {
					export class AlertFragment {
						public static class: java.lang.Class<com.facebook.react.modules.dialog.AlertFragment>;
						public constructor();
						public constructor(param0: com.facebook.react.modules.dialog.DialogModule.AlertFragmentListener, param1: globalAndroid.os.Bundle);
						public onDismiss(param0: globalAndroid.content.DialogInterface): void;
						public onClick(param0: globalAndroid.content.DialogInterface, param1: number): void;
						public onCreateDialog(param0: globalAndroid.os.Bundle): globalAndroid.app.Dialog;
						public static createDialog(param0: globalAndroid.content.Context, param1: globalAndroid.os.Bundle, param2: globalAndroid.content.DialogInterface.OnClickListener): globalAndroid.app.Dialog;
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
				export module dialog {
					export class DialogModule extends com.facebook.fbreact.specs.NativeDialogManagerAndroidSpec implements com.facebook.react.bridge.LifecycleEventListener {
						public static class: java.lang.Class<com.facebook.react.modules.dialog.DialogModule>;
						public static NAME: string;
						public constructor();
						public onHostDestroy(): void;
						public invalidate(): void;
						public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
						public canOverrideExistingModule(): boolean;
						public initialize(): void;
						public getTypedExportedConstants(): java.util.Map<string,any>;
						public showAlert(param0: com.facebook.react.bridge.ReadableMap, param1: com.facebook.react.bridge.Callback, param2: com.facebook.react.bridge.Callback): void;
						public onCatalystInstanceDestroy(): void;
						public onHostResume(): void;
						public getName(): string;
						public onHostPause(): void;
					}
					export module DialogModule {
						export class AlertFragmentListener {
							public static class: java.lang.Class<com.facebook.react.modules.dialog.DialogModule.AlertFragmentListener>;
							public onDismiss(param0: globalAndroid.content.DialogInterface): void;
							public onClick(param0: globalAndroid.content.DialogInterface, param1: number): void;
							public constructor(param0: com.facebook.react.modules.dialog.DialogModule, param1: com.facebook.react.bridge.Callback);
						}
						export class FragmentManagerHelper {
							public static class: java.lang.Class<com.facebook.react.modules.dialog.DialogModule.FragmentManagerHelper>;
							public showNewAlert(param0: globalAndroid.os.Bundle, param1: com.facebook.react.bridge.Callback): void;
							public constructor(param0: com.facebook.react.modules.dialog.DialogModule, param1: androidx.fragment.app.FragmentManager);
							public showPendingAlert(): void;
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
			export module modules {
				export module intent {
					export class IntentModule extends com.facebook.fbreact.specs.NativeIntentAndroidSpec {
						public static class: java.lang.Class<com.facebook.react.modules.intent.IntentModule>;
						public static NAME: string;
						public constructor();
						public getInitialURL(param0: com.facebook.react.bridge.Promise): void;
						public canOpenURL(param0: string, param1: com.facebook.react.bridge.Promise): void;
						public invalidate(): void;
						public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
						public openSettings(param0: com.facebook.react.bridge.Promise): void;
						public sendIntent(param0: string, param1: com.facebook.react.bridge.ReadableArray, param2: com.facebook.react.bridge.Promise): void;
						public canOverrideExistingModule(): boolean;
						public initialize(): void;
						public openURL(param0: string, param1: com.facebook.react.bridge.Promise): void;
						public onCatalystInstanceDestroy(): void;
						public getName(): string;
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
				export module permissions {
					export class PermissionsModule extends com.facebook.fbreact.specs.NativePermissionsAndroidSpec implements com.facebook.react.modules.core.PermissionListener {
						public static class: java.lang.Class<com.facebook.react.modules.permissions.PermissionsModule>;
						public static NAME: string;
						public requestMultiplePermissions(param0: com.facebook.react.bridge.ReadableArray, param1: com.facebook.react.bridge.Promise): void;
						public shouldShowRequestPermissionRationale(param0: string, param1: com.facebook.react.bridge.Promise): void;
						public constructor();
						public invalidate(): void;
						public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
						public canOverrideExistingModule(): boolean;
						public initialize(): void;
						public onCatalystInstanceDestroy(): void;
						public getName(): string;
						public checkPermission(param0: string, param1: com.facebook.react.bridge.Promise): void;
						public requestPermission(param0: string, param1: com.facebook.react.bridge.Promise): void;
						public onRequestPermissionsResult(param0: number, param1: androidNative.Array<string>, param2: androidNative.Array<number>): boolean;
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
				export module systeminfo {
					export class AndroidInfoHelpers {
						public static class: java.lang.Class<com.facebook.react.modules.systeminfo.AndroidInfoHelpers>;
						public static EMULATOR_LOCALHOST: string;
						public static GENYMOTION_LOCALHOST: string;
						public static DEVICE_LOCALHOST: string;
						public static METRO_HOST_PROP_NAME: string;
						public static getAdbReverseTcpCommand(param0: java.lang.Integer): string;
						public constructor();
						public static getInspectorProxyHost(param0: globalAndroid.content.Context): string;
						public static getFriendlyDeviceName(): string;
						public static getServerHost(param0: java.lang.Integer): string;
						public static getServerHost(param0: globalAndroid.content.Context): string;
						public static getAdbReverseTcpCommand(param0: globalAndroid.content.Context): string;
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
				export module systeminfo {
					export class AndroidInfoModule extends com.facebook.fbreact.specs.NativePlatformConstantsAndroidSpec implements com.facebook.react.turbomodule.core.interfaces.TurboModule {
						public static class: java.lang.Class<com.facebook.react.modules.systeminfo.AndroidInfoModule>;
						public static NAME: string;
						public constructor();
						public invalidate(): void;
						public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
						public canOverrideExistingModule(): boolean;
						public initialize(): void;
						public getTypedExportedConstants(): java.util.Map<string,any>;
						public onCatalystInstanceDestroy(): void;
						public getAndroidID(): string;
						public getName(): string;
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
				export module systeminfo {
					export class ReactNativeVersion {
						public static class: java.lang.Class<com.facebook.react.modules.systeminfo.ReactNativeVersion>;
						public static VERSION: java.util.Map<string,any>;
						public constructor();
					}
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module turbomodule {
				export module core {
					export module interfaces {
						export class TurboModule {
							public static class: java.lang.Class<com.facebook.react.turbomodule.core.interfaces.TurboModule>;
							/**
							 * Constructs a new instance of the com.facebook.react.turbomodule.core.interfaces.TurboModule interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
								initialize(): void;
								invalidate(): void;
							});
							public constructor();
							public initialize(): void;
							public invalidate(): void;
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
				export abstract class BaseViewManager<T, C>  extends com.facebook.react.uimanager.ViewManager<any,any> {
					public static class: java.lang.Class<com.facebook.react.uimanager.BaseViewManager<any,any>>;
					public onCatalystInstanceDestroy(): void;
					public constructor();
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
			export module uimanager {
				export class DisplayMetricsHolder {
					public static class: java.lang.Class<com.facebook.react.uimanager.DisplayMetricsHolder>;
					public static setScreenDisplayMetrics(param0: globalAndroid.util.DisplayMetrics): void;
					public static getScreenDisplayMetrics(): globalAndroid.util.DisplayMetrics;
					/** @deprecated */
					public static setWindowDisplayMetrics(param0: globalAndroid.util.DisplayMetrics): void;
					/** @deprecated */
					public static getWindowDisplayMetrics(): globalAndroid.util.DisplayMetrics;
					public constructor();
					public static getDisplayMetricsWritableMap(param0: number): com.facebook.react.bridge.WritableMap;
					public static initDisplayMetrics(param0: globalAndroid.content.Context): void;
					public static initDisplayMetricsIfNotInitialized(param0: globalAndroid.content.Context): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module uimanager {
				export class PixelUtil {
					public static class: java.lang.Class<com.facebook.react.uimanager.PixelUtil>;
					public static toPixelFromSP(param0: number): number;
					public constructor();
					public static getDisplayMetricDensity(): number;
					public static toPixelFromDIP(param0: number): number;
					public static toPixelFromSP(param0: number, param1: number): number;
					public static toDIPFromPixel(param0: number): number;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module uimanager {
				export class ReactShadowNode {
					public static class: java.lang.Class<com.facebook.react.uimanager.ReactShadowNode>;
					public constructor();
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module uimanager {
				export class RootViewManager extends com.facebook.react.uimanager.ViewGroupManager<globalAndroid.view.ViewGroup> {
					public static class: java.lang.Class<com.facebook.react.uimanager.RootViewManager>;
					public static REACT_CLASS: string;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public canOverrideExistingModule(): boolean;
					public createViewInstance(param0: com.facebook.react.uimanager.ThemedReactContext): any;
					public createViewInstance(param0: com.facebook.react.uimanager.ThemedReactContext): globalAndroid.view.ViewGroup;
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
			export module uimanager {
				export abstract class SimpleViewManager<T>  extends com.facebook.react.uimanager.BaseViewManager<any,com.facebook.react.uimanager.ReactShadowNode> {
					public static class: java.lang.Class<com.facebook.react.uimanager.SimpleViewManager<any>>;
					public onCatalystInstanceDestroy(): void;
					public constructor();
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
			export module uimanager {
				export class ThemedReactContext extends com.facebook.react.bridge.ReactContext {
					public static class: java.lang.Class<com.facebook.react.uimanager.ThemedReactContext>;
					public getCurrentActivity(): globalAndroid.app.Activity;
					public hasCurrentActivity(): boolean;
					public getSurfaceId(): number;
					public getJSIModule(param0: com.facebook.react.bridge.JSIModuleType): com.facebook.react.bridge.JSIModule;
					public getReactApplicationContext(): com.facebook.react.bridge.ReactApplicationContext;
					public getModuleName(): string;
					public removeLifecycleEventListener(param0: com.facebook.react.bridge.LifecycleEventListener): void;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext, param1: globalAndroid.content.Context, param2: string, param3: number);
					public addLifecycleEventListener(param0: com.facebook.react.bridge.LifecycleEventListener): void;
					public isBridgeless(): boolean;
					/** @deprecated */
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext, param1: globalAndroid.content.Context, param2: string);
					/** @deprecated */
					public isBridgeless(): boolean;
					public constructor(param0: globalAndroid.content.Context);
					/** @deprecated */
					public getSurfaceID(): string;
					/** @deprecated */
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext, param1: globalAndroid.content.Context);
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module uimanager {
				export class UIManagerModule extends com.facebook.react.bridge.ReactContextBaseJavaModule {
					public static class: java.lang.Class<com.facebook.react.uimanager.UIManagerModule>;
					public static NAME: string;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public canOverrideExistingModule(): boolean;
					public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
					public receiveEvent(param0: number, param1: string, param2: com.facebook.react.bridge.WritableMap): void;
					public getEventDispatcher(): com.facebook.react.uimanager.events.EventDispatcher;
					public receiveEvent(param0: number, param1: number, param2: string, param3: com.facebook.react.bridge.WritableMap): void;
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
			export module uimanager {
				export abstract class ViewGroupManager<T>  extends com.facebook.react.uimanager.BaseViewManager<any,com.facebook.react.uimanager.ReactShadowNode> {
					public static class: java.lang.Class<com.facebook.react.uimanager.ViewGroupManager<any>>;
					public shouldPromoteGrandchildren(): boolean;
					public getChildCount(param0: any): number;
					public canOverrideExistingModule(): boolean;
					public removeAllViews(param0: any): void;
					public removeView(param0: any, param1: globalAndroid.view.View): void;
					public getChildAt(param0: any, param1: number): globalAndroid.view.View;
					public static getViewZIndex(param0: globalAndroid.view.View): java.lang.Integer;
					public needsCustomLayoutForChildren(): boolean;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public static setViewZIndex(param0: globalAndroid.view.View, param1: number): void;
					public getName(): string;
					public removeViewAt(param0: any, param1: number): void;
					public addViews(param0: any, param1: java.util.List<globalAndroid.view.View>): void;
					public initialize(): void;
					public addView(param0: any, param1: globalAndroid.view.View, param2: number): void;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module uimanager {
				export abstract class ViewManager<T, C>  extends com.facebook.react.bridge.BaseJavaModule {
					public static class: java.lang.Class<com.facebook.react.uimanager.ViewManager<any,any>>;
					public receiveCommand(param0: any, param1: string, param2: com.facebook.react.bridge.ReadableArray): void;
					public getCommandsMap(): java.util.Map<string,java.lang.Integer>;
					public canOverrideExistingModule(): boolean;
					public getExportedCustomBubblingEventTypeConstants(): java.util.Map<string,any>;
					/** @deprecated */
					public receiveCommand(param0: any, param1: number, param2: com.facebook.react.bridge.ReadableArray): void;
					public getExportedCustomDirectEventTypeConstants(): java.util.Map<string,any>;
					public onCatalystInstanceDestroy(): void;
					public constructor();
					public getName(): string;
					public createViewInstance(param0: com.facebook.react.uimanager.ThemedReactContext): any;
					public getExportedViewConstants(): java.util.Map<string,any>;
					public addEventEmitters(param0: com.facebook.react.uimanager.ThemedReactContext, param1: any): void;
					public initialize(): void;
					public onDropViewInstance(param0: any): void;
					public invalidate(): void;
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module uimanager {
				export module annotations {
					export class ReactProp {
						public static class: java.lang.Class<com.facebook.react.uimanager.annotations.ReactProp>;
						/**
						 * Constructs a new instance of the com.facebook.react.uimanager.annotations.ReactProp interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							name(): string;
							customType(): string;
							defaultDouble(): number;
							defaultFloat(): number;
							defaultInt(): number;
							defaultBoolean(): boolean;
						});
						public constructor();
						public static USE_DEFAULT_TYPE: string;
						public defaultFloat(): number;
						public name(): string;
						public defaultInt(): number;
						public defaultBoolean(): boolean;
						public defaultDouble(): number;
						public customType(): string;
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
				export module annotations {
					export class ReactPropGroup {
						public static class: java.lang.Class<com.facebook.react.uimanager.annotations.ReactPropGroup>;
						/**
						 * Constructs a new instance of the com.facebook.react.uimanager.annotations.ReactPropGroup interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							names(): androidNative.Array<string>;
							customType(): string;
							defaultFloat(): number;
							defaultDouble(): number;
							defaultInt(): number;
						});
						public constructor();
						public static USE_DEFAULT_TYPE: string;
						public defaultFloat(): number;
						public names(): androidNative.Array<string>;
						public defaultInt(): number;
						public defaultDouble(): number;
						public customType(): string;
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
				export module common {
					export class UIManagerType {
						public static class: java.lang.Class<com.facebook.react.uimanager.common.UIManagerType>;
						/**
						 * Constructs a new instance of the com.facebook.react.uimanager.common.UIManagerType interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
						});
						public constructor();
						public static DEFAULT: number;
						public static FABRIC: number;
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
				export module common {
					export class ViewUtil {
						public static class: java.lang.Class<com.facebook.react.uimanager.common.ViewUtil>;
						public constructor();
						/** @deprecated */
						public static isRootTag(param0: number): boolean;
						public static getUIManagerType(param0: number): number;
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
				export module events {
					export class ContentSizeChangeEvent extends com.facebook.react.uimanager.events.Event<com.facebook.react.uimanager.events.ContentSizeChangeEvent> {
						public static class: java.lang.Class<com.facebook.react.uimanager.events.ContentSizeChangeEvent>;
						public static EVENT_NAME: string;
						public constructor();
						public getEventName(): string;
						public getEventData(): com.facebook.react.bridge.WritableMap;
						/** @deprecated */
						public constructor(param0: number);
						/** @deprecated */
						public constructor(param0: number, param1: number, param2: number);
						public constructor(param0: number, param1: number);
						public constructor(param0: number, param1: number, param2: number, param3: number);
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
				export module events {
					export abstract class Event<T>  extends java.lang.Object {
						public static class: java.lang.Class<com.facebook.react.uimanager.events.Event<any>>;
						public getSurfaceId(): number;
						public getUniqueID(): number;
						/** @deprecated */
						public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
						public constructor();
						public getViewTag(): number;
						/** @deprecated */
						public init(param0: number): void;
						public getUIManagerType(): number;
						public getEventData(): com.facebook.react.bridge.WritableMap;
						/** @deprecated */
						public dispatchModernV2(param0: com.facebook.react.uimanager.events.RCTModernEventEmitter): void;
						public getTimestampMs(): number;
						/** @deprecated */
						public constructor(param0: number);
						public init(param0: number, param1: number, param2: number): void;
						public init(param0: number, param1: number): void;
						public canCoalesce(): boolean;
						public getEventName(): string;
						public getEventCategory(): number;
						public dispatchModern(param0: com.facebook.react.uimanager.events.RCTModernEventEmitter): void;
						public coalesce(param0: T): T;
						public getCoalescingKey(): number;
						public constructor(param0: number, param1: number);
						public onDispose(): void;
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
				export module events {
					export class EventCategoryDef {
						public static class: java.lang.Class<com.facebook.react.uimanager.events.EventCategoryDef>;
						/**
						 * Constructs a new instance of the com.facebook.react.uimanager.events.EventCategoryDef interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
						});
						public constructor();
						public static CONTINUOUS_START: number;
						public static CONTINUOUS: number;
						public static CONTINUOUS_END: number;
						public static UNSPECIFIED: number;
						public static DISCRETE: number;
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
				export module events {
					export class EventDispatcher {
						public static class: java.lang.Class<com.facebook.react.uimanager.events.EventDispatcher>;
						/**
						 * Constructs a new instance of the com.facebook.react.uimanager.events.EventDispatcher interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							dispatchEvent(param0: com.facebook.react.uimanager.events.Event<any>): void;
						});
						public constructor();
						public dispatchEvent(param0: com.facebook.react.uimanager.events.Event<any>): void;
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
				export module events {
					export class RCTEventEmitter extends com.facebook.react.bridge.JavaScriptModule {
						public static class: java.lang.Class<com.facebook.react.uimanager.events.RCTEventEmitter>;
						/**
						 * Constructs a new instance of the com.facebook.react.uimanager.events.RCTEventEmitter interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							receiveEvent(param0: number, param1: string, param2: com.facebook.react.bridge.WritableMap): void;
							receiveTouches(param0: string, param1: com.facebook.react.bridge.WritableArray, param2: com.facebook.react.bridge.WritableArray): void;
						});
						public constructor();
						/** @deprecated */
						public receiveEvent(param0: number, param1: string, param2: com.facebook.react.bridge.WritableMap): void;
						public receiveTouches(param0: string, param1: com.facebook.react.bridge.WritableArray, param2: com.facebook.react.bridge.WritableArray): void;
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
				export module events {
					export class RCTModernEventEmitter extends com.facebook.react.uimanager.events.RCTEventEmitter {
						public static class: java.lang.Class<com.facebook.react.uimanager.events.RCTModernEventEmitter>;
						/**
						 * Constructs a new instance of the com.facebook.react.uimanager.events.RCTModernEventEmitter interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							receiveEvent(param0: number, param1: number, param2: string, param3: com.facebook.react.bridge.WritableMap): void;
							receiveEvent(param0: number, param1: number, param2: string, param3: boolean, param4: number, param5: com.facebook.react.bridge.WritableMap, param6: number): void;
							receiveEvent(param0: number, param1: string, param2: com.facebook.react.bridge.WritableMap): void;
							receiveTouches(param0: string, param1: com.facebook.react.bridge.WritableArray, param2: com.facebook.react.bridge.WritableArray): void;
						});
						public constructor();
						/** @deprecated */
						public receiveEvent(param0: number, param1: string, param2: com.facebook.react.bridge.WritableMap): void;
						public receiveTouches(param0: string, param1: com.facebook.react.bridge.WritableArray, param2: com.facebook.react.bridge.WritableArray): void;
						public receiveEvent(param0: number, param1: number, param2: string, param3: com.facebook.react.bridge.WritableMap): void;
						public receiveEvent(param0: number, param1: number, param2: string, param3: boolean, param4: number, param5: com.facebook.react.bridge.WritableMap, param6: number): void;
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
				export module events {
					export class ReactEventEmitter extends com.facebook.react.uimanager.events.RCTModernEventEmitter {
						public static class: java.lang.Class<com.facebook.react.uimanager.events.ReactEventEmitter>;
						public unregister(param0: number): void;
						/** @deprecated */
						public receiveEvent(param0: number, param1: string, param2: com.facebook.react.bridge.WritableMap): void;
						public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
						public receiveTouches(param0: string, param1: com.facebook.react.bridge.WritableArray, param2: com.facebook.react.bridge.WritableArray): void;
						public register(param0: number, param1: com.facebook.react.uimanager.events.RCTModernEventEmitter): void;
						public receiveEvent(param0: number, param1: number, param2: string, param3: com.facebook.react.bridge.WritableMap): void;
						public register(param0: number, param1: com.facebook.react.uimanager.events.RCTEventEmitter): void;
						public receiveEvent(param0: number, param1: number, param2: string, param3: boolean, param4: number, param5: com.facebook.react.bridge.WritableMap, param6: number): void;
						public receiveEvent(param0: number, param1: string, param2: com.facebook.react.bridge.WritableMap): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module views {
				export module scroll {
					export class OnScrollDispatchHelper {
						public static class: java.lang.Class<com.facebook.react.views.scroll.OnScrollDispatchHelper>;
						public getYFlingVelocity(): number;
						public constructor();
						public onScrollChanged(param0: number, param1: number): boolean;
						public getXFlingVelocity(): number;
					}
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module views {
				export module scroll {
					export class ScrollEvent extends com.facebook.react.uimanager.events.Event<com.facebook.react.views.scroll.ScrollEvent> {
						public static class: java.lang.Class<com.facebook.react.views.scroll.ScrollEvent>;
						public canCoalesce(): boolean;
						public getEventName(): string;
						public getEventData(): com.facebook.react.bridge.WritableMap;
						public static obtain(param0: number, param1: number, param2: com.facebook.react.views.scroll.ScrollEventType, param3: number, param4: number, param5: number, param6: number, param7: number, param8: number, param9: number, param10: number): com.facebook.react.views.scroll.ScrollEvent;
						public onDispose(): void;
						/** @deprecated */
						public static obtain(param0: number, param1: com.facebook.react.views.scroll.ScrollEventType, param2: number, param3: number, param4: number, param5: number, param6: number, param7: number, param8: number, param9: number): com.facebook.react.views.scroll.ScrollEvent;
					}
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module views {
				export module scroll {
					export class ScrollEventType {
						public static class: java.lang.Class<com.facebook.react.views.scroll.ScrollEventType>;
						public static BEGIN_DRAG: com.facebook.react.views.scroll.ScrollEventType;
						public static END_DRAG: com.facebook.react.views.scroll.ScrollEventType;
						public static SCROLL: com.facebook.react.views.scroll.ScrollEventType;
						public static MOMENTUM_BEGIN: com.facebook.react.views.scroll.ScrollEventType;
						public static MOMENTUM_END: com.facebook.react.views.scroll.ScrollEventType;
						public static getJSEventName(param0: com.facebook.react.views.scroll.ScrollEventType): string;
						public static values(): androidNative.Array<com.facebook.react.views.scroll.ScrollEventType>;
						public static valueOf(param0: string): com.facebook.react.views.scroll.ScrollEventType;
					}
				}
			}
		}
	}
}

declare module com {
	export module facebook {
		export module react {
			export module views {
				export module scroll {
					export class VelocityHelper {
						public static class: java.lang.Class<com.facebook.react.views.scroll.VelocityHelper>;
						public constructor();
						public getXVelocity(): number;
						public getYVelocity(): number;
						public calculateVelocity(param0: globalAndroid.view.MotionEvent): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export class BasicAuthCredential {
				public static class: java.lang.Class<com.reactnativecommunity.webview.BasicAuthCredential>;
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export class BuildConfig {
				public static class: java.lang.Class<com.reactnativecommunity.webview.BuildConfig>;
				public static DEBUG: boolean;
				public static LIBRARY_PACKAGE_NAME: string;
				public static BUILD_TYPE: string;
				public constructor();
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export class RNCWebViewFileProvider {
				public static class: java.lang.Class<com.reactnativecommunity.webview.RNCWebViewFileProvider>;
				public constructor();
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export class RNCWebViewManager extends com.facebook.react.uimanager.SimpleViewManager<globalAndroid.webkit.WebView> {
				public static class: java.lang.Class<com.reactnativecommunity.webview.RNCWebViewManager>;
				public static COMMAND_GO_BACK: number;
				public static COMMAND_GO_FORWARD: number;
				public static COMMAND_RELOAD: number;
				public static COMMAND_STOP_LOADING: number;
				public static COMMAND_POST_MESSAGE: number;
				public static COMMAND_INJECT_JAVASCRIPT: number;
				public static COMMAND_LOAD_URL: number;
				public static COMMAND_FOCUS: number;
				public static COMMAND_CLEAR_FORM_DATA: number;
				public static COMMAND_CLEAR_CACHE: number;
				public static COMMAND_CLEAR_HISTORY: number;
				public static REACT_CLASS: string;
				public static HTML_ENCODING: string;
				public static HTML_MIME_TYPE: string;
				public static JAVASCRIPT_INTERFACE: string;
				public static HTTP_METHOD_POST: string;
				public static BLANK_URL: string;
				public static SHOULD_OVERRIDE_URL_LOADING_TIMEOUT: number;
				public static DEFAULT_DOWNLOADING_MESSAGE: string;
				public static DEFAULT_LACK_PERMISSION_TO_DOWNLOAD_MESSAGE: string;
				public mWebViewConfig: com.reactnativecommunity.webview.WebViewConfig;
				public mWebChromeClient: com.reactnativecommunity.webview.RNCWebViewManager.RNCWebChromeClient;
				public mAllowsFullscreenVideo: boolean;
				public mAllowsProtectedMedia: boolean;
				public mUserAgent: string;
				public mUserAgentWithApplicationName: string;
				public mDownloadingMessage: string;
				public mLackPermissionToDownloadMessage: string;
				public setDomStorageEnabled(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setThirdPartyCookiesEnabled(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setOnScroll(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setForceDarkOn(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setTextZoom(param0: globalAndroid.webkit.WebView, param1: number): void;
				public setSaveFormDataDisabled(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setAllowFileAccessFromFileURLs(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public constructor();
				public setOnContentSizeChange(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setSupportMultipleWindows(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setApplicationNameForUserAgent(param0: globalAndroid.webkit.WebView, param1: string): void;
				public setInjectedJavaScriptForMainFrameOnly(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public canOverrideExistingModule(): boolean;
				public setLayerType(param0: globalAndroid.webkit.WebView, param1: string): void;
				public setUserAgent(param0: globalAndroid.webkit.WebView, param1: string): void;
				public setMixedContentMode(param0: globalAndroid.webkit.WebView, param1: string): void;
				public setDownloadingMessage(param0: globalAndroid.webkit.WebView, param1: string): void;
				public setAllowsFullscreenVideo(param0: globalAndroid.webkit.WebView, param1: java.lang.Boolean): void;
				public setupWebChromeClient(param0: com.facebook.react.bridge.ReactContext, param1: globalAndroid.webkit.WebView): void;
				public getName(): string;
				public onCatalystInstanceDestroy(): void;
				public setInjectedJavaScriptBeforeContentLoaded(param0: globalAndroid.webkit.WebView, param1: string): void;
				public getExportedCustomDirectEventTypeConstants(): java.util.Map<any,any>;
				public setGeolocationEnabled(param0: globalAndroid.webkit.WebView, param1: java.lang.Boolean): void;
				public setCacheMode(param0: globalAndroid.webkit.WebView, param1: string): void;
				public setSource(param0: globalAndroid.webkit.WebView, param1: com.facebook.react.bridge.ReadableMap): void;
				public setAllowUniversalAccessFromFileURLs(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setIncognito(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setBasicAuthCredential(param0: globalAndroid.webkit.WebView, param1: com.facebook.react.bridge.ReadableMap): void;
				public static getModule(param0: com.facebook.react.bridge.ReactContext): com.reactnativecommunity.webview.RNCWebViewModule;
				public initialize(): void;
				public createViewInstance(param0: com.facebook.react.uimanager.ThemedReactContext): globalAndroid.webkit.WebView;
				public onDropViewInstance(param0: globalAndroid.webkit.WebView): void;
				public invalidate(): void;
				public setInjectedJavaScript(param0: globalAndroid.webkit.WebView, param1: string): void;
				public setCacheEnabled(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setOverScrollMode(param0: globalAndroid.webkit.WebView, param1: string): void;
				public addEventEmitters(param0: com.facebook.react.uimanager.ThemedReactContext, param1: globalAndroid.webkit.WebView): void;
				public createRNCWebViewInstance(param0: com.facebook.react.uimanager.ThemedReactContext): com.reactnativecommunity.webview.RNCWebViewManager.RNCWebView;
				public receiveCommand(param0: any, param1: string, param2: com.facebook.react.bridge.ReadableArray): void;
				public setUserAgentString(param0: globalAndroid.webkit.WebView): void;
				public getExportedCustomDirectEventTypeConstants(): java.util.Map<string,any>;
				public setMinimumFontSize(param0: globalAndroid.webkit.WebView, param1: number): void;
				public setDisplayZoomControls(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public constructor(param0: com.reactnativecommunity.webview.WebViewConfig);
				public setMessagingEnabled(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setShowsHorizontalScrollIndicator(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setLackPermissionToDownlaodMessage(param0: globalAndroid.webkit.WebView, param1: string): void;
				public setHardwareAccelerationDisabled(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setJavaScriptEnabled(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setInjectedJavaScriptBeforeContentLoadedForMainFrameOnly(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				/** @deprecated */
				public receiveCommand(param0: any, param1: number, param2: com.facebook.react.bridge.ReadableArray): void;
				public receiveCommand(param0: globalAndroid.webkit.WebView, param1: string, param2: com.facebook.react.bridge.ReadableArray): void;
				public createViewInstance(param0: com.facebook.react.uimanager.ThemedReactContext): any;
				public setBuiltInZoomControls(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setMessagingModuleName(param0: globalAndroid.webkit.WebView, param1: string): void;
				public setShowsVerticalScrollIndicator(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public addEventEmitters(param0: com.facebook.react.uimanager.ThemedReactContext, param1: any): void;
				public setNestedScrollEnabled(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setAllowFileAccess(param0: globalAndroid.webkit.WebView, param1: java.lang.Boolean): void;
				public setJavaScriptCanOpenWindowsAutomatically(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public getCommandsMap(): java.util.Map<string,java.lang.Integer>;
				public onDropViewInstance(param0: any): void;
				public setMediaPlaybackRequiresUserAction(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setScalesPageToFit(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setAllowsProtectedMedia(param0: globalAndroid.webkit.WebView, param1: boolean): void;
				public setUrlPrefixesForDefaultIntent(param0: globalAndroid.webkit.WebView, param1: com.facebook.react.bridge.ReadableArray): void;
			}
			export module RNCWebViewManager {
				export class RNCWebChromeClient implements com.facebook.react.bridge.LifecycleEventListener {
					public static class: java.lang.Class<com.reactnativecommunity.webview.RNCWebViewManager.RNCWebChromeClient>;
					public static FULLSCREEN_LAYOUT_PARAMS: globalAndroid.widget.FrameLayout.LayoutParams;
					public static FULLSCREEN_SYSTEM_UI_VISIBILITY: number;
					public static COMMON_PERMISSION_REQUEST: number;
					public mReactContext: com.facebook.react.bridge.ReactContext;
					public mWebView: globalAndroid.view.View;
					public mVideoView: globalAndroid.view.View;
					public mCustomViewCallback: globalAndroid.webkit.WebChromeClient.CustomViewCallback;
					public permissionRequest: globalAndroid.webkit.PermissionRequest;
					public grantedPermissions: java.util.List<string>;
					public geolocationPermissionCallback: globalAndroid.webkit.GeolocationPermissions.Callback;
					public geolocationPermissionOrigin: string;
					public permissionsRequestShown: boolean;
					public pendingPermissions: java.util.List<string>;
					public progressChangedFilter: com.reactnativecommunity.webview.RNCWebViewManager.RNCWebView.ProgressChangedFilter;
					public mAllowsProtectedMedia: boolean;
					public openFileChooser(param0: globalAndroid.webkit.ValueCallback<globalAndroid.net.Uri>): void;
					public onProgressChanged(param0: globalAndroid.webkit.WebView, param1: number): void;
					public setProgressChangedFilter(param0: com.reactnativecommunity.webview.RNCWebViewManager.RNCWebView.ProgressChangedFilter): void;
					public onShowFileChooser(param0: globalAndroid.webkit.WebView, param1: globalAndroid.webkit.ValueCallback<androidNative.Array<globalAndroid.net.Uri>>, param2: globalAndroid.webkit.WebChromeClient.FileChooserParams): boolean;
					public openFileChooser(param0: globalAndroid.webkit.ValueCallback<globalAndroid.net.Uri>, param1: string, param2: string): void;
					public openFileChooser(param0: globalAndroid.webkit.ValueCallback<globalAndroid.net.Uri>, param1: string): void;
					public onHostDestroy(): void;
					public constructor(param0: com.facebook.react.bridge.ReactContext, param1: globalAndroid.webkit.WebView);
					public onPermissionRequest(param0: globalAndroid.webkit.PermissionRequest): void;
					public onHostPause(): void;
					public onCreateWindow(param0: globalAndroid.webkit.WebView, param1: boolean, param2: boolean, param3: globalAndroid.os.Message): boolean;
					public getRootView(): globalAndroid.view.ViewGroup;
					public onHostResume(): void;
					public onConsoleMessage(param0: globalAndroid.webkit.ConsoleMessage): boolean;
					public setAllowsProtectedMedia(param0: boolean): void;
					public onGeolocationPermissionsShowPrompt(param0: string, param1: globalAndroid.webkit.GeolocationPermissions.Callback): void;
				}
				export class RNCWebView implements com.facebook.react.bridge.LifecycleEventListener {
					public static class: java.lang.Class<com.reactnativecommunity.webview.RNCWebViewManager.RNCWebView>;
					public injectedJS: string;
					public injectedJSBeforeContentLoaded: string;
					public injectedJavaScriptForMainFrameOnly: boolean;
					public injectedJavaScriptBeforeContentLoadedForMainFrameOnly: boolean;
					public messagingEnabled: boolean;
					public messagingModuleName: string;
					public mRNCWebViewClient: com.reactnativecommunity.webview.RNCWebViewManager.RNCWebViewClient;
					public mCatalystInstance: com.facebook.react.bridge.CatalystInstance;
					public sendContentSizeChangeEvents: boolean;
					public hasScrollEvent: boolean;
					public nestedScrollEnabled: boolean;
					public progressChangedFilter: com.reactnativecommunity.webview.RNCWebViewManager.RNCWebView.ProgressChangedFilter;
					public setHasScrollEvent(param0: boolean): void;
					public setInjectedJavaScriptForMainFrameOnly(param0: boolean): void;
					public setNestedScrollEnabled(param0: boolean): void;
					public setMessagingEnabled(param0: boolean): void;
					public onHostDestroy(): void;
					public setWebChromeClient(param0: globalAndroid.webkit.WebChromeClient): void;
					public onHostPause(): void;
					public destroy(): void;
					public setIgnoreErrFailedForThisURL(param0: string): void;
					public evaluateJavascriptWithFallback(param0: string): void;
					public cleanupCallbacksAndDestroy(): void;
					public setInjectedJavaScriptBeforeContentLoadedForMainFrameOnly(param0: boolean): void;
					public createRNCWebViewBridge(param0: com.reactnativecommunity.webview.RNCWebViewManager.RNCWebView): com.reactnativecommunity.webview.RNCWebViewManager.RNCWebView.RNCWebViewBridge;
					public getRNCWebViewClient(): com.reactnativecommunity.webview.RNCWebViewManager.RNCWebViewClient;
					public constructor(param0: com.facebook.react.uimanager.ThemedReactContext);
					public onMessage(param0: string): void;
					public createCatalystInstance(): void;
					public setInjectedJavaScript(param0: string): void;
					public callInjectedJavaScript(): void;
					public onSizeChanged(param0: number, param1: number, param2: number, param3: number): void;
					public dispatchEvent(param0: globalAndroid.webkit.WebView, param1: com.facebook.react.uimanager.events.Event<any>): void;
					public sendDirectMessage(param0: string, param1: com.facebook.react.bridge.WritableMap): void;
					public onHostResume(): void;
					public setWebViewClient(param0: globalAndroid.webkit.WebViewClient): void;
					public onScrollChanged(param0: number, param1: number, param2: number, param3: number): void;
					public onTouchEvent(param0: globalAndroid.view.MotionEvent): boolean;
					public setInjectedJavaScriptBeforeContentLoaded(param0: string): void;
					public setBasicAuthCredential(param0: com.reactnativecommunity.webview.BasicAuthCredential): void;
					public setSendContentSizeChangeEvents(param0: boolean): void;
					public callInjectedJavaScriptBeforeContentLoaded(): void;
					public setMessagingModuleName(param0: string): void;
				}
				export module RNCWebView {
					export class ProgressChangedFilter {
						public static class: java.lang.Class<com.reactnativecommunity.webview.RNCWebViewManager.RNCWebView.ProgressChangedFilter>;
						public constructor();
						public setWaitingForCommandLoadUrl(param0: boolean): void;
						public isWaitingForCommandLoadUrl(): boolean;
					}
					export class RNCWebViewBridge {
						public static class: java.lang.Class<com.reactnativecommunity.webview.RNCWebViewManager.RNCWebView.RNCWebViewBridge>;
						public postMessage(param0: string): void;
					}
				}
				export class RNCWebViewClient {
					public static class: java.lang.Class<com.reactnativecommunity.webview.RNCWebViewManager.RNCWebViewClient>;
					public mLastLoadFailed: boolean;
					public mUrlPrefixesForDefaultIntent: com.facebook.react.bridge.ReadableArray;
					public progressChangedFilter: com.reactnativecommunity.webview.RNCWebViewManager.RNCWebView.ProgressChangedFilter;
					public ignoreErrFailedForThisURL: string;
					public basicAuthCredential: com.reactnativecommunity.webview.BasicAuthCredential;
					public onRenderProcessGone(param0: globalAndroid.webkit.WebView, param1: globalAndroid.webkit.RenderProcessGoneDetail): boolean;
					public setProgressChangedFilter(param0: com.reactnativecommunity.webview.RNCWebViewManager.RNCWebView.ProgressChangedFilter): void;
					public onReceivedHttpAuthRequest(param0: globalAndroid.webkit.WebView, param1: globalAndroid.webkit.HttpAuthHandler, param2: string, param3: string): void;
					public shouldOverrideUrlLoading(param0: globalAndroid.webkit.WebView, param1: string): boolean;
					public onReceivedError(param0: globalAndroid.webkit.WebView, param1: number, param2: string, param3: string): void;
					public onPageStarted(param0: globalAndroid.webkit.WebView, param1: string, param2: globalAndroid.graphics.Bitmap): void;
					public onPageFinished(param0: globalAndroid.webkit.WebView, param1: string): void;
					public constructor();
					public shouldOverrideUrlLoading(param0: globalAndroid.webkit.WebView, param1: globalAndroid.webkit.WebResourceRequest): boolean;
					public setIgnoreErrFailedForThisURL(param0: string): void;
					public onReceivedSslError(param0: globalAndroid.webkit.WebView, param1: globalAndroid.webkit.SslErrorHandler, param2: globalAndroid.net.http.SslError): void;
					public emitFinishEvent(param0: globalAndroid.webkit.WebView, param1: string): void;
					public createWebViewEvent(param0: globalAndroid.webkit.WebView, param1: string): com.facebook.react.bridge.WritableMap;
					public setUrlPrefixesForDefaultIntent(param0: com.facebook.react.bridge.ReadableArray): void;
					public setBasicAuthCredential(param0: com.reactnativecommunity.webview.BasicAuthCredential): void;
					public onReceivedHttpError(param0: globalAndroid.webkit.WebView, param1: globalAndroid.webkit.WebResourceRequest, param2: globalAndroid.webkit.WebResourceResponse): void;
				}
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export class RNCWebViewModule extends com.facebook.react.bridge.ReactContextBaseJavaModule implements com.facebook.react.bridge.ActivityEventListener {
				public static class: java.lang.Class<com.reactnativecommunity.webview.RNCWebViewModule>;
				public static MODULE_NAME: string;
				public static shouldOverrideUrlLoadingLock: com.reactnativecommunity.webview.RNCWebViewModule.ShouldOverrideUrlLoadingLock;
				public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
				public getName(): string;
				public startPhotoPickerIntent(param0: globalAndroid.webkit.ValueCallback<androidNative.Array<globalAndroid.net.Uri>>, param1: androidNative.Array<string>, param2: boolean): boolean;
				public onCatalystInstanceDestroy(): void;
				public constructor();
				public downloadFile(param0: string): void;
				public onShouldStartLoadWithRequestCallback(param0: boolean, param1: number): void;
				public initialize(): void;
				public startPhotoPickerIntent(param0: globalAndroid.webkit.ValueCallback<globalAndroid.net.Uri>, param1: string): void;
				public canOverrideExistingModule(): boolean;
				public onNewIntent(param0: globalAndroid.content.Intent): void;
				public invalidate(): void;
				public setDownloadRequest(param0: globalAndroid.app.DownloadManager.Request): void;
				public onActivityResult(param0: globalAndroid.app.Activity, param1: number, param2: number, param3: globalAndroid.content.Intent): void;
				public needsCameraPermission(): boolean;
				public isFileUploadSupported(param0: com.facebook.react.bridge.Promise): void;
				public grantFileDownloaderPermissions(param0: string, param1: string): boolean;
			}
			export module RNCWebViewModule {
				export class MimeType {
					public static class: java.lang.Class<com.reactnativecommunity.webview.RNCWebViewModule.MimeType>;
					public static DEFAULT: com.reactnativecommunity.webview.RNCWebViewModule.MimeType;
					public static IMAGE: com.reactnativecommunity.webview.RNCWebViewModule.MimeType;
					public static VIDEO: com.reactnativecommunity.webview.RNCWebViewModule.MimeType;
					public static values(): androidNative.Array<com.reactnativecommunity.webview.RNCWebViewModule.MimeType>;
					public static valueOf(param0: string): com.reactnativecommunity.webview.RNCWebViewModule.MimeType;
				}
				export class ShouldOverrideUrlLoadingLock {
					public static class: java.lang.Class<com.reactnativecommunity.webview.RNCWebViewModule.ShouldOverrideUrlLoadingLock>;
					public removeLock(param0: java.lang.Integer): void;
					public constructor();
					public getNewLock(): androidx.core.util.Pair<java.lang.Integer,java.util.concurrent.atomic.AtomicReference<com.reactnativecommunity.webview.RNCWebViewModule.ShouldOverrideUrlLoadingLock.ShouldOverrideCallbackState>>;
					public getLock(param0: java.lang.Integer): java.util.concurrent.atomic.AtomicReference<com.reactnativecommunity.webview.RNCWebViewModule.ShouldOverrideUrlLoadingLock.ShouldOverrideCallbackState>;
				}
				export module ShouldOverrideUrlLoadingLock {
					export class ShouldOverrideCallbackState {
						public static class: java.lang.Class<com.reactnativecommunity.webview.RNCWebViewModule.ShouldOverrideUrlLoadingLock.ShouldOverrideCallbackState>;
						public static UNDECIDED: com.reactnativecommunity.webview.RNCWebViewModule.ShouldOverrideUrlLoadingLock.ShouldOverrideCallbackState;
						public static SHOULD_OVERRIDE: com.reactnativecommunity.webview.RNCWebViewModule.ShouldOverrideUrlLoadingLock.ShouldOverrideCallbackState;
						public static DO_NOT_OVERRIDE: com.reactnativecommunity.webview.RNCWebViewModule.ShouldOverrideUrlLoadingLock.ShouldOverrideCallbackState;
						public static values(): androidNative.Array<com.reactnativecommunity.webview.RNCWebViewModule.ShouldOverrideUrlLoadingLock.ShouldOverrideCallbackState>;
						public static valueOf(param0: string): com.reactnativecommunity.webview.RNCWebViewModule.ShouldOverrideUrlLoadingLock.ShouldOverrideCallbackState;
					}
				}
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export class RNCWebViewPackage extends com.facebook.react.ReactPackage {
				public static class: java.lang.Class<com.reactnativecommunity.webview.RNCWebViewPackage>;
				public createNativeModules(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.reactnativecommunity.webview.RNCWebViewModule>;
				public createNativeModules(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.bridge.NativeModule>;
				public createViewManagers(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.reactnativecommunity.webview.RNCWebViewManager>;
				public createViewManagers(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.uimanager.ViewManager<any,any>>;
				public constructor();
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export class URLUtil {
				public static class: java.lang.Class<com.reactnativecommunity.webview.URLUtil>;
				public static guessFileName(param0: string, param1: string, param2: string): string;
				public constructor();
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export class WebViewConfig {
				public static class: java.lang.Class<com.reactnativecommunity.webview.WebViewConfig>;
				/**
				 * Constructs a new instance of the com.reactnativecommunity.webview.WebViewConfig interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
				 */
				public constructor(implementation: {
					configWebView(param0: globalAndroid.webkit.WebView): void;
				});
				public constructor();
				public configWebView(param0: globalAndroid.webkit.WebView): void;
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export module events {
				export class TopHttpErrorEvent extends com.facebook.react.uimanager.events.Event<com.reactnativecommunity.webview.events.TopHttpErrorEvent> {
					public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopHttpErrorEvent>;
					public static EVENT_NAME: string;
					public getCoalescingKey(): number;
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
					public constructor();
					public constructor(param0: number, param1: com.facebook.react.bridge.WritableMap);
					public canCoalesce(): boolean;
					public getEventName(): string;
					/** @deprecated */
					public constructor(param0: number);
					public constructor(param0: number, param1: number);
					/** @deprecated */
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
				}
				export module TopHttpErrorEvent {
					export class Companion {
						public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopHttpErrorEvent.Companion>;
					}
				}
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export module events {
				export class TopLoadingErrorEvent extends com.facebook.react.uimanager.events.Event<com.reactnativecommunity.webview.events.TopLoadingErrorEvent> {
					public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopLoadingErrorEvent>;
					public static EVENT_NAME: string;
					public getCoalescingKey(): number;
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
					public constructor();
					public constructor(param0: number, param1: com.facebook.react.bridge.WritableMap);
					public canCoalesce(): boolean;
					public getEventName(): string;
					/** @deprecated */
					public constructor(param0: number);
					public constructor(param0: number, param1: number);
					/** @deprecated */
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
				}
				export module TopLoadingErrorEvent {
					export class Companion {
						public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopLoadingErrorEvent.Companion>;
					}
				}
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export module events {
				export class TopLoadingFinishEvent extends com.facebook.react.uimanager.events.Event<com.reactnativecommunity.webview.events.TopLoadingFinishEvent> {
					public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopLoadingFinishEvent>;
					public static EVENT_NAME: string;
					public getCoalescingKey(): number;
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
					public constructor();
					public constructor(param0: number, param1: com.facebook.react.bridge.WritableMap);
					public canCoalesce(): boolean;
					public getEventName(): string;
					/** @deprecated */
					public constructor(param0: number);
					public constructor(param0: number, param1: number);
					/** @deprecated */
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
				}
				export module TopLoadingFinishEvent {
					export class Companion {
						public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopLoadingFinishEvent.Companion>;
					}
				}
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export module events {
				export class TopLoadingProgressEvent extends com.facebook.react.uimanager.events.Event<com.reactnativecommunity.webview.events.TopLoadingProgressEvent> {
					public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopLoadingProgressEvent>;
					public static EVENT_NAME: string;
					public getCoalescingKey(): number;
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
					public constructor();
					public constructor(param0: number, param1: com.facebook.react.bridge.WritableMap);
					public canCoalesce(): boolean;
					public getEventName(): string;
					/** @deprecated */
					public constructor(param0: number);
					public constructor(param0: number, param1: number);
					/** @deprecated */
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
				}
				export module TopLoadingProgressEvent {
					export class Companion {
						public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopLoadingProgressEvent.Companion>;
					}
				}
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export module events {
				export class TopLoadingStartEvent extends com.facebook.react.uimanager.events.Event<com.reactnativecommunity.webview.events.TopLoadingStartEvent> {
					public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopLoadingStartEvent>;
					public static EVENT_NAME: string;
					public getCoalescingKey(): number;
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
					public constructor();
					public constructor(param0: number, param1: com.facebook.react.bridge.WritableMap);
					public canCoalesce(): boolean;
					public getEventName(): string;
					/** @deprecated */
					public constructor(param0: number);
					public constructor(param0: number, param1: number);
					/** @deprecated */
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
				}
				export module TopLoadingStartEvent {
					export class Companion {
						public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopLoadingStartEvent.Companion>;
					}
				}
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export module events {
				export class TopMessageEvent extends com.facebook.react.uimanager.events.Event<com.reactnativecommunity.webview.events.TopMessageEvent> {
					public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopMessageEvent>;
					public static EVENT_NAME: string;
					public getCoalescingKey(): number;
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
					public constructor();
					public constructor(param0: number, param1: com.facebook.react.bridge.WritableMap);
					public canCoalesce(): boolean;
					public getEventName(): string;
					/** @deprecated */
					public constructor(param0: number);
					public constructor(param0: number, param1: number);
					/** @deprecated */
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
				}
				export module TopMessageEvent {
					export class Companion {
						public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopMessageEvent.Companion>;
					}
				}
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export module events {
				export class TopRenderProcessGoneEvent extends com.facebook.react.uimanager.events.Event<com.reactnativecommunity.webview.events.TopRenderProcessGoneEvent> {
					public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopRenderProcessGoneEvent>;
					public static EVENT_NAME: string;
					public getCoalescingKey(): number;
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
					public constructor();
					public constructor(param0: number, param1: com.facebook.react.bridge.WritableMap);
					public canCoalesce(): boolean;
					public getEventName(): string;
					/** @deprecated */
					public constructor(param0: number);
					public constructor(param0: number, param1: number);
					/** @deprecated */
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
				}
				export module TopRenderProcessGoneEvent {
					export class Companion {
						public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopRenderProcessGoneEvent.Companion>;
					}
				}
			}
		}
	}
}

declare module com {
	export module reactnativecommunity {
		export module webview {
			export module events {
				export class TopShouldStartLoadWithRequestEvent extends com.facebook.react.uimanager.events.Event<com.reactnativecommunity.webview.events.TopShouldStartLoadWithRequestEvent> {
					public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopShouldStartLoadWithRequestEvent>;
					public static EVENT_NAME: string;
					public getCoalescingKey(): number;
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
					public constructor();
					public constructor(param0: number, param1: com.facebook.react.bridge.WritableMap);
					public canCoalesce(): boolean;
					public getEventName(): string;
					/** @deprecated */
					public constructor(param0: number);
					public constructor(param0: number, param1: number);
					/** @deprecated */
					public dispatch(param0: com.facebook.react.uimanager.events.RCTEventEmitter): void;
				}
				export module TopShouldStartLoadWithRequestEvent {
					export class Companion {
						public static class: java.lang.Class<com.reactnativecommunity.webview.events.TopShouldStartLoadWithRequestEvent.Companion>;
					}
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
		export class ModuleTestViewManager extends com.facebook.react.uimanager.SimpleViewManager<globalAndroid.view.View> {
			public static class: java.lang.Class<com.testmodule.ModuleTestViewManager>;
			public static REACT_CLASS: string;
			public invalidate(): void;
			public getName(): string;
			public getExportedCustomBubblingEventTypeConstants(): java.util.Map<string,any>;
			public createViewInstance(param0: com.facebook.react.uimanager.ThemedReactContext): any;
			public initialize(): void;
			public getExportedCustomDirectEventTypeConstants(): java.util.Map<string,any>;
			public constructor();
			public createViewInstance(param0: com.facebook.react.uimanager.ThemedReactContext): globalAndroid.view.View;
			public setColor(param0: globalAndroid.view.View, param1: string): void;
			public onCatalystInstanceDestroy(): void;
			public canOverrideExistingModule(): boolean;
			public getExportedCustomBubblingEventTypeConstants(): java.util.Map<any,any>;
		}
	}
}

declare module com {
	export module testmodule {
		export class RNTestCaseNameVariable extends com.facebook.react.bridge.ReactContextBaseJavaModule {
			public static class: java.lang.Class<com.testmodule.RNTestCaseNameVariable>;
			public static NAME: string;
			public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
			public invalidate(): void;
			public getName(): string;
			public testCallback(param0: com.facebook.react.bridge.Callback): void;
			public initialize(): void;
			public constructor();
			public onCatalystInstanceDestroy(): void;
			public canOverrideExistingModule(): boolean;
		}
	}
}

declare module com {
	export module testmodule {
		export class RNTestCaseScopedNameVariable extends com.facebook.react.bridge.ReactContextBaseJavaModule {
			public static class: java.lang.Class<com.testmodule.RNTestCaseScopedNameVariable>;
			public static NAME: string;
			public constructor(param0: com.facebook.react.bridge.ReactApplicationContext);
			public invalidate(): void;
			public getName(): string;
			public testCallback(param0: com.facebook.react.bridge.Callback): void;
			public initialize(): void;
			public constructor();
			public onCatalystInstanceDestroy(): void;
			public canOverrideExistingModule(): boolean;
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
			public getConstants(): java.util.Map<string,any>;
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
			public createViewManagers(param0: com.facebook.react.bridge.ReactApplicationContext): java.util.List<com.facebook.react.uimanager.ViewManager<any,any>>;
			public constructor();
		}
	}
}

//Generics information:
//com.facebook.react.bridge.GuardedAsyncTask:2
//com.facebook.react.bridge.GuardedResultAsyncTask:1
//com.facebook.react.common.MapBuilder.Builder:2
//com.facebook.react.uimanager.BaseViewManager:2
//com.facebook.react.uimanager.SimpleViewManager:1
//com.facebook.react.uimanager.ViewGroupManager:1
//com.facebook.react.uimanager.ViewManager:2
//com.facebook.react.uimanager.events.Event:1


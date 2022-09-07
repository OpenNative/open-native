declare function RCTAddAssertFunction(assertFunction: (p1: string, p2: string, p3: number, p4: string, p5: string) => void): void;

declare function RCTAddLogFunction(logFunction: (p1: RCTLogLevel, p2: RCTLogSource, p3: string, p4: number, p5: string) => void): void;

declare class RCTBridge extends NSObject implements RCTInvalidating {
  static alloc(): RCTBridge; // inherited from NSObject

  static currentBridge(): RCTBridge;

  static new(): RCTBridge; // inherited from NSObject

  static setCurrentBridge(bridge: RCTBridge): void;

  batchedBridge: RCTBridge;

  bridgeDescription: string;

  bundleURL: NSURL;

  readonly delegate: RCTBridgeDelegate;

  executorClass: typeof NSObject;

  flowID: number;

  flowIDMap: NSDictionary<any, any>;

  flowIDMapLock: NSLock;

  readonly inspectable: boolean;

  readonly launchOptions: NSDictionary<any, any>;

  readonly loading: boolean;

  readonly moduleClasses: NSArray<typeof NSObject>;

  readonly moduleProvider: () => NSArray<RCTBridgeModule>;

  readonly moduleRegistry: RCTModuleRegistry;

  readonly moduleSetupComplete: boolean;

  readonly parentBridge: RCTBridge;

  readonly valid: boolean;

  readonly debugDescription: string; // inherited from NSObjectProtocol

  readonly description: string; // inherited from NSObjectProtocol

  readonly hash: number; // inherited from NSObjectProtocol

  readonly isProxy: boolean; // inherited from NSObjectProtocol

  readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

  readonly; // inherited from NSObjectProtocol

  constructor(o: { bundleURL: NSURL; moduleProvider: () => NSArray<RCTBridgeModule>; launchOptions: NSDictionary<any, any> });

  constructor(o: { delegate: RCTBridgeDelegate; bundleURL: NSURL; moduleProvider: () => NSArray<RCTBridgeModule>; launchOptions: NSDictionary<any, any> });

  constructor(o: { delegate: RCTBridgeDelegate; launchOptions: NSDictionary<any, any> });

  _immediatelyCallTimer(timer: number): void;

  attachBridgeAPIsToTurboModule(module: any): void;

  callNativeModuleMethodParams(moduleID: number, methodID: number, params: NSArray<any> | any[]): any;

  class(): typeof NSObject;

  conformsToProtocol(aProtocol: any /* Protocol */): boolean;

  dispatchBlockQueue(block: () => void, queue: NSObject): void;

  enqueueCallbackArgs(cbID: number, args: NSArray<any> | any[]): void;

  enqueueJSCallArgs(moduleDotMethod: string, args: NSArray<any> | any[]): void;

  enqueueJSCallMethodArgsCompletion(module: string, method: string, args: NSArray<any> | any[], completion: () => void): void;

  initWithBundleURLModuleProviderLaunchOptions(bundleURL: NSURL, block: () => NSArray<RCTBridgeModule>, launchOptions: NSDictionary<any, any>): this;

  initWithDelegateBundleURLModuleProviderLaunchOptions(delegate: RCTBridgeDelegate, bundleURL: NSURL, block: () => NSArray<RCTBridgeModule>, launchOptions: NSDictionary<any, any>): this;

  initWithDelegateLaunchOptions(delegate: RCTBridgeDelegate, launchOptions: NSDictionary<any, any>): this;

  invalidate(): void;

  isBatchActive(): boolean;

  isEqual(object: any): boolean;

  isKindOfClass(aClass: typeof NSObject): boolean;

  isMemberOfClass(aClass: typeof NSObject): boolean;

  loadAndExecuteSplitBundleURLOnErrorOnComplete(bundleURL: NSURL, onError: (p1: NSError) => void, onComplete: () => void): void;

  logMessageLevel(message: string, level: string): void;

  moduleForClass(moduleClass: typeof NSObject): any;

  moduleForName(moduleName: string): any;

  moduleForNameLazilyLoadIfNecessary(moduleName: string, lazilyLoad: boolean): any;

  moduleIsInitialized(moduleClass: typeof NSObject): boolean;

  modulesConformingToProtocol(protocol: any /* Protocol */): NSArray<any>;

  onFastRefresh(): void;

  performSelector(aSelector: string): any;

  performSelectorWithObject(aSelector: string, object: any): any;

  performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

  registerAdditionalModuleClasses(newModules: NSArray<typeof NSObject> | typeof NSObject[]): void;

  registerSegmentWithIdPath(segmentId: number, path: string): void;

  reload(): void;

  reloadWithReason(reason: string): void;

  requestReload(): void;

  respondsToSelector(aSelector: string): boolean;

  retainCount(): number;

  self(): this;

  setRCTTurboModuleRegistry(turboModuleRegistry: RCTTurboModuleRegistry): void;

  setUp(): void;

  start(): void;

  startProfiling(): void;

  stopProfiling(callback: (p1: NSData) => void): void;

  updateModuleWithInstance(instance: RCTBridgeModule): void;
}

interface RCTBridgeDelegate extends NSObjectProtocol {
  bridgeDidNotFindModule?(bridge: RCTBridge, moduleName: string): boolean;

  extraLazyModuleClassesForBridge?(bridge: RCTBridge): NSDictionary<string, typeof NSObject>;

  extraModulesForBridge?(bridge: RCTBridge): NSArray<RCTBridgeModule>;

  loadSourceForBridgeOnProgressOnComplete?(bridge: RCTBridge, onProgress: (p1: RCTLoadingProgress) => void, loadCallback: (p1: NSError, p2: RCTSource) => void): void;

  loadSourceForBridgeWithBlock?(bridge: RCTBridge, loadCallback: (p1: NSError, p2: RCTSource) => void): void;

  shouldBridgeUseCustomJSC?(bridge: RCTBridge): boolean;

  sourceURLForBridge(bridge: RCTBridge): NSURL;
}
declare var RCTBridgeDelegate: {
  prototype: RCTBridgeDelegate;
};

declare var RCTBridgeDidDownloadScriptNotification: string;

declare var RCTBridgeDidDownloadScriptNotificationBridgeDescriptionKey: string;

declare var RCTBridgeDidDownloadScriptNotificationReasonKey: string;

declare var RCTBridgeDidDownloadScriptNotificationSourceKey: string;

declare var RCTBridgeDidInvalidateModulesNotification: string;

declare var RCTBridgeFastRefreshNotification: string;

interface RCTBridgeModule extends NSObjectProtocol {
  bridge?: RCTBridge;

  bundleManager?: RCTBundleManager;

  callableJSModules?: RCTCallableJSModules;

  methodQueue?: NSObject;

  moduleRegistry?: RCTModuleRegistry;

  viewRegistry_DEPRECATED?: RCTViewRegistry;

  batchDidComplete?(): void;

  constantsToExport?(): NSDictionary<any, any>;

  methodsToExport?(): NSArray<any>;

  partialBatchDidFlush?(): void;
}
declare var RCTBridgeModule: {
  prototype: RCTBridgeModule;

  moduleName(): string;

  requiresMainQueueSetup?(): boolean;
};

declare function RCTBridgeModuleNameForClass(bridgeModuleClass: typeof NSObject): string;

declare var RCTBridgeWillBeInvalidatedNotification: string;

declare var RCTBridgeWillDownloadScriptNotification: string;

declare var RCTBridgeWillInvalidateModulesNotification: string;

declare var RCTBridgeWillReloadNotification: string;

declare class RCTBundleManager extends NSObject {
  static alloc(): RCTBundleManager; // inherited from NSObject

  static new(): RCTBundleManager; // inherited from NSObject

  bundleURL: NSURL;

  resetBundleURL(): void;

  setBridge(bridge: RCTBridge): void;

  setBridgelessBundleURLGetterAndSetterAndDefaultGetter(getter: () => NSURL, setter: (p1: NSURL) => void, defaultGetter: () => NSURL): void;
}

declare function RCTBundlePathForURL(URL: NSURL): string;

declare class RCTCallableJSModules extends NSObject {
  static alloc(): RCTCallableJSModules; // inherited from NSObject

  static new(): RCTCallableJSModules; // inherited from NSObject

  invokeModuleMethodWithArgs(moduleName: string, methodName: string, args: NSArray<any> | any[]): void;

  invokeModuleMethodWithArgsOnComplete(moduleName: string, methodName: string, args: NSArray<any> | any[], onComplete: () => void): void;

  setBridge(bridge: RCTBridge): void;

  setBridgelessJSModuleMethodInvoker(bridgelessJSModuleMethodInvoker: (p1: string, p2: string, p3: NSArray<any>, p4: () => void) => void): void;
}

declare function RCTCeilPixelValue(value: number): number;

declare function RCTClassOverridesClassMethod(cls: typeof NSObject, selector: string): boolean;

declare function RCTClassOverridesInstanceMethod(cls: typeof NSObject, selector: string): boolean;

declare function RCTColorToHexString(color: any): string;

declare function RCTComputeScreenScale(): void;

declare class RCTConvert extends NSObject {
  static NSString(json: any): string;

  static NSURL(json: any): NSURL;

  static alloc(): RCTConvert; // inherited from NSObject

  static new(): RCTConvert; // inherited from NSObject
}

declare function RCTCurrentThreadName(): string;

declare class RCTCxxBridge extends RCTBridge {
  static alloc(): RCTCxxBridge; // inherited from NSObject

  static currentBridge(): RCTCxxBridge; // inherited from RCTBridge

  static new(): RCTCxxBridge; // inherited from NSObject

  readonly runtime: interop.Pointer | interop.Reference<any>;

  constructor(o: { parentBridge: RCTBridge });

  initWithParentBridge(bridge: RCTBridge): this;
}

declare function RCTDataURL(mimeType: string, data: NSData): NSURL;

declare var RCTDefaultLogFunction: (p1: RCTLogLevel, p2: RCTLogSource, p3: string, p4: number, p5: string) => void;

declare var RCTDidInitializeModuleNotification: string;

declare var RCTDidSetupModuleNotification: string;

declare var RCTDidSetupModuleNotificationModuleNameKey: string;

declare var RCTDidSetupModuleNotificationSetupTimeKey: string;

declare function RCTDisableTurboModuleManagerDelegateLocking(enabled: boolean): void;

declare function RCTDisableViewConfigEventValidAttributes(disabled: boolean): void;

declare function RCTDropReactPrefixes(s: string): string;

declare function RCTEnableTurboModule(enabled: boolean): void;

declare function RCTEnableTurboModuleEagerInit(enabled: boolean): void;

declare function RCTEnableTurboModuleSharedMutexInit(enabled: boolean): void;

declare function RCTEnforceNewArchitectureValidation(type: RCTNotAllowedValidation, context: any, extra: string): void;

declare var RCTErrorDomain: string;

declare function RCTErrorNewArchitectureValidation(type: RCTNotAllowedValidation, context: any, extra: string): void;

declare var RCTErrorUnspecified: string;

declare function RCTErrorWithMessage(message: string): NSError;

declare function RCTErrorWithNSException(exception: NSException): NSError;

declare function RCTExecuteOnMainQueue(block: () => void): void;

declare function RCTFatal(error: NSError): void;

declare function RCTFatalException(exception: NSException): void;

declare var RCTFatalExceptionName: string;

declare function RCTFloorPixelValue(value: number): number;

declare function RCTFontSizeMultiplier(): number;

declare function RCTForceTouchAvailable(): boolean;

declare function RCTFormatError(message: string, stacktrace: NSArray<NSDictionary<string, any>> | NSDictionary<string, any>[], maxMessageLength: number): string;

declare function RCTFormatLog(timestamp: Date, level: RCTLogLevel, fileName: string, lineNumber: number, message: string): string;

declare function RCTFormatLogLevel(p1: RCTLogLevel): string;

declare function RCTFormatLogSource(p1: RCTLogSource): string;

declare function RCTFormatStackTrace(stackTrace: NSArray<NSDictionary<string, any>> | NSDictionary<string, any>[]): string;

declare class RCTFrameUpdate extends NSObject {
  static alloc(): RCTFrameUpdate; // inherited from NSObject

  static new(): RCTFrameUpdate; // inherited from NSObject

  readonly deltaTime: number;

  readonly timestamp: number;

  constructor(o: { displayLink: CADisplayLink });

  initWithDisplayLink(displayLink: CADisplayLink): this;
}

interface RCTFrameUpdateObserver extends NSObjectProtocol {
  pauseCallback: () => void;

  paused: boolean;

  didUpdateFrame(update: RCTFrameUpdate): void;
}
declare var RCTFrameUpdateObserver: {
  prototype: RCTFrameUpdateObserver;
};

declare function RCTGetAssertFunction(): (p1: string, p2: string, p3: number, p4: string, p5: string) => void;

declare function RCTGetFatalExceptionHandler(): (p1: NSException) => void;

declare function RCTGetFatalHandler(): (p1: NSError) => void;

declare function RCTGetLogFunction(): (p1: RCTLogLevel, p2: RCTLogSource, p3: string, p4: number, p5: string) => void;

declare function RCTGetLogThreshold(): RCTLogLevel;

declare function RCTGetModuleClasses(): NSArray<typeof NSObject>;

declare function RCTGetRGBAColorComponents(color: any, rgba: interop.Reference<number>): void;

declare function RCTGetTurboModuleCleanupMode(): RCTTurboModuleCleanupMode;

declare function RCTGetURLQueryParam(URL: NSURL, param: string): string;

declare function RCTGzipData(data: NSData, level: number): NSData;

declare function RCTHumanReadableType(obj: NSObject): string;

declare function RCTImageFromLocalAssetURL(imageURL: NSURL): UIImage;

declare function RCTImageFromLocalBundleAssetURL(imageURL: NSURL): UIImage;

interface RCTInvalidating extends NSObjectProtocol {
  invalidate(): void;
}
declare var RCTInvalidating: {
  prototype: RCTInvalidating;
};

declare function RCTIsAppActive(): boolean;

declare function RCTIsBundleAssetURL(imageURL: NSURL): boolean;

declare function RCTIsLibraryAssetURL(imageURL: NSURL): boolean;

declare function RCTIsLocalAssetURL(imageURL: NSURL): boolean;

declare function RCTIsMainQueue(): boolean;

declare function RCTIsMainQueueFunction(): boolean;

declare function RCTJSErrorFromCodeMessageAndNSError(code: string, message: string, error: NSError): NSDictionary<string, any>;

declare function RCTJSErrorFromNSError(error: NSError): NSDictionary<string, any>;

declare var RCTJSExtraDataKey: string;

declare function RCTJSONClean(object: any): any;

declare function RCTJSONParse(jsonString: string, error: interop.Pointer | interop.Reference<NSError>): any;

declare function RCTJSONParseMutable(jsonString: string, error: interop.Pointer | interop.Reference<NSError>): any;

declare function RCTJSONStringify(jsonObject: any, error: interop.Pointer | interop.Reference<NSError>): string;

declare var RCTJSRawStackTraceKey: string;

declare var RCTJSStackTraceKey: string;

declare var RCTJSThread: NSObject;

declare var RCTJavaScriptDidFailToLoadNotification: string;

declare var RCTJavaScriptDidLoadNotification: string;

interface RCTJavaScriptExecutor extends RCTBridgeModule, RCTInvalidating {
  valid: boolean;

  callFunctionOnModuleMethodArgumentsCallback(module: string, method: string, args: NSArray<any> | any[], onComplete: (p1: any, p2: NSError) => void): void;

  executeApplicationScriptSourceURLOnComplete(script: NSData, sourceURL: NSURL, onComplete: (p1: NSError) => void): void;

  executeAsyncBlockOnJavaScriptQueue(block: () => void): void;

  executeBlockOnJavaScriptQueue(block: () => void): void;

  flushedQueue(onComplete: (p1: any, p2: NSError) => void): void;

  injectJSONTextAsGlobalObjectNamedCallback(script: string, objectName: string, onComplete: (p1: NSError) => void): void;

  invokeCallbackIDArgumentsCallback(cbID: number, args: NSArray<any> | any[], onComplete: (p1: any, p2: NSError) => void): void;

  setUp(): void;
}
declare var RCTJavaScriptExecutor: {
  prototype: RCTJavaScriptExecutor;

  moduleName(): string;

  requiresMainQueueSetup?(): boolean;
};

declare class RCTJavaScriptLoader extends NSObject {
  static alloc(): RCTJavaScriptLoader; // inherited from NSObject

  static attemptSynchronousLoadOfBundleAtURLSourceLengthError(scriptURL: NSURL, sourceLength: interop.Pointer | interop.Reference<number>): NSData;

  static loadBundleAtURLOnProgressOnComplete(scriptURL: NSURL, onProgress: (p1: RCTLoadingProgress) => void, onComplete: (p1: NSError, p2: RCTSource) => void): void;

  static new(): RCTJavaScriptLoader; // inherited from NSObject
}

declare const RCTJavaScriptLoaderErrorBCNotSupported: number;

declare const RCTJavaScriptLoaderErrorBCVersion: number;

declare const RCTJavaScriptLoaderErrorCannotBeLoadedSynchronously: number;

declare var RCTJavaScriptLoaderErrorDomain: string;

declare const RCTJavaScriptLoaderErrorFailedOpeningFile: number;

declare const RCTJavaScriptLoaderErrorFailedReadingFile: number;

declare const RCTJavaScriptLoaderErrorFailedStatingFile: number;

declare const RCTJavaScriptLoaderErrorNoScriptURL: number;

declare const RCTJavaScriptLoaderErrorURLLoadFailed: number;

declare var RCTJavaScriptWillStartExecutingNotification: string;

declare var RCTJavaScriptWillStartLoadingNotification: string;

declare function RCTKeyWindow(): UIWindow;

declare function RCTLibraryPath(): string;

declare function RCTLibraryPathForURL(URL: NSURL): string;

declare class RCTLoadingProgress extends NSObject {
  static alloc(): RCTLoadingProgress; // inherited from NSObject

  static new(): RCTLoadingProgress; // inherited from NSObject

  done: number;

  status: string;

  total: number;
}

declare const enum RCTLogLevel {
  Trace = 0,

  Info = 1,

  Warning = 2,

  Error = 3,

  Fatal = 4,
}

declare function RCTLogNewArchitectureValidation(type: RCTNotAllowedValidation, context: any, extra: string): void;

declare function RCTLogSetBridgeCallableJSModules(callableJSModules: RCTCallableJSModules): void;

declare function RCTLogSetBridgeModuleRegistry(moduleRegistry: RCTModuleRegistry): void;

declare function RCTLogSetBridgelessCallableJSModules(callableJSModules: RCTCallableJSModules): void;

declare function RCTLogSetBridgelessModuleRegistry(moduleRegistry: RCTModuleRegistry): void;

declare const enum RCTLogSource {
  Native = 1,

  JavaScript = 2,
}

declare function RCTMD5Hash(string: string): string;

declare function RCTMakeAndLogError(message: string, toStringify: any, extraData: NSDictionary<string, any>): NSDictionary<string, any>;

declare function RCTMakeError(message: string, toStringify: any, extraData: NSDictionary<string, any>): NSDictionary<string, any>;

interface RCTMethodInfo {
  jsName: string;
  objcName: string;
  isSync: boolean;
}
declare var RCTMethodInfo: interop.StructType<RCTMethodInfo>;

declare class RCTModuleRegistry extends NSObject {
  static alloc(): RCTModuleRegistry; // inherited from NSObject

  static new(): RCTModuleRegistry; // inherited from NSObject

  moduleForName(moduleName: string | interop.Pointer | interop.Reference<any>): any;

  moduleForNameLazilyLoadIfNecessary(moduleName: string | interop.Pointer | interop.Reference<any>, lazilyLoad: boolean): any;

  setBridge(bridge: RCTBridge): void;

  setTurboModuleRegistry(turboModuleRegistry: RCTTurboModuleRegistry): void;
}

declare function RCTNewArchitectureSetMinValidationLevel(level: RCTNotAllowedValidation): void;

declare function RCTNewArchitectureValidationPlaceholder(type: RCTNotAllowedValidation, context: any, extra: string): void;

declare const enum RCTNotAllowedValidation {
  InBridgeless = 1,

  InFabricWithoutLegacy = 2,

  ValidationDisabled = 3,
}

declare var RCTObjCStackTraceKey: string;

declare function RCTPerformBlockWithAssertFunction(block: () => void, assertFunction: (p1: string, p2: string, p3: number, p4: string, p5: string) => void): void;

declare function RCTPerformBlockWithLogFunction(block: () => void, logFunction: (p1: RCTLogLevel, p2: RCTLogSource, p3: string, p4: number, p5: string) => void): void;

declare function RCTPerformBlockWithLogPrefix(block: () => void, prefix: string): void;

declare function RCTPresentedViewController(): UIViewController;

declare function RCTRedBoxGetEnabled(): boolean;

declare function RCTRedBoxSetEnabled(enabled: boolean): void;

declare function RCTRegisterModule(p1: typeof NSObject): void;

declare function RCTRegisterReloadCommandListener(listener: RCTReloadListener): void;

declare function RCTReloadCommandSetBundleURL(URL: NSURL): void;

interface RCTReloadListener {
  didReceiveReloadCommand(): void;
}
declare var RCTReloadListener: {
  prototype: RCTReloadListener;
};

declare function RCTRoundPixelValue(value: number): number;

declare function RCTRunningInAppExtension(): boolean;

declare function RCTRunningInTestEnvironment(): boolean;

declare function RCTSanitizeNaNValue(value: number, property: string): number;

declare function RCTScreenScale(): number;

declare function RCTScreenSize(): CGSize;

declare function RCTSetAssertFunction(assertFunction: (p1: string, p2: string, p3: number, p4: string, p5: string) => void): void;

declare function RCTSetFatalExceptionHandler(fatalExceptionHandler: (p1: NSException) => void): void;

declare function RCTSetFatalHandler(fatalHandler: (p1: NSError) => void): void;

declare function RCTSetLogFunction(logFunction: (p1: RCTLogLevel, p2: RCTLogSource, p3: string, p4: number, p5: string) => void): void;

declare function RCTSetLogThreshold(threshold: RCTLogLevel): void;

declare function RCTSetTurboModuleCleanupMode(mode: RCTTurboModuleCleanupMode): void;

declare function RCTSharedApplication(): UIApplication;

declare function RCTSizeInPixels(pointSize: CGSize, scale: number): CGSize;

declare class RCTSource extends NSObject {
  static alloc(): RCTSource; // inherited from NSObject

  static new(): RCTSource; // inherited from NSObject

  readonly data: NSData;

  readonly filesChangedCount: number;

  readonly length: number;

  readonly url: NSURL;
}

declare const RCTSourceFilesChangedCountNotBuiltByBundler: number;

declare const RCTSourceFilesChangedCountRebuiltFromScratch: number;

declare function RCTSwapClassMethods(cls: typeof NSObject, original: string, replacement: string): void;

declare function RCTSwapInstanceMethodWithBlock(cls: typeof NSObject, original: string, replacementBlock: any, replacementSelector: string): void;

declare function RCTSwapInstanceMethods(cls: typeof NSObject, original: string, replacement: string): void;

declare function RCTTempFilePath(extension: string, error: interop.Pointer | interop.Reference<NSError>): string;

declare var RCTTriggerReloadCommandBundleURLKey: string;

declare function RCTTriggerReloadCommandListeners(reason: string): void;

declare var RCTTriggerReloadCommandNotification: string;

declare var RCTTriggerReloadCommandReasonKey: string;

declare const enum RCTTurboModuleCleanupMode {
  kRCTGlobalScope = 0,

  kRCTGlobalScopeUsingRetainJSCallback = 1,

  kRCTTurboModuleManagerScope = 2,
}

declare function RCTTurboModuleEagerInitEnabled(): boolean;

declare function RCTTurboModuleEnabled(): boolean;

declare function RCTTurboModuleManagerDelegateLockingDisabled(): boolean;

interface RCTTurboModuleRegistry extends NSObjectProtocol {
  eagerInitMainQueueModuleNames(): NSArray<string>;

  eagerInitModuleNames(): NSArray<string>;

  moduleForName(moduleName: string | interop.Pointer | interop.Reference<any>): any;

  moduleForNameWarnOnLookupFailure(moduleName: string | interop.Pointer | interop.Reference<any>, warnOnLookupFailure: boolean): any;

  moduleIsInitialized(moduleName: string | interop.Pointer | interop.Reference<any>): boolean;
}
declare var RCTTurboModuleRegistry: {
  prototype: RCTTurboModuleRegistry;
};

declare function RCTTurboModuleSharedMutexInitEnabled(): boolean;

declare function RCTUIKitLocalizedString(string: string): string;

declare function RCTUIManagerTypeForTagIsFabric(reactTag: number): boolean;

declare function RCTURLByReplacingQueryParam(URL: NSURL, param: string, value: string): NSURL;

declare function RCTUnsafeExecuteOnMainQueueSync(block: () => void): void;

declare class RCTUtilsUIOverride extends NSObject {
  static alloc(): RCTUtilsUIOverride; // inherited from NSObject

  static hasPresentedViewController(): boolean;

  static new(): RCTUtilsUIOverride; // inherited from NSObject

  static presentedViewController(): UIViewController;

  static setPresentedViewController(presentedViewController: UIViewController): void;
}

declare function RCTValidateTypeOfViewCommandArgument(obj: NSObject, expectedClass: any, expectedType: string, componentName: string, commandName: string, argPos: string): boolean;

declare function RCTViewConfigEventValidAttributesDisabled(): boolean;

declare class RCTViewRegistry extends NSObject {
  static alloc(): RCTViewRegistry; // inherited from NSObject

  static new(): RCTViewRegistry; // inherited from NSObject

  addUIBlock(block: (p1: RCTViewRegistry) => void): void;

  setBridge(bridge: RCTBridge): void;

  setBridgelessComponentViewProvider(bridgelessComponentViewProvider: (p1: number) => UIView): void;

  viewForReactTag(reactTag: number): UIView;
}

declare function RCTViewportSize(): CGSize;

declare function RCTZeroIfNaN(value: number): number;

declare var RCT_BYTECODE_ALIGNMENT: number;

declare var ReactVersionNumber: number;

declare var ReactVersionString: interop.Reference<number>;

declare function _RCTInitializeJSThreadConstantInternal(): void;

declare function _RCTLogJavaScriptInternal(p1: RCTLogLevel, p2: string): void;

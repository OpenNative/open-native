declare function RCTAddAssertFunction(
  assertFunction: (
    p1: string,
    p2: string,
    p3: number,
    p4: string,
    p5: string
  ) => void
): void;

declare function RCTAddLogFunction(
  logFunction: (
    p1: RCTLogLevel,
    p2: RCTLogSource,
    p3: string,
    p4: number,
    p5: string
  ) => void
): void;

declare class RCTAlertController extends UIAlertController {
  static alertControllerWithTitleMessagePreferredStyle(
    title: string,
    message: string,
    preferredStyle: UIAlertControllerStyle
  ): RCTAlertController; // inherited from UIAlertController

  static alloc(): RCTAlertController; // inherited from NSObject

  static new(): RCTAlertController; // inherited from NSObject

  hide(): void;

  showCompletion(animated: boolean, completion: () => void): void;
}

declare class RCTAlertManager
  extends NSObject
  implements RCTBridgeModule, RCTInvalidating
{
  static alloc(): RCTAlertManager; // inherited from NSObject

  static moduleName(): string;

  static new(): RCTAlertManager; // inherited from NSObject

  static requiresMainQueueSetup(): boolean;

  readonly bridge: RCTBridge; // inherited from RCTBridgeModule

  bundleManager: RCTBundleManager; // inherited from RCTBridgeModule

  callableJSModules: RCTCallableJSModules; // inherited from RCTBridgeModule

  readonly debugDescription: string; // inherited from NSObjectProtocol

  readonly description: string; // inherited from NSObjectProtocol

  readonly hash: number; // inherited from NSObjectProtocol

  readonly isProxy: boolean; // inherited from NSObjectProtocol

  readonly methodQueue: NSObject; // inherited from RCTBridgeModule

  moduleRegistry: RCTModuleRegistry; // inherited from RCTBridgeModule

  readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

  viewRegistry_DEPRECATED: RCTViewRegistry; // inherited from RCTBridgeModule

  readonly; // inherited from NSObjectProtocol

  alertWithArgsCallback(
    args: NSDictionary<any, any>,
    callback: (p1: NSArray<any>) => void
  ): void;

  batchDidComplete(): void;

  class(): typeof NSObject;

  conformsToProtocol(aProtocol: any /* Protocol */): boolean;

  constantsToExport(): NSDictionary<any, any>;

  invalidate(): void;

  isEqual(object: any): boolean;

  isKindOfClass(aClass: typeof NSObject): boolean;

  isMemberOfClass(aClass: typeof NSObject): boolean;

  methodsToExport(): NSArray<any>;

  partialBatchDidFlush(): void;

  performSelector(aSelector: string): any;

  performSelectorWithObject(aSelector: string, object: any): any;

  performSelectorWithObjectWithObject(
    aSelector: string,
    object1: any,
    object2: any
  ): any;

  respondsToSelector(aSelector: string): boolean;

  retainCount(): number;

  self(): this;
}

declare const enum RCTAlertViewStyle {
  Default = 0,

  SecureTextInput = 1,

  PlainTextInput = 2,

  LoginAndPasswordInput = 3,
}

declare function RCTAllocateRootViewTag(): number;

interface RCTAutoInsetsProtocol {
  automaticallyAdjustContentInsets: boolean;

  contentInset: UIEdgeInsets;

  refreshContentInset(): void;
}
declare var RCTAutoInsetsProtocol: {
  prototype: RCTAutoInsetsProtocol;
};

declare class RCTBridge extends NSObject {
  static alloc(): RCTBridge; // inherited from NSObject

  static currentBridge(): RCTBridge;

  static new(): RCTBridge; // inherited from NSObject

  static setCurrentBridge(bridge: RCTBridge): void;

  batchedBridge: RCTBridge;

  readonly moduleRegistry: RCTModuleRegistry;

  readonly uiManager: RCTUIManager;

  callMethodInvocationArgsTypesSyncRRIRejRejICbCbIEEI(
    invocation: NSInvocation,
    args: NSArray<any> | any[],
    types: NSArray<any> | any[],
    sync: boolean,
    r: (p1: any) => void,
    rI: number,
    rej: (p1: string, p2: string, p3: NSError) => void,
    rejI: number,
    cb: (p1: NSArray<any>) => void,
    cbI: number,
    e: (p1: NSError) => void,
    eI: number
  ): any;

  enqueueCallbackArgs(cbID: number, args: NSArray<any> | any[]): void;

  enqueueJSCallArgs(moduleDotMethod: string, args: NSArray<any> | any[]): void;

  enqueueJSCallMethodArgsCompletion(
    module: string,
    method: string,
    args: NSArray<any> | any[],
    completion: () => void
  ): void;

  eventDispatcher(): RCTEventDispatcherProtocol;

  getModuleMethodObjcNames(name: string): NSDictionary<any, any>;

  moduleForClass(moduleClass: typeof NSObject): any;

  moduleForName(moduleName: string): any;

  moduleForNameLazilyLoadIfNecessary(
    moduleName: string,
    lazilyLoad: boolean
  ): any;

  setJSModuleInvokerCallback(
    callback: (p1: string, p2: string, p3: NSArray<any>, p4: () => void) => void
  ): void;
}

interface RCTBridgeDelegate extends NSObjectProtocol {
  bridgeDidNotFindModule?(bridge: RCTBridge, moduleName: string): boolean;

  extraLazyModuleClassesForBridge?(
    bridge: RCTBridge
  ): NSDictionary<string, typeof NSObject>;

  extraModulesForBridge?(bridge: RCTBridge): NSArray<RCTBridgeModule>;

  loadSourceForBridgeOnProgressOnComplete?(
    bridge: RCTBridge,
    onProgress: (p1: RCTLoadingProgress) => void,
    loadCallback: (p1: NSError, p2: RCTSource) => void
  ): void;

  loadSourceForBridgeWithBlock?(
    bridge: RCTBridge,
    loadCallback: (p1: NSError, p2: RCTSource) => void
  ): void;

  shouldBridgeUseCustomJSC?(bridge: RCTBridge): boolean;

  sourceURLForBridge(bridge: RCTBridge): NSURL;
}
declare var RCTBridgeDelegate: {
  prototype: RCTBridgeDelegate;
};

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

declare function RCTBridgeModuleNameForClass(
  bridgeModuleClass: typeof NSObject
): string;

declare class RCTBundleManager extends NSObject {
  static alloc(): RCTBundleManager; // inherited from NSObject

  static new(): RCTBundleManager; // inherited from NSObject
}

declare function RCTBundlePathForURL(URL: NSURL): string;

declare class RCTCallableJSModules extends NSObject {
  static alloc(): RCTCallableJSModules; // inherited from NSObject

  static new(): RCTCallableJSModules; // inherited from NSObject

  invokeModuleMethodWithArgs(
    moduleName: string,
    methodName: string,
    args: NSArray<any> | any[]
  ): void;

  invokeModuleMethodWithArgsOnComplete(
    moduleName: string,
    methodName: string,
    args: NSArray<any> | any[],
    onComplete: () => void
  ): void;

  setBridge(bridge: RCTBridge): void;

  setBridgelessJSModuleMethodInvoker(
    bridgelessJSModuleMethodInvoker: (
      p1: string,
      p2: string,
      p3: NSArray<any>,
      p4: () => void
    ) => void
  ): void;
}

declare function RCTCeilPixelValue(value: number): number;

declare function RCTClassOverridesClassMethod(
  cls: typeof NSObject,
  selector: string
): boolean;

declare function RCTClassOverridesInstanceMethod(
  cls: typeof NSObject,
  selector: string
): boolean;

declare function RCTColorToHexString(color: any): string;

interface RCTComponent extends NSObjectProtocol {
  reactTag: number;
}
declare var RCTComponent: {
  prototype: RCTComponent;
};

declare class RCTComponentEvent extends NSObject implements RCTEvent {
  static alloc(): RCTComponentEvent; // inherited from NSObject

  static moduleDotMethod(): string;

  static new(): RCTComponentEvent; // inherited from NSObject

  readonly coalescingKey: number; // inherited from RCTEvent

  readonly debugDescription: string; // inherited from NSObjectProtocol

  readonly description: string; // inherited from NSObjectProtocol

  readonly eventName: string; // inherited from RCTEvent

  readonly hash: number; // inherited from NSObjectProtocol

  readonly isProxy: boolean; // inherited from NSObjectProtocol

  readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

  readonly viewTag: number; // inherited from RCTEvent

  readonly; // inherited from NSObjectProtocol

  constructor(o: {
    name: string;
    viewTag: number;
    body: NSDictionary<any, any>;
  });

  arguments(): NSArray<any>;

  canCoalesce(): boolean;

  class(): typeof NSObject;

  coalesceWithEvent(newEvent: RCTEvent): RCTEvent;

  conformsToProtocol(aProtocol: any /* Protocol */): boolean;

  initWithNameViewTagBody(
    name: string,
    viewTag: number,
    body: NSDictionary<any, any>
  ): this;

  isEqual(object: any): boolean;

  isKindOfClass(aClass: typeof NSObject): boolean;

  isMemberOfClass(aClass: typeof NSObject): boolean;

  performSelector(aSelector: string): any;

  performSelectorWithObject(aSelector: string, object: any): any;

  performSelectorWithObjectWithObject(
    aSelector: string,
    object1: any,
    object2: any
  ): any;

  respondsToSelector(aSelector: string): boolean;

  retainCount(): number;

  self(): this;
}

declare function RCTComputeScreenScale(): void;

declare function RCTContentInsets(view: UIView): UIEdgeInsets;

declare class RCTConvert extends NSObject {
  static BOOL(json: any): boolean;

  static CGAffineTransform(json: any): CGAffineTransform;

  static CGFloat(json: any): number;

  static CGImage(json: any): any;

  static CGLineCap(json: any): CGLineCap;

  static CGLineJoin(json: any): CGLineJoin;

  static CGPoint(json: any): CGPoint;

  static CGRect(json: any): CGRect;

  static CGSize(json: any): CGSize;

  static NSArray(json: any): NSArray<any>;

  static NSArrayArray(json: any): NSArray<NSArray<any>>;

  static NSData(json: any): NSData;

  static NSDate(json: any): Date;

  static NSDictionary(json: any): NSDictionary<any, any>;

  static NSDictionaryArray(json: any): NSArray<NSDictionary<any, any>>;

  static NSIndexSet(json: any): NSIndexSet;

  static NSInteger(json: any): number;

  static NSLineBreakMode(json: any): NSLineBreakMode;

  static NSLocale(json: any): NSLocale;

  static NSNumber(json: any): number;

  static NSNumberArray(json: any): NSArray<number>;

  static NSPropertyList(json: any): any;

  static NSSet(json: any): NSSet<any>;

  static NSString(json: any): string;

  static NSStringArray(json: any): NSArray<string>;

  static NSStringArrayArray(json: any): NSArray<NSArray<string>>;

  static NSTextAlignment(json: any): NSTextAlignment;

  static NSTimeInterval(json: any): number;

  static NSTimeZone(json: any): NSTimeZone;

  static NSUInteger(json: any): number;

  static NSURL(json: any): NSURL;

  static NSURLArray(json: any): NSArray<NSURL>;

  static NSURLRequest(json: any): NSURLRequest;

  static NSURLRequestCachePolicy(json: any): NSURLRequestCachePolicy;

  static NSUnderlineStyle(json: any): NSUnderlineStyle;

  static NSWritingDirection(json: any): NSWritingDirection;

  static RCTFileURL(json: any): NSURL;

  static RCTFileURLArray(json: any): NSArray<NSURL>;

  static UIBarStyle(json: any): UIBarStyle;

  static UIDataDetectorTypes(json: any): UIDataDetectorTypes;

  static UIEdgeInsets(json: any): UIEdgeInsets;

  static UIImage(json: any): UIImage;

  static UIKeyboardAppearance(json: any): UIKeyboardAppearance;

  static UIKeyboardType(json: any): UIKeyboardType;

  static UIReturnKeyType(json: any): UIReturnKeyType;

  static UITextAutocapitalizationType(json: any): UITextAutocapitalizationType;

  static UITextFieldViewMode(json: any): UITextFieldViewMode;

  static UIViewContentMode(json: any): UIViewContentMode;

  static WKDataDetectorTypes(json: any): WKDataDetectorTypes;

  static alloc(): RCTConvert; // inherited from NSObject

  static double(json: any): number;

  static float(json: any): number;

  static id(json: any): any;

  static int(json: any): number;

  static int64_t(json: any): number;

  static new(): RCTConvert; // inherited from NSObject

  static uint64_t(json: any): number;
}

declare function RCTConvertArrayValue(p1: string, p2: any): NSArray<any>;

declare function RCTConvertEnumValue(
  p1: string | interop.Pointer | interop.Reference<any>,
  p2: NSDictionary<any, any>,
  p3: number,
  p4: any
): number;

declare function RCTConvertMultiEnumValue(
  p1: string | interop.Pointer | interop.Reference<any>,
  p2: NSDictionary<any, any>,
  p3: number,
  p4: any
): number;

declare function RCTCurrentThreadName(): string;

declare class RCTCxxConvert extends NSObject {
  static alloc(): RCTCxxConvert; // inherited from NSObject

  static new(): RCTCxxConvert; // inherited from NSObject
}

declare function RCTDataURL(mimeType: string, data: NSData): NSURL;

declare var RCTDefaultLogFunction: (
  p1: RCTLogLevel,
  p2: RCTLogSource,
  p3: string,
  p4: number,
  p5: string
) => void;

declare function RCTDropReactPrefixes(s: string): string;

declare function RCTEnforceNewArchitectureValidation(
  type: RCTNotAllowedValidation,
  context: any,
  extra: string
): void;

declare var RCTErrorDomain: string;

declare function RCTErrorNewArchitectureValidation(
  type: RCTNotAllowedValidation,
  context: any,
  extra: string
): void;

declare var RCTErrorUnspecified: string;

declare function RCTErrorWithMessage(message: string): NSError;

declare function RCTErrorWithNSException(exception: NSException): NSError;

interface RCTEvent extends NSObjectProtocol {
  coalescingKey?: number;

  eventName: string;

  viewTag: number;

  arguments(): NSArray<any>;

  canCoalesce(): boolean;

  coalesceWithEvent?(newEvent: RCTEvent): RCTEvent;
}
declare var RCTEvent: {
  prototype: RCTEvent;

  moduleDotMethod(): string;
};

declare class RCTEventDispatcher
  extends NSObject
  implements RCTEventDispatcherProtocol, RCTInitializing
{
  static alloc(): RCTEventDispatcher; // inherited from NSObject

  static moduleName(): string;

  static new(): RCTEventDispatcher; // inherited from NSObject

  static requiresMainQueueSetup(): boolean;

  readonly bridge: RCTBridge; // inherited from RCTBridgeModule

  bundleManager: RCTBundleManager; // inherited from RCTBridgeModule

  callableJSModules: RCTCallableJSModules; // inherited from RCTBridgeModule

  readonly debugDescription: string; // inherited from NSObjectProtocol

  readonly description: string; // inherited from NSObjectProtocol

  dispatchToJSThread: (p1: () => void) => void; // inherited from RCTJSDispatcherModule

  readonly hash: number; // inherited from NSObjectProtocol

  readonly isProxy: boolean; // inherited from NSObjectProtocol

  readonly methodQueue: NSObject; // inherited from RCTBridgeModule

  moduleRegistry: RCTModuleRegistry; // inherited from RCTBridgeModule

  readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

  viewRegistry_DEPRECATED: RCTViewRegistry; // inherited from RCTBridgeModule

  readonly; // inherited from NSObjectProtocol

  addDispatchObserver(observer: RCTEventDispatcherObserver): void;

  batchDidComplete(): void;

  class(): typeof NSObject;

  conformsToProtocol(aProtocol: any /* Protocol */): boolean;

  constantsToExport(): NSDictionary<any, any>;

  initialize(): void;

  isEqual(object: any): boolean;

  isKindOfClass(aClass: typeof NSObject): boolean;

  isMemberOfClass(aClass: typeof NSObject): boolean;

  methodsToExport(): NSArray<any>;

  partialBatchDidFlush(): void;

  performSelector(aSelector: string): any;

  performSelectorWithObject(aSelector: string, object: any): any;

  performSelectorWithObjectWithObject(
    aSelector: string,
    object1: any,
    object2: any
  ): any;

  removeDispatchObserver(observer: RCTEventDispatcherObserver): void;

  respondsToSelector(aSelector: string): boolean;

  retainCount(): number;

  self(): this;

  sendAppEventWithNameBody(name: string, body: any): void;

  sendDeviceEventWithNameBody(name: string, body: any): void;

  sendEvent(event: RCTEvent): void;

  sendTextEventWithTypeReactTagTextKeyEventCount(
    type: RCTTextEventType,
    reactTag: number,
    text: string,
    key: string,
    eventCount: number
  ): void;

  sendViewEventWithNameReactTag(name: string, reactTag: number): void;
}

interface RCTEventDispatcherObserver extends NSObjectProtocol {
  eventDispatcherWillDispatchEvent(event: RCTEvent): void;
}
declare var RCTEventDispatcherObserver: {
  prototype: RCTEventDispatcherObserver;
};

interface RCTEventDispatcherProtocol
  extends RCTBridgeModule,
    RCTJSDispatcherModule {
  addDispatchObserver(observer: RCTEventDispatcherObserver): void;

  removeDispatchObserver(observer: RCTEventDispatcherObserver): void;

  sendAppEventWithNameBody(name: string, body: any): void;

  sendDeviceEventWithNameBody(name: string, body: any): void;

  sendEvent(event: RCTEvent): void;

  sendTextEventWithTypeReactTagTextKeyEventCount(
    type: RCTTextEventType,
    reactTag: number,
    text: string,
    key: string,
    eventCount: number
  ): void;

  sendViewEventWithNameReactTag(name: string, reactTag: number): void;
}
declare var RCTEventDispatcherProtocol: {
  prototype: RCTEventDispatcherProtocol;

  moduleName(): string;

  requiresMainQueueSetup?(): boolean;
};

declare class RCTEventEmitter
  extends NSObject
  implements RCTBridgeModule, RCTInvalidating
{
  static alloc(): RCTEventEmitter; // inherited from NSObject

  static moduleName(): string;

  static new(): RCTEventEmitter; // inherited from NSObject

  static requiresMainQueueSetup(): boolean;

  bridge: RCTBridge;

  bundleManager: RCTBundleManager; // inherited from RCTBridgeModule

  callableJSModules: RCTCallableJSModules; // inherited from RCTBridgeModule

  readonly debugDescription: string; // inherited from NSObjectProtocol

  readonly description: string; // inherited from NSObjectProtocol

  readonly hash: number; // inherited from NSObjectProtocol

  readonly isProxy: boolean; // inherited from NSObjectProtocol

  readonly methodQueue: NSObject; // inherited from RCTBridgeModule

  moduleRegistry: RCTModuleRegistry; // inherited from RCTBridgeModule

  readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

  viewRegistry_DEPRECATED: RCTViewRegistry; // inherited from RCTBridgeModule

  readonly; // inherited from NSObjectProtocol

  constructor(o: { disabledObservation: void });

  addListener(eventName: string): void;

  batchDidComplete(): void;

  class(): typeof NSObject;

  conformsToProtocol(aProtocol: any /* Protocol */): boolean;

  constantsToExport(): NSDictionary<any, any>;

  initWithDisabledObservation(): this;

  invalidate(): void;

  isEqual(object: any): boolean;

  isKindOfClass(aClass: typeof NSObject): boolean;

  isMemberOfClass(aClass: typeof NSObject): boolean;

  methodsToExport(): NSArray<any>;

  partialBatchDidFlush(): void;

  performSelector(aSelector: string): any;

  performSelectorWithObject(aSelector: string, object: any): any;

  performSelectorWithObjectWithObject(
    aSelector: string,
    object1: any,
    object2: any
  ): any;

  removeListeners(count: number): void;

  respondsToSelector(aSelector: string): boolean;

  retainCount(): number;

  self(): this;

  sendEventWithNameBody(name: string, body: any): void;

  startObserving(): void;

  stopObserving(): void;

  supportedEvents(): NSArray<string>;
}

declare function RCTExecuteOnMainQueue(block: () => void): void;

declare function RCTExecuteOnUIManagerQueue(block: () => void): void;

declare function RCTFatal(error: NSError): void;

declare function RCTFatalException(exception: NSException): void;

declare var RCTFatalExceptionName: string;

declare function RCTFloorPixelValue(value: number): number;

declare function RCTFontSizeMultiplier(): number;

declare function RCTForceTouchAvailable(): boolean;

declare function RCTFormatError(
  message: string,
  stacktrace: NSArray<NSDictionary<string, any>> | NSDictionary<string, any>[],
  maxMessageLength: number
): string;

declare function RCTFormatLog(
  timestamp: Date,
  level: RCTLogLevel,
  fileName: string,
  lineNumber: number,
  message: string
): string;

declare function RCTFormatLogLevel(p1: RCTLogLevel): string;

declare function RCTFormatLogSource(p1: RCTLogSource): string;

declare function RCTFormatStackTrace(
  stackTrace: NSArray<NSDictionary<string, any>> | NSDictionary<string, any>[]
): string;

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

declare function RCTGetAssertFunction(): (
  p1: string,
  p2: string,
  p3: number,
  p4: string,
  p5: string
) => void;

declare function RCTGetFatalExceptionHandler(): (p1: NSException) => void;

declare function RCTGetFatalHandler(): (p1: NSError) => void;

declare function RCTGetLogFunction(): (
  p1: RCTLogLevel,
  p2: RCTLogSource,
  p3: string,
  p4: number,
  p5: string
) => void;

declare function RCTGetLogThreshold(): RCTLogLevel;

declare function RCTGetModuleClassForName(moduleName: string): typeof NSObject;

declare function RCTGetModuleClasses(): NSDictionary<string, typeof NSObject>;

declare function RCTGetRGBAColorComponents(
  color: any,
  rgba: interop.Reference<number>
): void;

declare function RCTGetUIManagerQueue(): NSObject;

declare function RCTGetURLQueryParam(URL: NSURL, param: string): string;

declare function RCTGzipData(data: NSData, level: number): NSData;

declare function RCTHumanReadableType(obj: NSObject): string;

declare function RCTImageFromLocalAssetURL(imageURL: NSURL): UIImage;

declare function RCTImageFromLocalBundleAssetURL(imageURL: NSURL): UIImage;

interface RCTInitializing extends NSObjectProtocol {
  initialize(): void;
}
declare var RCTInitializing: {
  prototype: RCTInitializing;
};

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

declare function RCTIsMainQueueExecutionOfConstantsToExportDisabled(): boolean;

declare function RCTIsMainQueueFunction(): boolean;

declare function RCTIsPseudoUIManagerQueue(): boolean;

declare function RCTIsUIManagerQueue(): boolean;

interface RCTJSDispatcherModule {
  dispatchToJSThread: (p1: () => void) => void;
}
declare var RCTJSDispatcherModule: {
  prototype: RCTJSDispatcherModule;
};

declare function RCTJSErrorFromCodeMessageAndNSError(
  code: string,
  message: string,
  error: NSError
): NSDictionary<string, any>;

declare function RCTJSErrorFromNSError(
  error: NSError
): NSDictionary<string, any>;

declare var RCTJSExtraDataKey: string;

declare function RCTJSONClean(object: any): any;

declare function RCTJSONParse(
  jsonString: string,
  error: interop.Pointer | interop.Reference<NSError>
): any;

declare function RCTJSONParseMutable(
  jsonString: string,
  error: interop.Pointer | interop.Reference<NSError>
): any;

declare function RCTJSONStringify(
  jsonObject: any,
  error: interop.Pointer | interop.Reference<NSError>
): string;

declare var RCTJSRawStackTraceKey: string;

declare var RCTJSStackTraceKey: string;

declare var RCTJSThread: NSObject;

interface RCTJavaScriptExecutor extends RCTBridgeModule, RCTInvalidating {
  valid: boolean;

  callFunctionOnModuleMethodArgumentsCallback(
    module: string,
    method: string,
    args: NSArray<any> | any[],
    onComplete: (p1: any, p2: NSError) => void
  ): void;

  executeApplicationScriptSourceURLOnComplete(
    script: NSData,
    sourceURL: NSURL,
    onComplete: (p1: NSError) => void
  ): void;

  executeAsyncBlockOnJavaScriptQueue(block: () => void): void;

  executeBlockOnJavaScriptQueue(block: () => void): void;

  flushedQueue(onComplete: (p1: any, p2: NSError) => void): void;

  injectJSONTextAsGlobalObjectNamedCallback(
    script: string,
    objectName: string,
    onComplete: (p1: NSError) => void
  ): void;

  invokeCallbackIDArgumentsCallback(
    cbID: number,
    args: NSArray<any> | any[],
    onComplete: (p1: any, p2: NSError) => void
  ): void;

  setUp(): void;
}
declare var RCTJavaScriptExecutor: {
  prototype: RCTJavaScriptExecutor;

  moduleName(): string;

  requiresMainQueueSetup?(): boolean;
};

declare class RCTJavaScriptLoader extends NSObject {
  static alloc(): RCTJavaScriptLoader; // inherited from NSObject

  static attemptSynchronousLoadOfBundleAtURLSourceLengthError(
    scriptURL: NSURL,
    sourceLength: interop.Pointer | interop.Reference<number>
  ): NSData;

  static loadBundleAtURLOnProgressOnComplete(
    scriptURL: NSURL,
    onProgress: (p1: RCTLoadingProgress) => void,
    onComplete: (p1: NSError, p2: RCTSource) => void
  ): void;

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

declare function RCTKeyWindow(): UIWindow;

declare function RCTLibraryPath(): string;

declare function RCTLibraryPathForURL(URL: NSURL): string;

declare function RCTLinkingClassProvider(
  name: string | interop.Pointer | interop.Reference<any>
): typeof NSObject;

declare class RCTLinkingManager
  extends RCTEventEmitter
  implements RCTBridgeModule
{
  static alloc(): RCTLinkingManager; // inherited from NSObject

  static applicationContinueUserActivityRestorationHandler(
    application: UIApplication,
    userActivity: NSUserActivity,
    restorationHandler: (p1: NSArray<UIUserActivityRestoring>) => void
  ): boolean;

  static applicationOpenURLOptions(
    app: UIApplication,
    URL: NSURL,
    options: NSDictionary<string, any>
  ): boolean;

  static applicationOpenURLSourceApplicationAnnotation(
    application: UIApplication,
    URL: NSURL,
    sourceApplication: string,
    annotation: any
  ): boolean;

  static moduleName(): string;

  static new(): RCTLinkingManager; // inherited from NSObject

  static requiresMainQueueSetup(): boolean;

  readonly bridge: RCTBridge; // inherited from RCTBridgeModule

  bundleManager: RCTBundleManager; // inherited from RCTBridgeModule

  callableJSModules: RCTCallableJSModules; // inherited from RCTBridgeModule

  readonly debugDescription: string; // inherited from NSObjectProtocol

  readonly description: string; // inherited from NSObjectProtocol

  readonly hash: number; // inherited from NSObjectProtocol

  readonly isProxy: boolean; // inherited from NSObjectProtocol

  readonly methodQueue: NSObject; // inherited from RCTBridgeModule

  moduleRegistry: RCTModuleRegistry; // inherited from RCTBridgeModule

  readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

  viewRegistry_DEPRECATED: RCTViewRegistry; // inherited from RCTBridgeModule

  readonly; // inherited from NSObjectProtocol

  batchDidComplete(): void;

  canOpenURLResolveReject(
    URL: string,
    resolve: (p1: any) => void,
    reject: (p1: string, p2: string, p3: NSError) => void
  ): void;

  class(): typeof NSObject;

  conformsToProtocol(aProtocol: any /* Protocol */): boolean;

  constantsToExport(): NSDictionary<any, any>;

  getInitialURLReject(
    resolve: (p1: any) => void,
    reject: (p1: string, p2: string, p3: NSError) => void
  ): void;

  isEqual(object: any): boolean;

  isKindOfClass(aClass: typeof NSObject): boolean;

  isMemberOfClass(aClass: typeof NSObject): boolean;

  methodsToExport(): NSArray<any>;

  openSettingsReject(
    resolve: (p1: any) => void,
    reject: (p1: string, p2: string, p3: NSError) => void
  ): void;

  openURLResolveReject(
    URL: string,
    resolve: (p1: any) => void,
    reject: (p1: string, p2: string, p3: NSError) => void
  ): void;

  partialBatchDidFlush(): void;

  performSelector(aSelector: string): any;

  performSelectorWithObject(aSelector: string, object: any): any;

  performSelectorWithObjectWithObject(
    aSelector: string,
    object1: any,
    object2: any
  ): any;

  respondsToSelector(aSelector: string): boolean;

  retainCount(): number;

  self(): this;

  sendIntentExtrasResolveReject(
    action: string,
    extras: NSArray<any> | any[],
    resolve: (p1: any) => void,
    reject: (p1: string, p2: string, p3: NSError) => void
  ): void;
}

declare function RCTLinkingManagerCls(): typeof NSObject;

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

declare function RCTLogNewArchitectureValidation(
  type: RCTNotAllowedValidation,
  context: any,
  extra: string
): void;

declare function RCTLogSetBridgeCallableJSModules(
  callableJSModules: RCTCallableJSModules
): void;

declare function RCTLogSetBridgeModuleRegistry(
  moduleRegistry: RCTModuleRegistry
): void;

declare function RCTLogSetBridgelessCallableJSModules(
  callableJSModules: RCTCallableJSModules
): void;

declare function RCTLogSetBridgelessModuleRegistry(
  moduleRegistry: RCTModuleRegistry
): void;

declare const enum RCTLogSource {
  Native = 1,

  JavaScript = 2,
}

declare function RCTMD5Hash(string: string): string;

declare function RCTMakeAndLogError(
  message: string,
  toStringify: any,
  extraData: NSDictionary<string, any>
): NSDictionary<string, any>;

declare function RCTMakeError(
  message: string,
  toStringify: any,
  extraData: NSDictionary<string, any>
): NSDictionary<string, any>;

interface RCTMethodInfo {
  jsName: string;
  objcName: string;
  isSync: boolean;
}
declare var RCTMethodInfo: interop.StructType<RCTMethodInfo>;

declare class RCTModuleData extends NSObject implements RCTInvalidating {
  static alloc(): RCTModuleData; // inherited from NSObject

  static new(): RCTModuleData; // inherited from NSObject

  readonly exportedConstants: NSDictionary<string, any>;

  readonly hasConstantsToExport: boolean;

  readonly hasInstance: boolean;

  readonly implementsBatchDidComplete: boolean;

  readonly implementsPartialBatchDidFlush: boolean;

  instance: RCTBridgeModule;

  readonly methodQueue: NSObject;

  readonly moduleClass: typeof NSObject;

  readonly name: string;

  requiresMainQueueSetup: boolean;

  readonly debugDescription: string; // inherited from NSObjectProtocol

  readonly description: string; // inherited from NSObjectProtocol

  readonly hash: number; // inherited from NSObjectProtocol

  readonly isProxy: boolean; // inherited from NSObjectProtocol

  readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

  readonly; // inherited from NSObjectProtocol

  constructor(o: {
    moduleClass: typeof NSObject;
    bridge: RCTBridge;
    moduleRegistry: RCTModuleRegistry;
    viewRegistry_DEPRECATED: RCTViewRegistry;
    bundleManager: RCTBundleManager;
    callableJSModules: RCTCallableJSModules;
  });

  constructor(o: {
    moduleClass: typeof NSObject;
    moduleProvider: () => RCTBridgeModule;
    bridge: RCTBridge;
    moduleRegistry: RCTModuleRegistry;
    viewRegistry_DEPRECATED: RCTViewRegistry;
    bundleManager: RCTBundleManager;
    callableJSModules: RCTCallableJSModules;
  });

  constructor(o: {
    moduleInstance: RCTBridgeModule;
    bridge: RCTBridge;
    moduleRegistry: RCTModuleRegistry;
    viewRegistry_DEPRECATED: RCTViewRegistry;
    bundleManager: RCTBundleManager;
    callableJSModules: RCTCallableJSModules;
  });

  class(): typeof NSObject;

  conformsToProtocol(aProtocol: any /* Protocol */): boolean;

  gatherConstants(): void;

  initWithModuleClassBridgeModuleRegistryViewRegistry_DEPRECATEDBundleManagerCallableJSModules(
    moduleClass: typeof NSObject,
    bridge: RCTBridge,
    moduleRegistry: RCTModuleRegistry,
    viewRegistry_DEPRECATED: RCTViewRegistry,
    bundleManager: RCTBundleManager,
    callableJSModules: RCTCallableJSModules
  ): this;

  initWithModuleClassModuleProviderBridgeModuleRegistryViewRegistry_DEPRECATEDBundleManagerCallableJSModules(
    moduleClass: typeof NSObject,
    moduleProvider: () => RCTBridgeModule,
    bridge: RCTBridge,
    moduleRegistry: RCTModuleRegistry,
    viewRegistry_DEPRECATED: RCTViewRegistry,
    bundleManager: RCTBundleManager,
    callableJSModules: RCTCallableJSModules
  ): this;

  initWithModuleInstanceBridgeModuleRegistryViewRegistry_DEPRECATEDBundleManagerCallableJSModules(
    instance: RCTBridgeModule,
    bridge: RCTBridge,
    moduleRegistry: RCTModuleRegistry,
    viewRegistry_DEPRECATED: RCTViewRegistry,
    bundleManager: RCTBundleManager,
    callableJSModules: RCTCallableJSModules
  ): this;

  invalidate(): void;

  isEqual(object: any): boolean;

  isKindOfClass(aClass: typeof NSObject): boolean;

  isMemberOfClass(aClass: typeof NSObject): boolean;

  performSelector(aSelector: string): any;

  performSelectorWithObject(aSelector: string, object: any): any;

  performSelectorWithObjectWithObject(
    aSelector: string,
    object1: any,
    object2: any
  ): any;

  respondsToSelector(aSelector: string): boolean;

  retainCount(): number;

  self(): this;
}

declare class RCTModuleRegistry extends NSObject {
  static alloc(): RCTModuleRegistry; // inherited from NSObject

  static new(): RCTModuleRegistry; // inherited from NSObject

  moduleForName(
    moduleName: string | interop.Pointer | interop.Reference<any>
  ): any;

  moduleForNameLazilyLoadIfNecessary(
    moduleName: string | interop.Pointer | interop.Reference<any>,
    lazilyLoad: boolean
  ): any;

  setBridge(bridge: RCTBridge): void;

  setTurboModuleRegistry(turboModuleRegistry: RCTTurboModuleRegistry): void;
}

declare function RCTNewArchitectureSetMinValidationLevel(
  level: RCTNotAllowedValidation
): void;

declare function RCTNewArchitectureValidationPlaceholder(
  type: RCTNotAllowedValidation,
  context: any,
  extra: string
): void;

declare function RCTNormalizeInputEventName(eventName: string): string;

declare const enum RCTNotAllowedValidation {
  InBridgeless = 1,

  InFabricWithoutLegacy = 2,

  ValidationDisabled = 3,
}

declare var RCTObjCStackTraceKey: string;

declare function RCTParseArgumentIdentifier(
  input: interop.Pointer | interop.Reference<string>,
  string: interop.Pointer | interop.Reference<string>
): boolean;

declare function RCTParseSelectorIdentifier(
  input: interop.Pointer | interop.Reference<string>,
  string: interop.Pointer | interop.Reference<string>
): boolean;

declare function RCTParseType(
  input: interop.Pointer | interop.Reference<string>
): string;

declare class RCTParserUtils extends NSObject {
  static alloc(): RCTParserUtils; // inherited from NSObject

  static new(): RCTParserUtils; // inherited from NSObject
}

declare function RCTPerformBlockWithAssertFunction(
  block: () => void,
  assertFunction: (
    p1: string,
    p2: string,
    p3: number,
    p4: string,
    p5: string
  ) => void
): void;

declare function RCTPerformBlockWithLogFunction(
  block: () => void,
  logFunction: (
    p1: RCTLogLevel,
    p2: RCTLogSource,
    p3: string,
    p4: number,
    p5: string
  ) => void
): void;

declare function RCTPerformBlockWithLogPrefix(
  block: () => void,
  prefix: string
): void;

declare function RCTPresentedViewController(): UIViewController;

declare function RCTReadChar(
  input: interop.Pointer | interop.Reference<string>,
  c: number
): boolean;

declare function RCTReadString(
  input: interop.Pointer | interop.Reference<string>,
  string: string | interop.Pointer | interop.Reference<any>
): boolean;

declare function RCTRedBoxGetEnabled(): boolean;

declare function RCTRedBoxSetEnabled(enabled: boolean): void;

declare function RCTRegisterModule(p1: typeof NSObject): void;

declare function RCTRegisterReloadCommandListener(
  listener: RCTReloadListener
): void;

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

declare function RCTSetAssertFunction(
  assertFunction: (
    p1: string,
    p2: string,
    p3: number,
    p4: string,
    p5: string
  ) => void
): void;

declare function RCTSetFatalExceptionHandler(
  fatalExceptionHandler: (p1: NSException) => void
): void;

declare function RCTSetFatalHandler(fatalHandler: (p1: NSError) => void): void;

declare function RCTSetIsMainQueueExecutionOfConstantsToExportDisabled(
  val: boolean
): void;

declare function RCTSetLogFunction(
  logFunction: (
    p1: RCTLogLevel,
    p2: RCTLogSource,
    p3: string,
    p4: number,
    p5: string
  ) => void
): void;

declare function RCTSetLogThreshold(threshold: RCTLogLevel): void;

declare function RCTSharedApplication(): UIApplication;

declare function RCTSizeInPixels(pointSize: CGSize, scale: number): CGSize;

declare function RCTSkipWhitespace(
  input: interop.Pointer | interop.Reference<string>
): void;

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

declare function RCTSwapClassMethods(
  cls: typeof NSObject,
  original: string,
  replacement: string
): void;

declare function RCTSwapInstanceMethodWithBlock(
  cls: typeof NSObject,
  original: string,
  replacementBlock: any,
  replacementSelector: string
): void;

declare function RCTSwapInstanceMethods(
  cls: typeof NSObject,
  original: string,
  replacement: string
): void;

declare function RCTTempFilePath(
  extension: string,
  error: interop.Pointer | interop.Reference<NSError>
): string;

declare const enum RCTTextEventType {
  Focus = 0,

  Blur = 1,

  Change = 2,

  Submit = 3,

  End = 4,

  KeyPress = 5,
}

declare var RCTTextUpdateLagWarningThreshold: number;

declare var RCTTriggerReloadCommandBundleURLKey: string;

declare function RCTTriggerReloadCommandListeners(reason: string): void;

declare var RCTTriggerReloadCommandNotification: string;

declare var RCTTriggerReloadCommandReasonKey: string;

interface RCTTurboModuleRegistry extends NSObjectProtocol {
  eagerInitMainQueueModuleNames(): NSArray<string>;

  eagerInitModuleNames(): NSArray<string>;

  moduleForName(
    moduleName: string | interop.Pointer | interop.Reference<any>
  ): any;

  moduleForNameWarnOnLookupFailure(
    moduleName: string | interop.Pointer | interop.Reference<any>,
    warnOnLookupFailure: boolean
  ): any;

  moduleIsInitialized(
    moduleName: string | interop.Pointer | interop.Reference<any>
  ): boolean;
}
declare var RCTTurboModuleRegistry: {
  prototype: RCTTurboModuleRegistry;
};

declare function RCTUIKitLocalizedString(string: string): string;

declare class RCTUIManager
  extends NSObject
  implements RCTBridgeModule, RCTInvalidating
{
  static alloc(): RCTUIManager; // inherited from NSObject

  static moduleName(): string;

  static new(): RCTUIManager; // inherited from NSObject

  static requiresMainQueueSetup(): boolean;

  readonly bridge: RCTBridge; // inherited from RCTBridgeModule

  bundleManager: RCTBundleManager; // inherited from RCTBridgeModule

  callableJSModules: RCTCallableJSModules; // inherited from RCTBridgeModule

  readonly debugDescription: string; // inherited from NSObjectProtocol

  readonly description: string; // inherited from NSObjectProtocol

  readonly hash: number; // inherited from NSObjectProtocol

  readonly isProxy: boolean; // inherited from NSObjectProtocol

  readonly methodQueue: NSObject; // inherited from RCTBridgeModule

  moduleRegistry: RCTModuleRegistry; // inherited from RCTBridgeModule

  readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

  viewRegistry_DEPRECATED: RCTViewRegistry; // inherited from RCTBridgeModule

  readonly; // inherited from NSObjectProtocol

  addUIBlock(
    block: (p1: RCTUIManager, p2: NSDictionary<number, UIView>) => void
  ): void;

  batchDidComplete(): void;

  class(): typeof NSObject;

  conformsToProtocol(aProtocol: any /* Protocol */): boolean;

  constantsToExport(): NSDictionary<any, any>;

  invalidate(): void;

  isEqual(object: any): boolean;

  isKindOfClass(aClass: typeof NSObject): boolean;

  isMemberOfClass(aClass: typeof NSObject): boolean;

  methodsToExport(): NSArray<any>;

  nativeIDRegistry(): NSMapTable<any, any>;

  partialBatchDidFlush(): void;

  performSelector(aSelector: string): any;

  performSelectorWithObject(aSelector: string, object: any): any;

  performSelectorWithObjectWithObject(
    aSelector: string,
    object1: any,
    object2: any
  ): any;

  prependUIBlock(
    block: (p1: RCTUIManager, p2: NSDictionary<number, UIView>) => void
  ): void;

  registerViewReactTag(view: UIView, reactTag: number): void;

  respondsToSelector(aSelector: string): boolean;

  retainCount(): number;

  self(): this;

  unRegisterView(reactTag: number): void;

  viewRegistry(): NSMutableDictionary<number, UIView>;
}

declare var RCTUIManagerQueueName: string;

declare function RCTUIManagerTypeForTagIsFabric(reactTag: number): boolean;

declare function RCTURLByReplacingQueryParam(
  URL: NSURL,
  param: string,
  value: string
): NSURL;

declare function RCTUnsafeExecuteOnMainQueueSync(block: () => void): void;

declare function RCTUnsafeExecuteOnUIManagerQueueSync(block: () => void): void;

declare class RCTUtilsUIOverride extends NSObject {
  static alloc(): RCTUtilsUIOverride; // inherited from NSObject

  static hasPresentedViewController(): boolean;

  static new(): RCTUtilsUIOverride; // inherited from NSObject

  static presentedViewController(): UIViewController;

  static setPresentedViewController(
    presentedViewController: UIViewController
  ): void;
}

declare function RCTValidateTypeOfViewCommandArgument(
  obj: NSObject,
  expectedClass: any,
  expectedType: string,
  componentName: string,
  commandName: string,
  argPos: string
): boolean;

declare class RCTView extends UIView {
  static alloc(): RCTView; // inherited from NSObject

  static appearance(): RCTView; // inherited from UIAppearance

  static appearanceForTraitCollection(trait: UITraitCollection): RCTView; // inherited from UIAppearance

  static appearanceForTraitCollectionWhenContainedIn(
    trait: UITraitCollection,
    ContainerClass: typeof NSObject
  ): RCTView; // inherited from UIAppearance

  static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(
    trait: UITraitCollection,
    containerTypes: NSArray<typeof NSObject> | typeof NSObject[]
  ): RCTView; // inherited from UIAppearance

  static appearanceWhenContainedIn(ContainerClass: typeof NSObject): RCTView; // inherited from UIAppearance

  static appearanceWhenContainedInInstancesOfClasses(
    containerTypes: NSArray<typeof NSObject> | typeof NSObject[]
  ): RCTView; // inherited from UIAppearance

  static autoAdjustInsetsForViewWithScrollViewUpdateOffset(
    parentView: UIView,
    scrollView: UIScrollView,
    updateOffset: boolean
  ): void;

  static new(): RCTView; // inherited from NSObject
}

declare class RCTViewManager extends NSObject implements RCTBridgeModule {
  static alloc(): RCTViewManager; // inherited from NSObject

  static moduleName(): string;

  static new(): RCTViewManager; // inherited from NSObject

  static requiresMainQueueSetup(): boolean;

  bridge: RCTBridge;

  bundleManager: RCTBundleManager; // inherited from RCTBridgeModule

  callableJSModules: RCTCallableJSModules; // inherited from RCTBridgeModule

  readonly debugDescription: string; // inherited from NSObjectProtocol

  readonly description: string; // inherited from NSObjectProtocol

  readonly hash: number; // inherited from NSObjectProtocol

  readonly isProxy: boolean; // inherited from NSObjectProtocol

  readonly methodQueue: NSObject; // inherited from RCTBridgeModule

  moduleRegistry: RCTModuleRegistry; // inherited from RCTBridgeModule

  readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

  viewRegistry_DEPRECATED: RCTViewRegistry; // inherited from RCTBridgeModule

  readonly; // inherited from NSObjectProtocol

  batchDidComplete(): void;

  callCustomSetterOnViewWithProp(
    selectorString: string,
    view: RCTComponent,
    json: any
  ): void;

  class(): typeof NSObject;

  conformsToProtocol(aProtocol: any /* Protocol */): boolean;

  constantsToExport(): NSDictionary<any, any>;

  convertAndSetOnViewTypeJson(
    selector: string,
    target: RCTComponent,
    type: string,
    json: any
  ): void;

  isEqual(object: any): boolean;

  isKindOfClass(aClass: typeof NSObject): boolean;

  isMemberOfClass(aClass: typeof NSObject): boolean;

  methodsToExport(): NSArray<any>;

  partialBatchDidFlush(): void;

  performSelector(aSelector: string): any;

  performSelectorWithObject(aSelector: string, object: any): any;

  performSelectorWithObjectWithObject(
    aSelector: string,
    object1: any,
    object2: any
  ): any;

  respondsToSelector(aSelector: string): boolean;

  retainCount(): number;

  self(): this;

  view(): UIView;
}

declare class RCTViewRegistry extends NSObject {
  static alloc(): RCTViewRegistry; // inherited from NSObject

  static new(): RCTViewRegistry; // inherited from NSObject

  addUIBlock(block: (p1: RCTViewRegistry) => void): void;

  setBridge(bridge: RCTBridge): void;

  setBridgelessComponentViewProvider(
    bridgelessComponentViewProvider: (p1: number) => UIView
  ): void;

  viewForReactTag(reactTag: number): UIView;
}

declare function RCTViewportSize(): CGSize;

declare function RCTZeroIfNaN(value: number): number;

declare var RCT_BYTECODE_ALIGNMENT: number;

declare var ReactVersionNumber: number;

declare var ReactVersionString: interop.Reference<number>;

declare var SwitchAccessibilityTrait: number;

declare function _RCTInitializeJSThreadConstantInternal(): void;

declare function _RCTLogJavaScriptInternal(p1: RCTLogLevel, p2: string): void;

declare class UIView
  extends UIResponder
  implements
    CALayerDelegate,
    NSCoding,
    RCTComponent,
    UIAccessibilityIdentification,
    UIAppearance,
    UIAppearanceContainer,
    UICoordinateSpace,
    UIDynamicItem,
    UIFocusItem,
    UIFocusItemContainer,
    UILargeContentViewerItem,
    UIPopoverPresentationControllerSourceItem,
    UITraitEnvironment
{
  static addKeyframeWithRelativeStartTimeRelativeDurationAnimations(
    frameStartTime: number,
    frameDuration: number,
    animations: () => void
  ): void;

  static alloc(): UIView; // inherited from NSObject

  static animateKeyframesWithDurationDelayOptionsAnimationsCompletion(
    duration: number,
    delay: number,
    options: UIViewKeyframeAnimationOptions,
    animations: () => void,
    completion: (p1: boolean) => void
  ): void;

  static animateWithDurationAnimations(
    duration: number,
    animations: () => void
  ): void;

  static animateWithDurationAnimationsCompletion(
    duration: number,
    animations: () => void,
    completion: (p1: boolean) => void
  ): void;

  static animateWithDurationDelayOptionsAnimationsCompletion(
    duration: number,
    delay: number,
    options: UIViewAnimationOptions,
    animations: () => void,
    completion: (p1: boolean) => void
  ): void;

  static animateWithDurationDelayUsingSpringWithDampingInitialSpringVelocityOptionsAnimationsCompletion(
    duration: number,
    delay: number,
    dampingRatio: number,
    velocity: number,
    options: UIViewAnimationOptions,
    animations: () => void,
    completion: (p1: boolean) => void
  ): void;

  static appearance(): UIView;

  static appearanceForTraitCollection(trait: UITraitCollection): UIView;

  static appearanceForTraitCollectionWhenContainedIn(
    trait: UITraitCollection,
    ContainerClass: typeof NSObject
  ): UIView;

  static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(
    trait: UITraitCollection,
    containerTypes: NSArray<typeof NSObject> | typeof NSObject[]
  ): UIView;

  static appearanceWhenContainedIn(ContainerClass: typeof NSObject): UIView;

  static appearanceWhenContainedInInstancesOfClasses(
    containerTypes: NSArray<typeof NSObject> | typeof NSObject[]
  ): UIView;

  static beginAnimationsContext(
    animationID: string,
    context: interop.Pointer | interop.Reference<any>
  ): void;

  static commitAnimations(): void;

  static modifyAnimationsWithRepeatCountAutoreversesAnimations(
    count: number,
    autoreverses: boolean,
    animations: () => void
  ): void;

  static new(): UIView; // inherited from NSObject

  static performSystemAnimationOnViewsOptionsAnimationsCompletion(
    animation: UISystemAnimation,
    views: NSArray<UIView> | UIView[],
    options: UIViewAnimationOptions,
    parallelAnimations: () => void,
    completion: (p1: boolean) => void
  ): void;

  static performWithoutAnimation(actionsWithoutAnimation: () => void): void;

  static setAnimationBeginsFromCurrentState(fromCurrentState: boolean): void;

  static setAnimationCurve(curve: UIViewAnimationCurve): void;

  static setAnimationDelay(delay: number): void;

  static setAnimationDelegate(delegate: any): void;

  static setAnimationDidStopSelector(selector: string): void;

  static setAnimationDuration(duration: number): void;

  static setAnimationRepeatAutoreverses(repeatAutoreverses: boolean): void;

  static setAnimationRepeatCount(repeatCount: number): void;

  static setAnimationStartDate(startDate: Date): void;

  static setAnimationTransitionForViewCache(
    transition: UIViewAnimationTransition,
    view: UIView,
    cache: boolean
  ): void;

  static setAnimationWillStartSelector(selector: string): void;

  static setAnimationsEnabled(enabled: boolean): void;

  static transitionFromViewToViewDurationOptionsCompletion(
    fromView: UIView,
    toView: UIView,
    duration: number,
    options: UIViewAnimationOptions,
    completion: (p1: boolean) => void
  ): void;

  static transitionWithViewDurationOptionsAnimationsCompletion(
    view: UIView,
    duration: number,
    options: UIViewAnimationOptions,
    animations: () => void,
    completion: (p1: boolean) => void
  ): void;

  static userInterfaceLayoutDirectionForSemanticContentAttribute(
    attribute: UISemanticContentAttribute
  ): UIUserInterfaceLayoutDirection;

  static userInterfaceLayoutDirectionForSemanticContentAttributeRelativeToLayoutDirection(
    semanticContentAttribute: UISemanticContentAttribute,
    layoutDirection: UIUserInterfaceLayoutDirection
  ): UIUserInterfaceLayoutDirection;

  accessibilityIgnoresInvertColors: boolean;

  readonly alignmentRectInsets: UIEdgeInsets;

  alpha: number;

  anchorPoint: CGPoint;

  readonly appliedContentSizeCategoryLimitsDescription: string;

  autoresizesSubviews: boolean;

  autoresizingMask: UIViewAutoresizing;

  backgroundColor: UIColor;

  readonly bottomAnchor: NSLayoutYAxisAnchor;

  bounds: CGRect;

  readonly centerXAnchor: NSLayoutXAxisAnchor;

  readonly centerYAnchor: NSLayoutYAxisAnchor;

  clearsContextBeforeDrawing: boolean;

  clipsToBounds: boolean;

  readonly constraints: NSArray<NSLayoutConstraint>;

  contentMode: UIViewContentMode;

  contentScaleFactor: number;

  contentStretch: CGRect;

  directionalLayoutMargins: NSDirectionalEdgeInsets;

  readonly effectiveUserInterfaceLayoutDirection: UIUserInterfaceLayoutDirection;

  exclusiveTouch: boolean;

  readonly firstBaselineAnchor: NSLayoutYAxisAnchor;

  focusEffect: UIFocusEffect;

  focusGroupIdentifier: string;

  focusGroupPriority: number;

  readonly focused: boolean;

  frame: CGRect;

  gestureRecognizers: NSArray<UIGestureRecognizer>;

  readonly hasAmbiguousLayout: boolean;

  readonly heightAnchor: NSLayoutDimension;

  hidden: boolean;

  insetsLayoutMarginsFromSafeArea: boolean;

  interactions: NSArray<UIInteraction>;

  readonly intrinsicContentSize: CGSize;

  readonly keyboardLayoutGuide: UIKeyboardLayoutGuide;

  largeContentImage: UIImage;

  largeContentImageInsets: UIEdgeInsets;

  largeContentTitle: string;

  readonly lastBaselineAnchor: NSLayoutYAxisAnchor;

  readonly layer: CALayer;

  readonly layoutGuides: NSArray<UILayoutGuide>;

  layoutMargins: UIEdgeInsets;

  readonly layoutMarginsGuide: UILayoutGuide;

  readonly leadingAnchor: NSLayoutXAxisAnchor;

  readonly leftAnchor: NSLayoutXAxisAnchor;

  maskView: UIView;

  maximumContentSizeCategory: string;

  minimumContentSizeCategory: string;

  motionEffects: NSArray<UIMotionEffect>;

  multipleTouchEnabled: boolean;

  nativeID: string;

  opaque: boolean;

  overrideUserInterfaceStyle: UIUserInterfaceStyle;

  preservesSuperviewLayoutMargins: boolean;

  readonly readableContentGuide: UILayoutGuide;

  restorationIdentifier: string;

  readonly rightAnchor: NSLayoutXAxisAnchor;

  readonly safeAreaInsets: UIEdgeInsets;

  readonly safeAreaLayoutGuide: UILayoutGuide;

  scalesLargeContentImage: boolean;

  semanticContentAttribute: UISemanticContentAttribute;

  showsLargeContentViewer: boolean;

  readonly subviews: NSArray<UIView>;

  readonly superview: UIView;

  tag: number;

  tintAdjustmentMode: UIViewTintAdjustmentMode;

  tintColor: UIColor;

  readonly topAnchor: NSLayoutYAxisAnchor;

  readonly trailingAnchor: NSLayoutXAxisAnchor;

  transform3D: CATransform3D;

  translatesAutoresizingMaskIntoConstraints: boolean;

  userInteractionEnabled: boolean;

  readonly viewForFirstBaselineLayout: UIView;

  readonly viewForLastBaselineLayout: UIView;

  readonly widthAnchor: NSLayoutDimension;

  readonly window: UIWindow;

  static readonly areAnimationsEnabled: boolean;

  static readonly inheritedAnimationDuration: number;

  static readonly layerClass: typeof NSObject;

  static readonly requiresConstraintBasedLayout: boolean;

  accessibilityIdentifier: string; // inherited from UIAccessibilityIdentification

  readonly canBecomeFocused: boolean; // inherited from UIFocusItem

  center: CGPoint; // inherited from UIDynamicItem

  readonly collisionBoundingPath: UIBezierPath; // inherited from UIDynamicItem

  readonly collisionBoundsType: UIDynamicItemCollisionBoundsType; // inherited from UIDynamicItem

  readonly coordinateSpace: UICoordinateSpace; // inherited from UIFocusItemContainer

  readonly debugDescription: string; // inherited from NSObjectProtocol

  readonly description: string; // inherited from NSObjectProtocol

  readonly focusItemContainer: UIFocusItemContainer; // inherited from UIFocusEnvironment

  readonly hash: number; // inherited from NSObjectProtocol

  readonly isProxy: boolean; // inherited from NSObjectProtocol

  readonly isTransparentFocusItem: boolean; // inherited from UIFocusItem

  readonly parentFocusEnvironment: UIFocusEnvironment; // inherited from UIFocusEnvironment

  readonly preferredFocusEnvironments: NSArray<UIFocusEnvironment>; // inherited from UIFocusEnvironment

  readonly preferredFocusedView: UIView; // inherited from UIFocusEnvironment

  reactTag: number; // inherited from RCTComponent

  readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

  readonly traitCollection: UITraitCollection; // inherited from UITraitEnvironment

  transform: CGAffineTransform; // inherited from UIDynamicItem

  readonly; // inherited from NSObjectProtocol

  constructor(o: { coder: NSCoder }); // inherited from NSCoding

  constructor(o: { frame: CGRect });

  actionForLayerForKey(layer: CALayer, event: string): CAAction;

  addConstraint(constraint: NSLayoutConstraint): void;

  addConstraints(
    constraints: NSArray<NSLayoutConstraint> | NSLayoutConstraint[]
  ): void;

  addGestureRecognizer(gestureRecognizer: UIGestureRecognizer): void;

  addInteraction(interaction: UIInteraction): void;

  addLayoutGuide(layoutGuide: UILayoutGuide): void;

  addMotionEffect(effect: UIMotionEffect): void;

  addSubview(view: UIView): void;

  alignmentRectForFrame(frame: CGRect): CGRect;

  bringSubviewToFront(view: UIView): void;

  class(): typeof NSObject;

  conformsToProtocol(aProtocol: any /* Protocol */): boolean;

  constraintsAffectingLayoutForAxis(
    axis: UILayoutConstraintAxis
  ): NSArray<NSLayoutConstraint>;

  contentCompressionResistancePriorityForAxis(
    axis: UILayoutConstraintAxis
  ): number;

  contentHuggingPriorityForAxis(axis: UILayoutConstraintAxis): number;

  convertPointFromCoordinateSpace(
    point: CGPoint,
    coordinateSpace: UICoordinateSpace
  ): CGPoint;

  convertPointFromView(point: CGPoint, view: UIView): CGPoint;

  convertPointToCoordinateSpace(
    point: CGPoint,
    coordinateSpace: UICoordinateSpace
  ): CGPoint;

  convertPointToView(point: CGPoint, view: UIView): CGPoint;

  convertRectFromCoordinateSpace(
    rect: CGRect,
    coordinateSpace: UICoordinateSpace
  ): CGRect;

  convertRectFromView(rect: CGRect, view: UIView): CGRect;

  convertRectToCoordinateSpace(
    rect: CGRect,
    coordinateSpace: UICoordinateSpace
  ): CGRect;

  convertRectToView(rect: CGRect, view: UIView): CGRect;

  decodeRestorableStateWithCoder(coder: NSCoder): void;

  didAddSubview(subview: UIView): void;

  didHintFocusMovement(hint: UIFocusMovementHint): void;

  didMoveToSuperview(): void;

  didMoveToWindow(): void;

  didUpdateFocusInContextWithAnimationCoordinator(
    context: UIFocusUpdateContext,
    coordinator: UIFocusAnimationCoordinator
  ): void;

  displayLayer(layer: CALayer): void;

  drawLayerInContext(layer: CALayer, ctx: any): void;

  drawRect(rect: CGRect): void;

  drawRectForViewPrintFormatter(
    rect: CGRect,
    formatter: UIViewPrintFormatter
  ): void;

  drawViewHierarchyInRectAfterScreenUpdates(
    rect: CGRect,
    afterUpdates: boolean
  ): boolean;

  encodeRestorableStateWithCoder(coder: NSCoder): void;

  encodeWithCoder(coder: NSCoder): void;

  endEditing(force: boolean): boolean;

  exchangeSubviewAtIndexWithSubviewAtIndex(
    index1: number,
    index2: number
  ): void;

  exerciseAmbiguityInLayout(): void;

  focusItemsInRect(rect: CGRect): NSArray<UIFocusItem>;

  frameForAlignmentRect(alignmentRect: CGRect): CGRect;

  gestureRecognizerShouldBegin(gestureRecognizer: UIGestureRecognizer): boolean;

  hitTestWithEvent(point: CGPoint, event: _UIEvent): UIView;

  initWithCoder(coder: NSCoder): this;

  initWithFrame(frame: CGRect): this;

  insertReactSubviewAtIndex(subview: UIView, atIndex: number): void;

  insertSubviewAboveSubview(view: UIView, siblingSubview: UIView): void;

  insertSubviewAtIndex(view: UIView, index: number): void;

  insertSubviewBelowSubview(view: UIView, siblingSubview: UIView): void;

  invalidateIntrinsicContentSize(): void;

  isDescendantOfView(view: UIView): boolean;

  isEqual(object: any): boolean;

  isKindOfClass(aClass: typeof NSObject): boolean;

  isMemberOfClass(aClass: typeof NSObject): boolean;

  layerWillDraw(layer: CALayer): void;

  layoutIfNeeded(): void;

  layoutMarginsDidChange(): void;

  layoutSublayersOfLayer(layer: CALayer): void;

  layoutSubviews(): void;

  nativeScriptSetFormattedTextDecorationAndTransform(
    details: NSDictionary<any, any>
  ): void;

  nativeScriptSetTextDecorationAndTransformTextDecorationLetterSpacingLineHeight(
    text: string,
    textDecoration: string,
    letterSpacing: number,
    lineHeight: number
  ): void;

  needsUpdateConstraints(): boolean;

  passThroughParent(): boolean;

  performSelector(aSelector: string): any;

  performSelectorWithObject(aSelector: string, object: any): any;

  performSelectorWithObjectWithObject(
    aSelector: string,
    object1: any,
    object2: any
  ): any;

  pointInsideWithEvent(point: CGPoint, event: _UIEvent): boolean;

  reactAddControllerToClosestParent(controller: UIViewController): void;

  reactSubviews(): NSArray<UIView>;

  reactSuperview(): UIView;

  reactViewController(): UIViewController;

  react_findClipView(): UIView;

  react_remountAllSubviews(): void;

  react_updateClippedSubviewsWithClipRectRelativeToView(
    clipRect: CGRect,
    clipView: UIView
  ): void;

  removeConstraint(constraint: NSLayoutConstraint): void;

  removeConstraints(
    constraints: NSArray<NSLayoutConstraint> | NSLayoutConstraint[]
  ): void;

  removeFromSuperview(): void;

  removeGestureRecognizer(gestureRecognizer: UIGestureRecognizer): void;

  removeInteraction(interaction: UIInteraction): void;

  removeLayoutGuide(layoutGuide: UILayoutGuide): void;

  removeMotionEffect(effect: UIMotionEffect): void;

  removeReactSubview(subview: UIView): void;

  resizableSnapshotViewFromRectAfterScreenUpdatesWithCapInsets(
    rect: CGRect,
    afterUpdates: boolean,
    capInsets: UIEdgeInsets
  ): UIView;

  respondsToSelector(aSelector: string): boolean;

  retainCount(): number;

  safeAreaInsetsDidChange(): void;

  self(): this;

  sendSubviewToBack(view: UIView): void;

  setContentCompressionResistancePriorityForAxis(
    priority: number,
    axis: UILayoutConstraintAxis
  ): void;

  setContentHuggingPriorityForAxis(
    priority: number,
    axis: UILayoutConstraintAxis
  ): void;

  setNeedsDisplay(): void;

  setNeedsDisplayInRect(rect: CGRect): void;

  setNeedsFocusUpdate(): void;

  setNeedsLayout(): void;

  setNeedsUpdateConstraints(): void;

  setPassThroughParent(passThroughParent: boolean): void;

  shouldUpdateFocusInContext(context: UIFocusUpdateContext): boolean;

  sizeThatFits(size: CGSize): CGSize;

  sizeToFit(): void;

  snapshotViewAfterScreenUpdates(afterUpdates: boolean): UIView;

  systemLayoutSizeFittingSize(targetSize: CGSize): CGSize;

  systemLayoutSizeFittingSizeWithHorizontalFittingPriorityVerticalFittingPriority(
    targetSize: CGSize,
    horizontalFittingPriority: number,
    verticalFittingPriority: number
  ): CGSize;

  tintColorDidChange(): void;

  traitCollectionDidChange(previousTraitCollection: UITraitCollection): void;

  updateConstraints(): void;

  updateConstraintsIfNeeded(): void;

  updateFocusIfNeeded(): void;

  viewForBaselineLayout(): UIView;

  viewPrintFormatter(): UIViewPrintFormatter;

  viewWithTag(tag: number): UIView;

  willMoveToSuperview(newSuperview: UIView): void;

  willMoveToWindow(newWindow: UIWindow): void;

  willRemoveSubview(subview: UIView): void;
}

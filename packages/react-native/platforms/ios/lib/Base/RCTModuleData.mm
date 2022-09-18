/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTModuleData.h"

#import <objc/runtime.h>
#import <atomic>
#import <mutex>

#import "RCTBridge+Private.h"
#import "RCTBridge.h"
#import "RCTInitializing.h"
#import "RCTLog.h"
#import "RCTUtils.h"

namespace {
int32_t getUniqueId()
{
  static std::atomic<int32_t> counter{0};
  return counter++;
}
}
static BOOL isMainQueueExecutionOfConstantToExportDisabled = NO;

void RCTSetIsMainQueueExecutionOfConstantsToExportDisabled(BOOL val)
{
  isMainQueueExecutionOfConstantToExportDisabled = val;
}

BOOL RCTIsMainQueueExecutionOfConstantsToExportDisabled()
{
  return isMainQueueExecutionOfConstantToExportDisabled;
}

@implementation RCTModuleData {
  NSDictionary<NSString *, id> *_constantsToExport;
  NSString *_queueName;
  __weak RCTBridge *_bridge;
  RCTBridgeModuleProvider _moduleProvider;
  std::mutex _instanceLock;
  BOOL _setupComplete;
  RCTModuleRegistry *_moduleRegistry;
  RCTViewRegistry *_viewRegistry_DEPRECATED;
  RCTBundleManager *_bundleManager;
  RCTCallableJSModules *_callableJSModules;
  BOOL _isInitialized;
}

@synthesize instance = _instance;
@synthesize methodQueue = _methodQueue;

- (void)setUp
{
  _implementsBatchDidComplete = [_moduleClass instancesRespondToSelector:@selector(batchDidComplete)];
  _implementsPartialBatchDidFlush = [_moduleClass instancesRespondToSelector:@selector(partialBatchDidFlush)];

  // If a module overrides `constantsToExport` and doesn't implement `requiresMainQueueSetup`, then we must assume
  // that it must be called on the main thread, because it may need to access UIKit.
  _hasConstantsToExport = [_moduleClass instancesRespondToSelector:@selector(constantsToExport)];

  const BOOL implementsRequireMainQueueSetup = [_moduleClass respondsToSelector:@selector(requiresMainQueueSetup)];
  if (implementsRequireMainQueueSetup) {
    _requiresMainQueueSetup = [_moduleClass requiresMainQueueSetup];
  } else {
    static IMP objectInitMethod;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
      objectInitMethod = [NSObject instanceMethodForSelector:@selector(init)];
    });

    // If a module overrides `init` then we must assume that it expects to be
    // initialized on the main thread, because it may need to access UIKit.
    const BOOL hasCustomInit =
        !_instance && [_moduleClass instanceMethodForSelector:@selector(init)] != objectInitMethod;

    _requiresMainQueueSetup = _hasConstantsToExport || hasCustomInit;
    if (_requiresMainQueueSetup) {
      const char *methodName = "";
      if (_hasConstantsToExport) {
        methodName = "constantsToExport";
      } else if (hasCustomInit) {
        methodName = "init";
      }
      RCTLogWarn(
          @"Module %@ requires main queue setup since it overrides `%s` but doesn't implement "
           "`requiresMainQueueSetup`. In a future release React Native will default to initializing all native modules "
           "on a background thread unless explicitly opted-out of.",
          _moduleClass,
          methodName);
    }
  }
}

- (instancetype)initWithModuleClass:(Class)moduleClass
                             bridge:(RCTBridge *)bridge
                     moduleRegistry:(RCTModuleRegistry *)moduleRegistry
            viewRegistry_DEPRECATED:(RCTViewRegistry *)viewRegistry_DEPRECATED
                      bundleManager:(RCTBundleManager *)bundleManager
                  callableJSModules:(RCTCallableJSModules *)callableJSModules
{
  return [self initWithModuleClass:moduleClass
                    moduleProvider:^id<RCTBridgeModule> {
                      return [moduleClass new];
                    }
                            bridge:bridge
                    moduleRegistry:moduleRegistry
           viewRegistry_DEPRECATED:viewRegistry_DEPRECATED
                     bundleManager:bundleManager
                 callableJSModules:callableJSModules];
}

- (instancetype)initWithModuleClass:(Class)moduleClass
                     moduleProvider:(RCTBridgeModuleProvider)moduleProvider
                             bridge:(RCTBridge *)bridge
                     moduleRegistry:(RCTModuleRegistry *)moduleRegistry
            viewRegistry_DEPRECATED:(RCTViewRegistry *)viewRegistry_DEPRECATED
                      bundleManager:(RCTBundleManager *)bundleManager
                  callableJSModules:(RCTCallableJSModules *)callableJSModules
{
  if (self = [super init]) {
    _bridge = bridge;
    _moduleClass = moduleClass;
    _moduleProvider = [moduleProvider copy];
    _moduleRegistry = moduleRegistry;
    _viewRegistry_DEPRECATED = viewRegistry_DEPRECATED;
    _bundleManager = bundleManager;
    _callableJSModules = callableJSModules;
    [self setUp];
  }
  return self;
}

- (instancetype)initWithModuleInstance:(id<RCTBridgeModule>)instance
                                bridge:(RCTBridge *)bridge
                        moduleRegistry:(RCTModuleRegistry *)moduleRegistry
               viewRegistry_DEPRECATED:(RCTViewRegistry *)viewRegistry_DEPRECATED
                         bundleManager:(RCTBundleManager *)bundleManager
                     callableJSModules:(RCTCallableJSModules *)callableJSModules
{
  if (self = [super init]) {
    _bridge = bridge;
    _instance = instance;
    _moduleClass = [instance class];
    _moduleRegistry = moduleRegistry;
    _viewRegistry_DEPRECATED = viewRegistry_DEPRECATED;
    _bundleManager = bundleManager;
    _callableJSModules = callableJSModules;
    [self setUp];
  }
  return self;
}

RCT_NOT_IMPLEMENTED(-(instancetype)init);

#pragma mark - private setup methods

- (void)setUpInstanceAndBridge:(int32_t)requestId
{
  {
    std::unique_lock<std::mutex> lock(_instanceLock);
    BOOL shouldSetup = !_setupComplete;

    if (shouldSetup) {
      if (!_instance) {
        if (RCT_DEBUG && _requiresMainQueueSetup) {
          RCTAssertMainQueue();
        }
        
        _instance = _moduleProvider ? _moduleProvider() : nil;
        if (!_instance) {
          // Module init returned nil, probably because automatic instantiation
          // of the module is not supported, and it is supposed to be passed in to
          // the bridge constructor. Mark setup complete to avoid doing more work.
          _setupComplete = YES;
          RCTLogWarn(
              @"The module %@ is returning nil from its constructor. You "
               "may need to instantiate it yourself and pass it into the "
               "bridge.",
              _moduleClass);
        }
      }
    }


    if (shouldSetup) {
      // Bridge must be set before methodQueue is set up, as methodQueue
      // initialization requires it (View Managers get their queue by calling
      // self.bridge.uiManager.methodQueue)
      [self setBridgeForInstance];
      [self setModuleRegistryForInstance];
      [self setViewRegistryForInstance];
      [self setBundleManagerForInstance];
      [self setCallableJSModulesForInstance];
    }

    [self setUpMethodQueue];

    if (shouldSetup) {
      [self _initializeModule];
    }
  }

  // This is called outside of the lock in order to prevent deadlock issues
  // because the logic in `finishSetupForInstance` can cause
  // `moduleData.instance` to be accessed re-entrantly.
  if (_bridge) {
    [self finishSetupForInstance];
  } else {
    // If we're here, then the module is completely initialized,
    // except for what finishSetupForInstance does.  When the instance
    // method is called after moduleSetupComplete,
    // finishSetupForInstance will run.  If _requiresMainQueueSetup
    // is true, getting the instance will block waiting for the main
    // thread, which could take a while if the main thread is busy
    // (I've seen 50ms in testing).  So we clear that flag, since
    // nothing in finishSetupForInstance needs to be run on the main
    // thread.
    _requiresMainQueueSetup = NO;
  }

 
}

- (void)setBridgeForInstance
{
  if ([_instance respondsToSelector:@selector(bridge)] && _instance.bridge != _bridge) {
    
    @try {
      [(id)_instance setValue:_bridge forKey:@"bridge"];
    } @catch (NSException *exception) {
      RCTLogError(
          @"%@ has no setter or ivar for its bridge, which is not "
           "permitted. You must either @synthesize the bridge property, "
           "or provide your own setter method.",
          self.name);
    }
   
  }
}

- (void)setModuleRegistryForInstance
{
  if ([_instance respondsToSelector:@selector(moduleRegistry)] && _instance.moduleRegistry != _moduleRegistry) {

    @try {
      [(id)_instance setValue:_moduleRegistry forKey:@"moduleRegistry"];
    } @catch (NSException *exception) {
      RCTLogError(
          @"%@ has no setter or ivar for its module registry, which is not "
           "permitted. You must either @synthesize the moduleRegistry property, "
           "or provide your own setter method.",
          self.name);
    }
  }
}

- (void)setViewRegistryForInstance
{
  if ([_instance respondsToSelector:@selector(viewRegistry_DEPRECATED)] &&
      _instance.viewRegistry_DEPRECATED != _viewRegistry_DEPRECATED) {
    
    @try {
      [(id)_instance setValue:_viewRegistry_DEPRECATED forKey:@"viewRegistry_DEPRECATED"];
    } @catch (NSException *exception) {
      RCTLogError(
          @"%@ has no setter or ivar for its module registry, which is not "
           "permitted. You must either @synthesize the viewRegistry_DEPRECATED property, "
           "or provide your own setter method.",
          self.name);
    }
    
  }
}

- (void)setBundleManagerForInstance
{
  if ([_instance respondsToSelector:@selector(bundleManager)] && _instance.bundleManager != _bundleManager) {
    
    @try {
      [(id)_instance setValue:_bundleManager forKey:@"bundleManager"];
    } @catch (NSException *exception) {
      RCTLogError(
          @"%@ has no setter or ivar for its module registry, which is not "
           "permitted. You must either @synthesize the bundleManager property, "
           "or provide your own setter method.",
          self.name);
    }
    
  }
}

- (void)setCallableJSModulesForInstance
{
  if ([_instance respondsToSelector:@selector(callableJSModules)] &&
      _instance.callableJSModules != _callableJSModules) {
    
    @try {
      [(id)_instance setValue:_callableJSModules forKey:@"callableJSModules"];
    } @catch (NSException *exception) {
      RCTLogError(
          @"%@ has no setter or ivar for its module registry, which is not "
           "permitted. You must either @synthesize the callableJSModules property, "
           "or provide your own setter method.",
          self.name);
    }
  
  }
}

- (void)_initializeModule
{
  if (!_isInitialized && [_instance respondsToSelector:@selector(initialize)]) {
    _isInitialized = YES;
    [(id<RCTInitializing>)_instance initialize];
  }
}

- (void)finishSetupForInstance
{
  if (!_setupComplete && _instance) {
    _setupComplete = YES;
  }
}

- (void)setUpMethodQueue
{
  if (_instance && !_methodQueue && _bridge) {
    BOOL implementsMethodQueue = [_instance respondsToSelector:@selector(methodQueue)];
    if (implementsMethodQueue && _bridge) {
      _methodQueue = _instance.methodQueue;
    }
    if (!_methodQueue && _bridge) {
      // Create new queue (store queueName, as it isn't retained by dispatch_queue)
      _queueName = [NSString stringWithFormat:@"com.facebook.react.%@Queue", self.name];
      _methodQueue = dispatch_queue_create(_queueName.UTF8String, DISPATCH_QUEUE_SERIAL);

      // assign it to the module
      if (implementsMethodQueue) {
        @try {
          [(id)_instance setValue:_methodQueue forKey:@"methodQueue"];
        } @catch (NSException *exception) {
          RCTLogError(
              @"%@ is returning nil for its methodQueue, which is not "
               "permitted. You must either return a pre-initialized "
               "queue, or @synthesize the methodQueue to let the bridge "
               "create a queue for you.",
              self.name);
        }
      }
    }
  
  }
}

- (void)calculateMethods
{
 // Because of how NativeScrip works, we can skip calcualting methods
 // as the metadata generator already has that information for JS runtime
 // so methods can be invoked directly instead of batching them over the
 // bridge.
}

#pragma mark - public getters

- (BOOL)hasInstance
{
  std::unique_lock<std::mutex> lock(_instanceLock);
  return _instance != nil;
}

- (id<RCTBridgeModule>)instance
{
  int32_t requestId = getUniqueId();
    
  if (!_setupComplete) {
   
    if (_requiresMainQueueSetup) {
      // The chances of deadlock here are low, because module init very rarely
      // calls out to other threads, however we can't control when a module might
      // get accessed by client code during bridge setup, and a very low risk of
      // deadlock is better than a fairly high risk of an assertion being thrown.
        
      if (!RCTIsMainQueue()) {
        RCTLogWarn(@"RCTBridge required dispatch_sync to load %@. This may lead to deadlocks", _moduleClass);
      }

      RCTUnsafeExecuteOnMainQueueSync(^{
        [self setUpInstanceAndBridge:requestId];
      });
     
    } else {
      [self setUpInstanceAndBridge:requestId];
    }
   
  }

  return _instance;
}

- (NSString *)name
{
  return RCTBridgeModuleNameForClass(_moduleClass);
}

- (void)gatherConstants
{
  return [self gatherConstantsAndSignalJSRequireEnding:NO];
}

- (void)gatherConstantsAndSignalJSRequireEnding:(BOOL)startMarkers
{

  if (_hasConstantsToExport && !_constantsToExport) {
  
    (void)[self instance];

    if (!RCTIsMainQueueExecutionOfConstantsToExportDisabled() && _requiresMainQueueSetup) {
      if (!RCTIsMainQueue()) {
        RCTLogWarn(@"Required dispatch_sync to load constants for %@. This may lead to deadlocks", _moduleClass);
      }

      RCTUnsafeExecuteOnMainQueueSync(^{
        self->_constantsToExport = [self->_instance constantsToExport] ?: @{};
      });
    } else {
      _constantsToExport = [_instance constantsToExport] ?: @{};
    }

  }
}

- (NSDictionary<NSString *, id> *)exportedConstants
{
  [self gatherConstantsAndSignalJSRequireEnding:YES];
  NSDictionary<NSString *, id> *constants = _constantsToExport;
  _constantsToExport = nil; // Not needed anymore
  return constants;
}

- (dispatch_queue_t)methodQueue
{
  if (_bridge) {
    id instance = self.instance;
    RCTAssert(_methodQueue != nullptr, @"Module %@ has no methodQueue (instance: %@)", self, instance);
  }
  return _methodQueue;
}

- (void)invalidate
{
  _methodQueue = nil;
}

- (NSString *)description
{
  return [NSString stringWithFormat:@"<%@: %p; name=\"%@\">", [self class], self, self.name];
}

@end
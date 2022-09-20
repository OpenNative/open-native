/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTBridge.h"
#import <objc/runtime.h>
#import "RCTBridge+Private.h"
#import "RCTBridgeModule.h"

#import "RCTConvert.h"
#import "RCTJSThread.h"
#import "RCTLog.h"
#import "RCTModuleData.h"
#import "RCTReloadCommand.h"
#import "RCTUtils.h"

static NSMutableDictionary<NSString *, Class> *RCTModuleClasses;
static dispatch_queue_t RCTModuleClassesSyncQueue;

NSDictionary<NSString *, Class> *RCTGetModuleClasses(void)
{
  __block NSDictionary<NSString *, Class> *result;
  dispatch_sync(RCTModuleClassesSyncQueue, ^{
    result = [RCTModuleClasses copy];
  });
  return result;
}

Class RCTGetModuleClassForName(NSString *moduleName)
{
  __block Class result;
  dispatch_sync(RCTModuleClassesSyncQueue, ^{
    result = [[RCTModuleClasses copy] objectForKey:moduleName];
  });
  return result;
}

/**
 * Register the given class as a bridge module. All modules must be registered
 * prior to the first bridge initialization.
 * TODO: (T115656171) Refactor RCTRegisterModule out of Bridge.m since it doesn't use the Bridge.
 */
void RCTRegisterModule(Class);
void RCTRegisterModule(Class moduleClass)
{
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    RCTModuleClasses = [NSMutableDictionary new];
    RCTModuleClassesSyncQueue =
        dispatch_queue_create("com.facebook.react.ModuleClassesSyncQueue", DISPATCH_QUEUE_CONCURRENT);
  });

  RCTAssert(
      [moduleClass conformsToProtocol:@protocol(RCTBridgeModule)],
      @"%@ does not conform to the RCTBridgeModule protocol",
      moduleClass);
  // Register module by name
  dispatch_barrier_async(RCTModuleClassesSyncQueue, ^{
    [RCTModuleClasses setObject:moduleClass forKey:RCTBridgeModuleNameForClass(moduleClass)];
  });
}

/**
 * This function returns the module name for a given class.
 */
NSString *RCTBridgeModuleNameForClass(Class cls)
{
#if RCT_DEBUG
  RCTAssert(
      [cls conformsToProtocol:@protocol(RCTBridgeModule)],
      @"Bridge module `%@` does not conform to RCTBridgeModule",
      cls);
#endif

  NSString *name = [cls moduleName];
  if (name.length == 0) {
    name = NSStringFromClass(cls);
  }

  return RCTDropReactPrefixes(name);
}

@implementation RCTBridge

RCTCallableJSModules *_callableJSModules;
RCTModuleRegistry *moduleRegistry;
static RCTBridge *RCTCurrentBridgeInstance = nil;

/**
 * A callback method registered when bridge is loaded. It isused by
 * CallableJSModules to invoke methods in JS Runtime.
 */
static RCTCallbackBlock JSModuleInvokerCallback = nil;

NSMutableDictionary<NSString *, RCTModuleData *> *nativeModules = nil;

/**
 * The last current active bridge instance. This is set automatically whenever
 * the bridge is accessed. It can be useful for static functions or singletons
 * that need to access the bridge for purposes such as logging, but should not
 * be relied upon to return any particular instance, due to race conditions.
 */
+ (instancetype)currentBridge
{
  return RCTCurrentBridgeInstance;
}

+ (void)setCurrentBridge:(RCTBridge *)currentBridge
{
  RCTCurrentBridgeInstance = currentBridge;
}

- (void)setJSModuleInvokerCallback:(RCTCallbackBlock)callback
{
  JSModuleInvokerCallback = callback;
}

- (id)moduleForName:(NSString *)moduleName
{
  RCTModuleData *moduleData = [nativeModules objectForKey:moduleName];
  if (moduleData.instance)
    return moduleData.instance;
  Class moduleClass = RCTGetModuleClassForName(moduleName);

  if (!moduleClass)
    return nil;

  moduleData = [[RCTModuleData alloc] initWithModuleClass:moduleClass
                                                   bridge:self
                                           moduleRegistry:moduleRegistry
                                  viewRegistry_DEPRECATED:NULL
                                            bundleManager:NULL
                                        callableJSModules:_callableJSModules];

  [nativeModules setObject:moduleData forKey:moduleName];

  return moduleData.instance;
}

- (id)moduleForName:(NSString *)moduleName lazilyLoadIfNecessary:(BOOL)lazilyLoad
{
  return [self moduleForName:moduleName];
}

- (id)moduleForClass:(Class)moduleClass
{
  NSString *moduleName = RCTBridgeModuleNameForClass(moduleClass);
  return [self moduleForName:moduleName];
}

- (instancetype)init
{
  if (self = [super init]) {
    RCTCurrentBridgeInstance = self;
    nativeModules = [NSMutableDictionary new];
    moduleRegistry = [[RCTModuleRegistry alloc] init];
    [moduleRegistry setBridge:self];
    _callableJSModules = [[RCTCallableJSModules alloc] init];
    [_callableJSModules setBridge:self];
  }
  return self;
}

- (void)enqueueJSCall:(NSString *)moduleDotMethod args:(NSArray *)args
{
  NSArray<NSString *> *ids = [moduleDotMethod componentsSeparatedByString:@"."];
  NSString *module = ids[0];
  NSString *method = ids[1];
  [self enqueueJSCall:module method:method args:args completion:NULL];
}

- (void)enqueueJSCall:(NSString *)module
               method:(NSString *)method
                 args:(NSArray *)args
           completion:(dispatch_block_t)completion
{
  if (JSModuleInvokerCallback) {
    JSModuleInvokerCallback(module, method, args, completion);
  }
}

- (void)enqueueCallback:(NSNumber *)cbID args:(NSArray *)args
{
  // Most probably not needed by any modules.
}

@end

/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTBridge.h"
#import <objc/runtime.h>
#import <objc/message.h>

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

-(id)callMethodInvocation:(NSInvocation *)invocation
                     args:(NSArray *)args
                     sync:(BOOL)sync
                        r:(RCTPromiseResolveBlock _Nullable)r
                       rI: (int)rI
                      rej:(RCTPromiseRejectBlock _Nullable)rej
                     rejI: (int)rejI
                       cb: (RCTResponseSenderBlock _Nullable)cb
                      cbI: (int)cbI
                        e: (RCTResponseErrorBlock _Nullable)e
                       eI:(int)eI {
    
    
    for ( int i = 0; i < [args count]; i++)
    {
        if (i == rI || i == rejI || i == cbI || i == eI) continue;
        id argument = [args objectAtIndex: i];
        [invocation setArgument: &argument atIndex: i+2];
    }
    
    if (!sync) {
        if (r != nil) {
            [invocation setArgument: &r atIndex: rI+2];
        }
        if (rej != nil) {
            [invocation setArgument: &rej atIndex: rejI+2];
        }
        if (cb != nil) {
            [invocation setArgument: &cb atIndex: cbI+2];
        }
        if (e != nil) {
            [invocation setArgument: &e atIndex: eI+2];
        }
    }
    
    id<RCTBridgeModule> nativeModule =  invocation.target;
    
    if ([nativeModule respondsToSelector:NSSelectorFromString(@"methodQueue")] ) {
        dispatch_async([nativeModule methodQueue], ^{
            [invocation invoke];
        });
    } else {
        [invocation invoke];
    }
    
    if (sync) {
        void *ret;
        [invocation getReturnValue:&ret];
        id result = (__bridge id) ret;
        return result;
    }
    
    return nil;
}


-(NSDictionary *)getModuleMethodObjcNames:(NSString *)name {
    
    Class cls = RCTGetModuleClassForName(name);
    unsigned int methodCount;
    NSMutableDictionary *_methods = [[NSMutableDictionary alloc] init];
    NSMutableDictionary *props = [[NSMutableDictionary alloc] init];
    while (cls && cls != [NSObject class] && cls != [NSProxy class]) {
        Method *methods = class_copyMethodList(object_getClass(cls), &methodCount);
        
        for (unsigned int i = 0; i < methodCount; i++) {
            Method method = methods[i];
            NSMutableDictionary *info;
            SEL selector = method_getName(method);
            const char *selectorName = sel_getName(selector);
            if ([NSStringFromSelector(selector) hasPrefix:@"__rct_export__"]) {
                IMP imp = method_getImplementation(method);
                auto exportedMethod = ((const RCTMethodInfo *(*)(id, SEL))imp)(cls, selector);
                info = [[NSMutableDictionary alloc] init];
                [info setValue:[NSString stringWithCString:exportedMethod->jsName encoding:NSUTF8StringEncoding] forKey:@"jsName"];
                [info setValue:exportedMethod->isSync ? @YES : @NO forKey:@"isSync"];
                [_methods setValue:info forKey: [NSString stringWithCString:exportedMethod->objcName encoding:NSUTF8StringEncoding]];
                continue;
            }
            
            if (strncmp(selectorName, "propConfig", strlen("propConfig")) != 0) {
                continue;
            }
            // We need to handle both propConfig_* and propConfigShadow_* methods
            const char *underscorePos = strchr(selectorName + strlen("propConfig"), '_');
            if (!underscorePos) {
                continue;
            }
            
            NSString *name = @(underscorePos + 1);
            NSArray<NSString *> *typeAndKeyPath = ((NSArray<NSString *> * (*)(id, SEL)) objc_msgSend)(cls, selector);
            NSString * type = typeAndKeyPath[0];
            NSString * keyPath = typeAndKeyPath.count > 1 ? typeAndKeyPath[1] : nil;
            
            info = [[NSMutableDictionary alloc] init];
            info[@"type"] = type;
            info[@"keyPath"] = keyPath;
            
            if (keyPath != nil && [keyPath isEqualToString:@"__custom__"]) {
                NSString * selectorString = [NSString stringWithFormat:@"set_%@:for%@View:withDefaultView:", name, @""];
                info[@"customSetter"] = selectorString;
            } else {
                NSString *key = name;
                
                if (keyPath != nil) {
                    NSArray<NSString *> *parts = [keyPath componentsSeparatedByString:@"."];
                    if (parts) {
                        key = parts.lastObject;
                        parts = [parts subarrayWithRange:(NSRange){0, parts.count - 1}];
                    }
                }
                
                info[@"setter"] = [NSString stringWithFormat:@"set%@%@:", [key substringToIndex:1].uppercaseString, [key substringFromIndex:1]];
                info[@"getter"] = key;
                
            }
            
            props[name] = info;
        }
        
        free(methods);
        cls = class_getSuperclass(cls);
    }
    
    return @{
        @"methods": _methods,
        @"props": props
    };
    
}



@end

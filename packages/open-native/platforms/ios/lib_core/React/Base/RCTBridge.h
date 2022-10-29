/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>

#import <React/RCTBridgeDelegate.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTDefines.h>

@class RCTBridge;
/**
 * This function returns the module name for a given class.
 */
RCT_EXTERN NSString *RCTBridgeModuleNameForClass(Class bridgeModuleClass);
RCT_EXTERN Class RCTGetModuleClassForName(NSString *moduleName);
typedef void (
    ^RCTCallbackBlock)(NSString *moduleName, NSString *methodName, NSArray *args, dispatch_block_t onComplete);

@interface RCTBridge : NSObject

/**
 * This method is used to call functions in the JavaScript application context.
 * It is primarily intended for use by modules that require two-way communication
 * with the JavaScript code. Safe to call from any thread.
 */
- (void)enqueueJSCall:(NSString *)moduleDotMethod args:(NSArray *)args;
- (void)enqueueJSCall:(NSString *)module
               method:(NSString *)method
                 args:(NSArray *)args
           completion:(dispatch_block_t)completion;

- (id)moduleForName:(NSString *)moduleName;
- (id)moduleForName:(NSString *)moduleName lazilyLoadIfNecessary:(BOOL)lazilyLoad;
- (id)moduleForClass:(Class)moduleClass;
- (void)setJSModuleInvokerCallback:(RCTCallbackBlock)callback;

@end

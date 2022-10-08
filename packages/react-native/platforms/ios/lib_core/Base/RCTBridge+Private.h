/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTBridge.h>

@class RCTModuleRegistry;
@class RCTModuleData;
@protocol RCTJavaScriptExecutor;

RCT_EXTERN NSDictionary<NSString *, Class> *RCTGetModuleClasses(void);
RCT_EXTERN void RCTRegisterModule(Class);

@interface RCTBridge ()

+ (instancetype)currentBridge;
+ (void)setCurrentBridge:(RCTBridge *)bridge;

/**
 * This method is used to invoke a callback that was registered in the
 * JavaScript application context. Safe to call from any thread.
 */
- (void)enqueueCallback:(NSNumber *)cbID args:(NSArray *)args;

/**
 * This property is mostly used on the main thread, but may be touched from
 * a background thread if the RCTBridge happens to deallocate on a background
 * thread. Therefore, we want all writes to it to be seen atomically.
 */
@property (atomic, strong) RCTBridge *batchedBridge;

/**
 * An object that allows one to require NativeModules/TurboModules.
 * RCTModuleRegistry is implemented in bridgeless mode and bridge mode.
 * Used by RCTRootView.
 */
@property (nonatomic, strong, readonly) RCTModuleRegistry *moduleRegistry;

@end
/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && (__IPHONE_OS_VERSION_MAX_ALLOWED >= 12000) /* __IPHONE_12_0 */
#import <UIKit/UIUserActivity.h>
#endif
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

@interface RCTLinkingManager : RCTEventEmitter <RCTBridgeModule>

+ (BOOL)application:(nonnull UIApplication *)app
            openURL:(nonnull NSURL *)URL
            options:(nonnull NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options;

+ (BOOL)application:(nonnull UIApplication *)application
              openURL:(nonnull NSURL *)URL
    sourceApplication:(nullable NSString *)sourceApplication
           annotation:(nonnull id)annotation;

+ (BOOL)application:(nonnull UIApplication *)application
    continueUserActivity:(nonnull NSUserActivity *)userActivity
      restorationHandler:
        #if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && (__IPHONE_OS_VERSION_MAX_ALLOWED >= 12000) /* __IPHONE_12_0 */
            (nonnull void (^)(NSArray<id<UIUserActivityRestoring>> *_Nullable))restorationHandler;
        #else
            (nonnull void (^)(NSArray *_Nullable))restorationHandler;
        #endif

- (void) openURL:(NSString *)URL resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;

- (void) canOpenURL:(NSString *)URL resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;

- (void) getInitialURL:(RCTPromiseResolveBlock _Nonnull )resolve reject:(RCTPromiseRejectBlock)reject;

- (void) openSettings:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;

- (void) sendIntent:(NSString *)action extras:(NSArray *_Nullable)extras resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;

@end

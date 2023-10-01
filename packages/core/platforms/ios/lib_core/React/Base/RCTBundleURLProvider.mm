/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTBundleURLProvider.h"

#import "RCTConvert.h"
#import "RCTDefines.h"
#import "RCTLog.h"


static NSString *const kRCTEnableDevKey = @"RCT_enableDev";
static NSString *const kRCTEnableMinificationKey = @"RCT_enableMinification";

@implementation RCTBundleURLProvider

- (instancetype)init
{
  self = [super init];
  if (self) {
    [self setDefaults];
  }
  return self;
}

- (NSDictionary *)defaults
{
  return @{
    kRCTEnableDevKey : @YES,
    kRCTEnableMinificationKey : @NO,
  };
}

- (void)settingsUpdated
{

}

- (void)setDefaults
{
  
}

- (void)resetToDefaults
{

}

static NSURL *serverRootWithHostPort(NSString *hostPort, NSString *scheme)
{
    return NULL;
}

#if RCT_DEV_MENU
+ (BOOL)isPackagerRunning:(NSString *)hostPort
{
  return TRUE;
}

+ (BOOL)isPackagerRunning:(NSString *)hostPort scheme:(NSString *)scheme
{
    return TRUE;
}

- (NSString *)guessPackagerHost
{
  return nil;
}
#else
+ (BOOL)isPackagerRunning:(NSString *)hostPort
{
  return false;
}

+ (BOOL)isPackagerRunning:(NSString *)hostPort scheme:(NSString *)scheme
{
  return false;
}
#endif

- (NSString *)packagerServerHost
{
    return nil;
}

- (NSString *)packagerServerHostPort
{
  return nil;
}

- (NSURL *)jsBundleURLForBundleRoot:(NSString *)bundleRoot fallbackURLProvider:(NSURL * (^)(void))fallbackURLProvider
{
    return nil;
}

- (NSURL *)jsBundleURLForSplitBundleRoot:(NSString *)bundleRoot
{
    return nil;
}

- (NSURL *)jsBundleURLForBundleRoot:(NSString *)bundleRoot
                   fallbackResource:(NSString *)resourceName
                  fallbackExtension:(NSString *)extension
{
    return nil;
}

- (NSURL *)jsBundleURLForBundleRoot:(NSString *)bundleRoot fallbackResource:(NSString *)resourceName
{
    return nil;
}

- (NSURL *)jsBundleURLForFallbackResource:(NSString *)resourceName fallbackExtension:(NSString *)extension
{
    return nil;
}

- (NSURL *)resourceURLForResourceRoot:(NSString *)root
                         resourceName:(NSString *)name
                    resourceExtension:(NSString *)extension
                        offlineBundle:(NSBundle *)offlineBundle
{
    return nil;
}

+ (NSURL *)jsBundleURLForBundleRoot:(NSString *)bundleRoot
                       packagerHost:(NSString *)packagerHost
                          enableDev:(BOOL)enableDev
                 enableMinification:(BOOL)enableMinification

{
    return nil;
}

+ (NSURL *)jsBundleURLForBundleRoot:(NSString *)bundleRoot
                       packagerHost:(NSString *)packagerHost
                          enableDev:(BOOL)enableDev
                 enableMinification:(BOOL)enableMinification
                        modulesOnly:(BOOL)modulesOnly
                          runModule:(BOOL)runModule
{
    return nil;
}

+ (NSURL *)jsBundleURLForBundleRoot:(NSString *)bundleRoot
                       packagerHost:(NSString *)packagerHost
                     packagerScheme:(NSString *)scheme
                          enableDev:(BOOL)enableDev
                 enableMinification:(BOOL)enableMinification
                        modulesOnly:(BOOL)modulesOnly
                          runModule:(BOOL)runModule
{
    return nil;
}

+ (NSURL *)resourceURLForResourcePath:(NSString *)path packagerHost:(NSString *)packagerHost query:(NSString *)query
{
    return nil;
}

+ (NSURL *)resourceURLForResourcePath:(NSString *)path
                         packagerHost:(NSString *)packagerHost
                               scheme:(NSString *)scheme
                                query:(NSString *)query
{
    return nil;
}

- (void)updateValue:(id)object forKey:(NSString *)key
{
   
}

- (BOOL)enableDev
{
    return FALSE;
}

- (BOOL)enableMinification
{
    return FALSE;
}

- (NSString *)jsLocation
{
    return nil;
}

- (NSString *)packagerScheme
{
    return nil;
}

- (void)setEnableDev:(BOOL)enableDev
{
  
}

- (void)setJsLocation:(NSString *)jsLocation
{

}

- (void)setEnableMinification:(BOOL)enableMinification
{
  
}

- (void)setPackagerScheme:(NSString *)packagerScheme
{
  
}

+ (instancetype)sharedSettings
{
  static RCTBundleURLProvider *sharedInstance;
  static dispatch_once_t once_token;
  dispatch_once(&once_token, ^{
    sharedInstance = [RCTBundleURLProvider new];
  });
  return sharedInstance;
}

@end

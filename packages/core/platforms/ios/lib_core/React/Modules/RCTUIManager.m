/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTUIManager.h"

#import <AVFoundation/AVFoundation.h>

#import "RCTAssert.h"
#import "RCTBridge+Private.h"
#import "RCTBridge.h"
#import "RCTComponent.h"
#import "RCTConvert.h"
#import "RCTUtils.h"
#import "RCTView.h"
#import "RCTViewManager.h"
#import "UIView+React.h"
#import "RCTUIManagerUtils.h"

@implementation RCTUIManager {
    NSMutableArray<RCTViewManagerUIBlock> *_pendingUIBlocks;
    // Everytime we create a new View, we must update the _viewRegistry
    // and remove the View when it's removed from JavaScript.
    // The Number here is the reactTag, which in our case will just be the id of
    // the view we will from JavaScript.
    NSMutableDictionary<NSNumber *, UIView *> *_viewRegistry; // Main thread only
    NSMapTable<NSString *, UIView *> *_nativeIDRegistry;
}

@synthesize bridge = _bridge;
@synthesize moduleRegistry = _moduleRegistry;

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (void)invalidate
{
    RCTExecuteOnMainQueue(^{
      self->_viewRegistry = nil;
      self->_nativeIDRegistry = nil;
      self->_bridge = nil;
    });
}

- (NSMutableDictionary<NSNumber *, UIView *> *)viewRegistry
{
  // NOTE: this method only exists so that it can be accessed by unit tests
  if (!_viewRegistry) {
    _viewRegistry = [NSMutableDictionary new];
  }
  return _viewRegistry;
}

- (NSMapTable *)nativeIDRegistry
{
  if (!_nativeIDRegistry) {
    _nativeIDRegistry = [NSMapTable strongToWeakObjectsMapTable];
  }
  return _nativeIDRegistry;
}

- (void)setBridge:(RCTBridge *)bridge
{
  _bridge = bridge;
  _viewRegistry = [NSMutableDictionary new];
  _nativeIDRegistry = [NSMapTable strongToWeakObjectsMapTable];
}


#pragma mark - Event emitting

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (void)addUIBlock:(RCTViewManagerUIBlock)block
{
    RCTAssertUIManagerQueue();
    __weak typeof(self) weakSelf = self;
    
    void (^mountingBlock)(void) = ^{
      typeof(self) strongSelf = weakSelf;
      @try {
          // For now we will just run the UI Block as soon as it is recieved.
          // since we assumed that everything is running on the main thread.
          block(strongSelf, strongSelf->_viewRegistry);
      } @catch (NSException *exception) {
        RCTLogError(@"Exception thrown while executing UI block: %@", exception);
      }
    };
    
    mountingBlock();
    
}

- (void)prependUIBlock:(RCTViewManagerUIBlock)block
{
    [self addUIBlock:block];
}

- (void) registerView:(UIView *)view reactTag:(NSNumber *)reactTag {
    [_viewRegistry setObject:view forKey:reactTag];
}

- (void) unRegisterView:(NSNumber *)reactTag {
    [_viewRegistry removeObjectForKey:reactTag];
}

@end

@implementation RCTBridge (RCTUIManager)

- (RCTUIManager *)uiManager
{
  return [self moduleForClass:[RCTUIManager class]];
}

@end

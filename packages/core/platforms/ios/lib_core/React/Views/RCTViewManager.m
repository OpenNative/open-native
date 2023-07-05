/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTViewManager.h"

#import "RCTAssert.h"
#import "RCTBridge.h"
#import "RCTConvert.h"
#import "RCTLog.h"
#import "RCTUIManager.h"
#import "RCTUtils.h"
#import "RCTView.h"
#import "UIView+React.h"

@implementation RCTViewManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
    // View manager runs on main queue.
    return dispatch_get_main_queue();
}

- (void)setBridge:(RCTBridge *)bridge
{
  _bridge = bridge;
}

- (UIView *)view
{
  return [RCTView new];
}

@end

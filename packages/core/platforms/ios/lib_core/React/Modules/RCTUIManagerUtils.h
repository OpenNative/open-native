/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

#import <React/RCTAssert.h>
#import <React/RCTDefines.h>

/**
 This just returns the main queue.
 */
RCT_EXTERN dispatch_queue_t RCTGetUIManagerQueue(void);

/**
 * Default name for the UIManager queue.
 */
RCT_EXTERN char *const RCTUIManagerQueueName;

/**
 * Check if we are currently on UIManager queue.
 * Please do not use this unless you really know what you're doing.
 */
RCT_EXTERN BOOL RCTIsUIManagerQueue(void);

/**
 * Check if we are currently on Pseudo UIManager queue.
 * Please do not use this unless you really know what you're doing.
 */
RCT_EXTERN BOOL RCTIsPseudoUIManagerQueue(void);

/**
 * *Asynchronously* executes the specified block on the UIManager queue.
 * Unlike `dispatch_async()` this will execute the block immediately
 * if we're already on the UIManager queue.
 */
RCT_EXTERN void RCTExecuteOnUIManagerQueue(dispatch_block_t block);

/**
 * *Synchronously* executes the specified block on the UIManager queue.
 * Unlike `dispatch_sync()` this will execute the block immediately
 * if we're already on the UIManager queue.
 * Please do not use this unless you really know what you're doing.
 */
RCT_EXTERN void RCTUnsafeExecuteOnUIManagerQueueSync(dispatch_block_t block);

/**
 * Convenience macro for asserting that we're running on UIManager queue.
 */
#define RCTAssertUIManagerQueue() \
  RCTAssert(                      \
      RCTIsUIManagerQueue() || RCTIsPseudoUIManagerQueue(), @"This function must be called on the UIManager queue")

/**
 * Returns new unique root view tag.
 */
RCT_EXTERN NSNumber *RCTAllocateRootViewTag(void);

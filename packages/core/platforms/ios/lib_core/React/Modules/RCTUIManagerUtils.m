/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTUIManagerUtils.h"

#import <stdatomic.h>

#import "RCTAssert.h"

char *const RCTUIManagerQueueName = "";

static BOOL pseudoUIManagerQueueFlag = NO;

dispatch_queue_t RCTGetUIManagerQueue(void)
{
    
  return dispatch_get_main_queue();
}

BOOL RCTIsUIManagerQueue()
{
  static void *queueKey = &queueKey;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    dispatch_queue_set_specific(RCTGetUIManagerQueue(), queueKey, queueKey, NULL);
  });
  return dispatch_get_specific(queueKey) == queueKey;
}

BOOL RCTIsPseudoUIManagerQueue()
{
  if (RCTIsMainQueue()) {
    return pseudoUIManagerQueueFlag;
  }

  return NO;
}

void RCTExecuteOnUIManagerQueue(dispatch_block_t block)
{
  if (RCTIsUIManagerQueue() || RCTIsPseudoUIManagerQueue()) {
    block();
  } else {
    dispatch_async(RCTGetUIManagerQueue(), ^{
      block();
    });
  }
}

void RCTUnsafeExecuteOnUIManagerQueueSync(dispatch_block_t block)
{
  if (RCTIsUIManagerQueue() || RCTIsPseudoUIManagerQueue()) {
    block();
  } else {
    if (RCTIsMainQueue()) {
      dispatch_semaphore_t mainQueueBlockingSemaphore = dispatch_semaphore_create(0);
      dispatch_semaphore_t uiManagerQueueBlockingSemaphore = dispatch_semaphore_create(0);

      // Dispatching block which blocks UI Manager queue.
      dispatch_async(RCTGetUIManagerQueue(), ^{
        // Initiating `block` execution on main queue.
        dispatch_semaphore_signal(mainQueueBlockingSemaphore);
        // Waiting for finishing `block`.
        dispatch_semaphore_wait(uiManagerQueueBlockingSemaphore, DISPATCH_TIME_FOREVER);
      });

      // Waiting for block on UIManager queue.
      dispatch_semaphore_wait(mainQueueBlockingSemaphore, DISPATCH_TIME_FOREVER);
      pseudoUIManagerQueueFlag = YES;
      // `block` execution while UIManager queue is blocked by semaphore.
      block();
      pseudoUIManagerQueueFlag = NO;
      // Signalling UIManager block.
      dispatch_semaphore_signal(uiManagerQueueBlockingSemaphore);
    } else {
      dispatch_sync(RCTGetUIManagerQueue(), ^{
        block();
      });
    }
  }
}

NSNumber *RCTAllocateRootViewTag()
{
  // Numbering of these tags goes from 1, 11, 21, 31, ..., 100501, ...
  static _Atomic int64_t rootViewTagCounter = 0;
  return @(atomic_fetch_add_explicit(&rootViewTagCounter, 1, memory_order_relaxed) * 10 + 1);
}

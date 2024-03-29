/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <CoreGraphics/CoreGraphics.h>

#import <Foundation/Foundation.h>

/**
 * These block types can be used for mapping input event handlers from JS to view
 * properties. Unlike JS method callbacks, these can be called multiple times.
 */
typedef void (^RCTDirectEventBlock)(NSDictionary *body);
typedef void (^RCTBubblingEventBlock)(NSDictionary *body);
typedef void (^RCTCapturingEventBlock)(NSDictionary *body);

/**
 * Logical node in a tree of application components. Both `ShadowView` and
 * `UIView` conforms to this. Allows us to write utilities that reason about
 * trees generally.
 */
@protocol RCTComponent <NSObject>

@property (nonatomic, copy) NSNumber *reactTag;

@end

// TODO: this is kinda dumb - let's come up with a
// better way of identifying root React views please!
static inline BOOL RCTIsReactRootView(NSNumber *reactTag)
{
  return reactTag.integerValue % 10 == 1;
}

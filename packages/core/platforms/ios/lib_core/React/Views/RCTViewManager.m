/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTViewManager.h"

#import <objc/runtime.h>
#import <objc/message.h>

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

- (void)callCustomSetter:(NSString *)selectorString onView:(id<RCTComponent>)view withProp:(id)json
{
    SEL setter = NSSelectorFromString(selectorString);
    id<RCTComponent> _defaultView = nil;
    ((void (*)(id, SEL, id, id, id))objc_msgSend)(self, setter, json, view, _defaultView);
}

-(void)convertAndSet:(NSString *)selector onView:(id<RCTComponent>)target type:(NSString *)type json:(id)json {
    SEL setter = NSSelectorFromString(selector);
    SEL sel = NSSelectorFromString(type);
    NSMethodSignature *typeSignature = [[RCTConvert class] methodSignatureForSelector:sel];
    
    switch (typeSignature.methodReturnType[0]) {
#define RCT_CASE(_value, _type)                                       \
case _value: {                                                      \
_type (*convert)(id, SEL, id) = (typeof(convert))objc_msgSend;    \
void (*set)(id, SEL, _type) = (typeof(set))objc_msgSend;          \
set(target, setter, convert([RCTConvert class], sel, json));                \
break;                                                            \
}
            
            RCT_CASE(_C_SEL, SEL)
            RCT_CASE(_C_CHARPTR, const char *)
            RCT_CASE(_C_CHR, char)
            RCT_CASE(_C_UCHR, unsigned char)
            RCT_CASE(_C_SHT, short)
            RCT_CASE(_C_USHT, unsigned short)
            RCT_CASE(_C_INT, int)
            RCT_CASE(_C_UINT, unsigned int)
            RCT_CASE(_C_LNG, long)
            RCT_CASE(_C_ULNG, unsigned long)
            RCT_CASE(_C_LNG_LNG, long long)
            RCT_CASE(_C_ULNG_LNG, unsigned long long)
            RCT_CASE(_C_FLT, float)
            RCT_CASE(_C_DBL, double)
            RCT_CASE(_C_BOOL, BOOL)
            RCT_CASE(_C_PTR, void *)
            RCT_CASE(_C_ID, id)
        default: {
            // setterBlock = createNSInvocationSetter(typeSignature, type, getter, setter);
            break;
        }
    }
}

@end

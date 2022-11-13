/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import "CallInvoker.h"
#import <jsi/jsi.h>

#define RCT_IS_TURBO_MODULE_CLASS(klass) \
  ((RCTTurboModuleEnabled() && [(klass) conformsToProtocol:@protocol(RCTTurboModule)]))
#define RCT_IS_TURBO_MODULE_INSTANCE(module) RCT_IS_TURBO_MODULE_CLASS([(module) class])

namespace facebook {
namespace react {

class CallbackWrapper {};

typedef std::weak_ptr<CallbackWrapper> (
^RCTRetainJSCallback)(jsi::Function &&callback, jsi::Runtime &runtime, std::shared_ptr<CallInvoker> jsInvoker);

class TurboModule {};
/**
 * ObjC++ specific TurboModule base class.
 */
class JSI_EXPORT ObjCTurboModule : public TurboModule {
public:
  struct InitParams {
    std::string moduleName;
    id<RCTTurboModule> instance;
    std::shared_ptr<CallInvoker> jsInvoker;
    std::shared_ptr<CallInvoker> nativeInvoker;
    bool isSyncModule;
    RCTRetainJSCallback retainJSCallback;
  };
};

} // namespace react
} // namespace facebook

@protocol RCTTurboModule <NSObject>
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params;
@end

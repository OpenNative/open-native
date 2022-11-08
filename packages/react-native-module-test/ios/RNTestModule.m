#import "RNTestModule.h"

@implementation RNTestModule

RCT_EXPORT_MODULE(RCTRNTestModuleAliased)

RCT_EXPORT_METHOD(show : (RCTPromiseResolveBlock)resolve withRejecter : (RCTPromiseRejectBlock)reject)

{
  resolve(@"show method invoked");
}

RCT_EXPORT_METHOD(testPromise : (RCTPromiseResolveBlock)resolve withRejecter : (RCTPromiseRejectBlock)reject)

{
  resolve(@"result");
}

- (NSString *)getName
{
  return @"RNTestModule";
}

@end

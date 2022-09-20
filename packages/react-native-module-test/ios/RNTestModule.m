#import "RNTestModule.h"

@implementation RNTestModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(show : (RCTPromiseResolveBlock)resolve withRejecter : (RCTPromiseRejectBlock)reject)

{
  NSLog(@"Called RCT Method: show");
  resolve(@"show method invoked");
}

- (NSString *)getName
{
  return @"RNTestModule";
}

@end

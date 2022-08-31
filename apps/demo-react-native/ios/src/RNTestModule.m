#import "RNTestModule.h"

@implementation RNTestModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(multiply,
                 multiplyWithA:(double)a withB:(double)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
  NSNumber *result = @(a * b);

  resolve(result);
}

@end
#import "RNTestModule.h"

@implementation RNTestModule

RCT_EXPORT_MODULE(RNTestModule)

RCT_EXPORT_METHOD(testPromise : (RCTPromiseResolveBlock)resolve withRejecter : (RCTPromiseRejectBlock)reject)

{
  resolve(@YES);
}

RCT_EXPORT_METHOD(testCallback : (RCTResponseSenderBlock)callback)

{
    callback(@[@YES]);
}

RCT_EXPORT_METHOD(testString:(NSString*)value resolve:(RCTPromiseResolveBlock)resolve withRejecter : (RCTPromiseRejectBlock)reject)

{
    resolve(value);
}

RCT_EXPORT_METHOD(testBoolean:(BOOL *)value resolve:(RCTPromiseResolveBlock)resolve withRejecter : (RCTPromiseRejectBlock)reject)

{
    resolve(value ? @YES : @NO);
}

RCT_EXPORT_METHOD(testNumber:(NSNumber *)value resolve:(RCTPromiseResolveBlock)resolve withRejecter : (RCTPromiseRejectBlock)reject)

{
    resolve(value);
}

RCT_EXPORT_METHOD(testObject:(NSDictionary *)value resolve:(RCTPromiseResolveBlock)resolve withRejecter : (RCTPromiseRejectBlock)reject)

{
    resolve(value);
}


RCT_EXPORT_METHOD(testArray:(NSArray *)value resolve:(RCTPromiseResolveBlock)resolve withRejecter : (RCTPromiseRejectBlock)reject)

{
    resolve(value);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(testSyncMethod)
{
    return @YES;
}


@end

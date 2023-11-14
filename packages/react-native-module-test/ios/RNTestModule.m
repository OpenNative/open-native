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

RCT_EXPORT_METHOD(testInteger:(NSInteger)value resolve:(RCTPromiseResolveBlock)resolve withRejecter : (RCTPromiseRejectBlock)reject)

{
    resolve([[NSNumber alloc] initWithInteger:value]);
}

RCT_EXPORT_METHOD(testCGFloat:(CGFloat)value resolve:(RCTPromiseResolveBlock)resolve withRejecter : (RCTPromiseRejectBlock)reject)

{
    resolve([[NSNumber alloc] initWithFloat:value]);
}

RCT_EXPORT_METHOD(testInt:(int)value resolve:(RCTPromiseResolveBlock)resolve withRejecter : (RCTPromiseRejectBlock)reject)

{
    resolve([[NSNumber alloc] initWithInt:value]);
}

RCT_EXPORT_METHOD(testFloat:(float)value resolve:(RCTPromiseResolveBlock)resolve withRejecter : (RCTPromiseRejectBlock)reject)

{
    resolve([[NSNumber alloc] initWithFloat:value]);
}

RCT_EXPORT_METHOD(testDouble:(double)value resolve:(RCTPromiseResolveBlock)resolve withRejecter : (RCTPromiseRejectBlock)reject)

{
    resolve([[NSNumber alloc] initWithDouble:value]);
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

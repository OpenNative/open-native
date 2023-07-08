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

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(testArgs: (NSString *)stringVal)
{
  return stringVal;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(testReturnValue)
{
  return @"testReturnValue";
}

- (NSString *)getName
{
  return @"RNTestModule";
}

RCT_REMAP_METHOD(authorize,
                 issuer: (NSString *) issuer
                 redirectUrl: (NSString *) redirectUrl
                 clientId: (NSString *) clientId
                 clientSecret: (NSString *) clientSecret
                 scopes: (NSArray *) scopes
                 additionalParameters: (NSDictionary *_Nullable) additionalParameters
                 serviceConfiguration: (NSDictionary *_Nullable) serviceConfiguration
                 skipCodeExchange: (BOOL) skipCodeExchange
                 connectionTimeoutSeconds: (double) connectionTimeoutSeconds
                 additionalHeaders: (NSDictionary *_Nullable) additionalHeaders
                 useNonce: (BOOL *) useNonce
                 usePKCE: (BOOL *) usePKCE
                 iosCustomBrowser: (NSString *) iosCustomBrowser
                 prefersEphemeralSession: (BOOL *) prefersEphemeralSession
                 resolve: (RCTPromiseResolveBlock) resolve
                 reject: (RCTPromiseRejectBlock)  reject)
{
    
}


@end

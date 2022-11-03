// This file will be updated automatically by hooks/before-prepareNativeApp.js.
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <react_native_module_test/RNTestModule.h>
#import <A0Auth0/A0Auth0.h>

// START: package: react-native-module-test; podspec: react-native-module-test.podspec
// RNTestModule.m
@interface RNTestModule (TNSRNTestModule)
- (void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject;
@end
// END: package: react-native-module-test; podspec: react-native-module-test.podspec

// START: package: react-native-auth0; podspec: A0Auth0.podspec
// A0Auth0.m
@interface A0Auth0 (TNSA0Auth0)
- (void)hide;

- (void)showUrl:(NSString*)urlString usingEphemeralSession:(BOOL)ephemeralSession closeOnLoad:(BOOL)closeOnLoad callback:(RCTResponseSenderBlock)callback;

- (void)oauthParameters:(RCTResponseSenderBlock)callback;
@end
// END: package: react-native-auth0; podspec: A0Auth0.podspec

// START: react-native-podspecs placeholder interface
@interface RNPodspecs: NSObject
@end
// END: react-native-podspecs placeholder interface

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTAlertManager.h"

#import <FBReactNativeSpec/FBReactNativeSpec.h>
#import <React/RCTAssert.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>

#import "CoreModulesPlugins.h"
#import "RCTAlertController.h"

@implementation RCTAlertManager {
  NSHashTable *_alertControllers;
}

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (void)invalidate
{
  for (UIAlertController *alertController in _alertControllers) {
    [alertController.presentingViewController dismissViewControllerAnimated:YES completion:nil];
  }
}

- (RCTAlertViewStyle) GetAlertTypeEnum:(NSString *)json {
    if ([json isEqual:@"secure-text"]) return RCTAlertViewStyleSecureTextInput;
    if ([json isEqual:@"plain-text"]) return RCTAlertViewStylePlainTextInput;
    if ([json isEqual:@"login-password"]) return RCTAlertViewStyleLoginAndPasswordInput;
    return RCTAlertViewStyleDefault;
}

- (UIKeyboardType) GetKeyboardTypeEnum:(NSString *)json {
    if ([json isEqual:@"ascii-capable"]) return UIKeyboardTypeASCIICapable;
    if ([json isEqual:@"numbers-and-punctuation"]) return UIKeyboardTypeNumbersAndPunctuation;
    if ([json isEqual:@"url"]) return UIKeyboardTypeURL;
    if ([json isEqual:@"number-pad"]) return UIKeyboardTypeNumberPad;
    if ([json isEqual:@"phone-pad"]) return UIKeyboardTypePhonePad;
    if ([json isEqual:@"name-phone-pad"]) return UIKeyboardTypeNamePhonePad;
    if ([json isEqual:@"email-address"]) return UIKeyboardTypeEmailAddress;
    if ([json isEqual:@"decimal-pad"]) return UIKeyboardTypeDecimalPad;
    if ([json isEqual:@"twitter"]) return UIKeyboardTypeTwitter;
    if ([json isEqual:@"web-search"]) return UIKeyboardTypeWebSearch;
    if ([json isEqual:@"numeric"]) return UIKeyboardTypeDecimalPad;

    return UIKeyboardTypeDefault;
}

/**
 * @param {NSDictionary} args Dictionary of the form
 *
 *   @{
 *     @"message": @"<Alert message>",
 *     @"buttons": @[
 *       @{@"<key1>": @"<title1>"},
 *       @{@"<key2>": @"<title2>"},
 *     ],
 *     @"cancelButtonKey": @"<key2>",
 *   }
 * The key from the `buttons` dictionary is passed back in the callback on click.
 * Buttons are displayed in the order they are specified.
 */
RCT_EXPORT_METHOD(alertWithArgs : (NSDictionary *)args callback : (RCTResponseSenderBlock)callback)
{
  NSString *title = args[@"title"];
  NSString *message = args[@"message"];
    RCTAlertViewStyle type = [self GetAlertTypeEnum:args[@"type"]];
    
  NSArray<NSDictionary *> *buttons = args[@"buttons"];
    
  NSString *defaultValue = args[@"defaultValue"];
  NSString *cancelButtonKey = args[@"CancelButtonKey"];
  NSString *destructiveButtonKey = args[@"destructiveButtonKey"];
    UIKeyboardType keyboardType = [self GetKeyboardTypeEnum:args[@"keyboardType"]];

  if (!title && !message) {
    RCTLogError(@"Must specify either an alert title, or message, or both");
    return;
  }

  if (buttons.count == 0) {
    if (type == RCTAlertViewStyleDefault) {
      buttons = @[ @{@"0" : RCTUIKitLocalizedString(@"OK")} ];
      cancelButtonKey = @"0";
    } else {
      buttons = @[
        @{@"0" : RCTUIKitLocalizedString(@"OK")},
        @{@"1" : RCTUIKitLocalizedString(@"Cancel")},
      ];
      cancelButtonKey = @"1";
    }
  }

  RCTAlertController *alertController = [RCTAlertController alertControllerWithTitle:title
                                                                             message:nil
                                                                      preferredStyle:UIAlertControllerStyleAlert];
  switch (type) {
    case RCTAlertViewStylePlainTextInput: {
      [alertController addTextFieldWithConfigurationHandler:^(UITextField *textField) {
        textField.secureTextEntry = NO;
        textField.text = defaultValue;
        textField.keyboardType = keyboardType;
      }];
      break;
    }
    case RCTAlertViewStyleSecureTextInput: {
      [alertController addTextFieldWithConfigurationHandler:^(UITextField *textField) {
        textField.placeholder = RCTUIKitLocalizedString(@"Password");
        textField.secureTextEntry = YES;
        textField.text = defaultValue;
        textField.keyboardType = keyboardType;
      }];
      break;
    }
    case RCTAlertViewStyleLoginAndPasswordInput: {
      [alertController addTextFieldWithConfigurationHandler:^(UITextField *textField) {
        textField.placeholder = RCTUIKitLocalizedString(@"Login");
        textField.text = defaultValue;
        textField.keyboardType = keyboardType;
      }];
      [alertController addTextFieldWithConfigurationHandler:^(UITextField *textField) {
        textField.placeholder = RCTUIKitLocalizedString(@"Password");
        textField.secureTextEntry = YES;
      }];
      break;
    }
    case RCTAlertViewStyleDefault:
      break;
  }

  alertController.message = message;

  for (NSDictionary *button in buttons) {
    if (button.count != 1) {
      RCTLogError(@"Button definitions should have exactly one key.");
    }
    NSString *buttonKey = button.allKeys.firstObject;
    NSString *buttonTitle = button[buttonKey];

    UIAlertActionStyle buttonStyle = UIAlertActionStyleDefault;
    if ([buttonKey isEqualToString:cancelButtonKey]) {
      buttonStyle = UIAlertActionStyleCancel;
    } else if ([buttonKey isEqualToString:destructiveButtonKey]) {
      buttonStyle = UIAlertActionStyleDestructive;
    }
    __weak RCTAlertController *weakAlertController = alertController;
    [alertController
        addAction:[UIAlertAction
                      actionWithTitle:buttonTitle
                                style:buttonStyle
                              handler:^(__unused UIAlertAction *action) {
                                switch (type) {
                                  case RCTAlertViewStylePlainTextInput:
                                  case RCTAlertViewStyleSecureTextInput:
                                    callback(@[ buttonKey, [weakAlertController.textFields.firstObject text] ]);
                                    [weakAlertController hide];
                                    break;
                                  case RCTAlertViewStyleLoginAndPasswordInput: {
                                    NSDictionary<NSString *, NSString *> *loginCredentials = @{
                                      @"login" : [weakAlertController.textFields.firstObject text],
                                      @"password" : [weakAlertController.textFields.lastObject text]
                                    };
                                    callback(@[ buttonKey, loginCredentials ]);
                                    [weakAlertController hide];
                                    break;
                                  }
                                  case RCTAlertViewStyleDefault:
                                    callback(@[ buttonKey ]);
                                    [weakAlertController hide];
                                    break;
                                }
                              }]];
  }

  if (!_alertControllers) {
    _alertControllers = [NSHashTable weakObjectsHashTable];
  }
  [_alertControllers addObject:alertController];

  dispatch_async(dispatch_get_main_queue(), ^{
    [alertController show:YES completion:nil];
  });
}


@end

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */

import { type EventSubscription } from '../vendor/emitter/EventEmitter';
import NativeEventEmitter from '../EventEmitter/NativeEventEmitter';
import { Platform } from '../Utilities/Platform';
import { NativeModules } from '../..';

const NativeLinkingManager =
  Platform.OS === 'ios' && NativeModules.LinkingManager;
const NativeIntentAndroid =
  Platform.OS === 'android' && NativeModules.IntentAndroid;

type LinkingEventDefinitions = {
  url: [{ url: string }];
};

/**
 * `Linking` gives you a general interface to interact with both incoming
 * and outgoing app links.
 *
 * See https://reactnative.dev/docs/linking.html
 */
class _Linking extends NativeEventEmitter {
  constructor() {
    super(Platform.OS === 'ios' ? (NativeLinkingManager as any) : null);
  }

  /**
   * Add a handler to Linking changes by listening to the `url` event type
   * and providing the handler
   *
   * See https://reactnative.dev/docs/linking.html#addeventlistener
   */
  addEventListener(
    eventType: string,
    listener: (...args: LinkingEventDefinitions['url']) => unknown,
    context: unknown
  ): EventSubscription {
    return this.addListener(eventType, listener);
  }

  /**
   * @deprecated Use `remove` on the EventSubscription from `addEventListener`.
   */
  removeEventListener(
    eventType: string,
    listener: (...args: LinkingEventDefinitions['url']) => unknown
  ): void {
    // NOTE: This will report a deprecation notice via `console.error`.
    this.removeListener(eventType, listener);
  }

  /**
   * Try to open the given `url` with any of the installed apps.
   *
   * See https://reactnative.dev/docs/linking.html#openurl
   */
  openURL(url: string): Promise<void> {
    this._validateURL(url);
    if (Platform.OS === 'android') {
      return NativeIntentAndroid.openURL(url);
    } else {
      return NativeLinkingManager.openURL(url);
    }
  }

  /**
   * Determine whether or not an installed app can handle a given URL.
   *
   * See https://reactnative.dev/docs/linking.html#canopenurl
   */
  canOpenURL(url: string): Promise<boolean> {
    this._validateURL(url);
    if (Platform.OS === 'android') {
      return NativeIntentAndroid.canOpenURL(url);
    } else {
      return NativeLinkingManager.canOpenURL(url);
    }
  }

  /**
   * Open app settings.
   *
   * See https://reactnative.dev/docs/linking.html#opensettings
   */
  openSettings(): Promise<void> {
    if (Platform.OS === 'android') {
      return NativeIntentAndroid.openSettings();
    } else {
      return NativeLinkingManager.openSettings();
    }
  }

  /**
   * If the app launch was triggered by an app link,
   * it will give the link url, otherwise it will give `null`
   *
   * See https://reactnative.dev/docs/linking.html#getinitialurl
   */
  getInitialURL(): Promise<string> {
    return NativeLinkingManager.getInitialURL();
  }

  /*
   * Launch an Android intent with extras (optional)
   *
   * @platform android
   *
   * See https://reactnative.dev/docs/linking.html#sendintent
   */
  sendIntent(
    action: string,
    extras?: Array<{
      key: string;
      value: string | number | boolean;
    }>
  ): Promise<void> {
    if (Platform.OS === 'android') {
      return NativeIntentAndroid.sendIntent(action, extras);
    } else {
      return new Promise((resolve, reject) => reject(new Error('Unsupported')));
    }
  }

  _validateURL(url: string) {
    if (typeof url !== 'string' || !url) {
      throw new Error('Invalid url');
    }
  }
}

export const Linking = new _Linking();

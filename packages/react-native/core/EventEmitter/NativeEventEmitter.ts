/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import { type EventSubscription, type IEventEmitter } from '../vendor/emitter/EventEmitter';
import Platform from '../Utilities/Platform';
import RCTDeviceEventEmitter from './RCTDeviceEventEmitter';

export interface NativeModule {
  addListener(eventType: string): void;
  removeListeners(count: number): void;
}

export type { EventSubscription };

/**
 * `NativeEventEmitter` is intended for use by Native Modules to emit events to
 * JavaScript listeners. If a `NativeModule` is supplied to the constructor, it
 * will be notified (via `addListener` and `removeListeners`) when the listener
 * count changes to manage "native memory".
 *
 * Currently, all native events are fired via a global `RCTDeviceEventEmitter`.
 * This means event names must be globally unique, and it means that call sites
 * can theoretically listen to `RCTDeviceEventEmitter` (although discouraged).
 */
export class NativeEventEmitter implements IEventEmitter {
  _nativeModule: NativeModule;

  constructor(nativeModule: NativeModule) {
    if (Platform.OS === 'ios') {
      if (nativeModule === null) {
        throw new Error('`new NativeEventEmitter()` requires a non-null argument.');
      }
    }

    const hasAddListener =
      // $FlowFixMe[method-unbinding] added when improving typing for this parameters
      !!nativeModule && typeof nativeModule.addListener === 'function';
    const hasRemoveListeners =
      // $FlowFixMe[method-unbinding] added when improving typing for this parameters
      !!nativeModule && typeof nativeModule.removeListeners === 'function';

    if (nativeModule && hasAddListener && hasRemoveListeners) {
      this._nativeModule = nativeModule;
    } else if (nativeModule != null) {
      if (!hasAddListener) {
        console.warn('`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.');
      }
      if (!hasRemoveListeners) {
        console.warn('`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.');
      }
    }
  }

  addListener(eventType: string, listener: (...args: unknown[]) => unknown, context?: unknown): EventSubscription {
    this._nativeModule?.addListener(eventType);
    let subscription: EventSubscription = RCTDeviceEventEmitter.addListener(eventType, listener, context);

    return {
      remove: () => {
        if (subscription != null) {
          this._nativeModule?.removeListeners(1);
          // $FlowFixMe[incompatible-use]
          subscription.remove();
          subscription = null;
        }
      },
    };
  }

  /**
   * @deprecated Use `remove` on the EventSubscription from `addListener`.
   */
  removeListener(eventType: string, listener: (...args: unknown[]) => unknown): void {
    this._nativeModule?.removeListeners(1);
    // NOTE: This will report a deprecation notice via `console.error`.
    // $FlowFixMe[prop-missing] - `removeListener` exists but is deprecated.
    RCTDeviceEventEmitter.removeListener(eventType, listener);
  }

  emit(eventType: string, ...args: unknown[]): void {
    // Generally, `RCTDeviceEventEmitter` is directly invoked. But this is
    // included for completeness.
    RCTDeviceEventEmitter.emit(eventType, ...args);
  }

  removeAllListeners(eventType?: string): void {
    if (eventType === null) {
      throw new Error('Event type cannot be null');
    }
    this._nativeModule?.removeListeners(this.listenerCount(eventType));
    RCTDeviceEventEmitter.removeAllListeners(eventType);
  }

  listenerCount(eventType: string): number {
    return RCTDeviceEventEmitter.listenerCount(eventType);
  }
}

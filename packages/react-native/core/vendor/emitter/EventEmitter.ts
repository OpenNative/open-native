/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

'use strict';
import EventEmitter from './_EventEmitter';

import type { EventSubscription } from './EventSubscription';

export default EventEmitter;

export type { EventSubscription };

/**
 * Essential interface for an EventEmitter.
 */
export interface IEventEmitter {
  /**
   * Registers a listener that is called when the supplied event is emitted.
   * Returns a subscription that has a `remove` method to undo registration.
   */
  addListener(eventType: string, listener: (...args: unknown[]) => unknown, context?: unknown): EventSubscription;

  /**
   * Emits the supplied event. Additional arguments supplied to `emit` will be
   * passed through to each of the registered listeners.
   */
  emit(eventType: string, ...args: unknown[]): void;

  /**
   * Removes all registered listeners.
   */
  removeAllListeners(eventType?: string): void;

  /**
   * Returns the number of registered listeners for the supplied event.
   */
  listenerCount(eventType: string): number;
}

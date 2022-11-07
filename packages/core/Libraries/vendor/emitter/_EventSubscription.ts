/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-react-native file in the root directory of this source tree.
 */
import { type EventSubscription } from './EventSubscription';
import type EventSubscriptionVendor from './_EventSubscriptionVendor';

/**
 * EventSubscription represents a subscription to a particular event. It can
 * remove its own subscription.
 * @see https://github.com/facebook/react-native/blob/b788b6e1c9cf8cfbba6f3e720612555696132e4b/Libraries/vendor/emitter/EventEmitter.d.ts#L14
 */
export default abstract class _EventSubscription implements EventSubscription {
  abstract readonly listener: (...args: unknown[]) => unknown;
  abstract readonly context: unknown;

  /** To be initialised post-construction. */
  eventType: string;

  /** To be initialised post-construction. */
  key: number;

  /**
   * @param subscriber the subscriber that controls this subscription.
   */
  constructor(public subscriber: EventSubscriptionVendor) {}

  /**
   * Removes this subscription from the subscriber that controls it.
   */
  remove(): void {
    this.subscriber.removeSubscription(this);
  }
}

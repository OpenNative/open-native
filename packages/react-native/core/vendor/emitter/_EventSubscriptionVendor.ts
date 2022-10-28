/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-react-native file in the root directory of this source tree.
 */
import type EventSubscription from './_EventSubscription';

/**
 * EventSubscriptionVendor stores a set of EventSubscriptions that are
 * subscribed to a particular event type.
 * @see https://github.com/facebook/react-native/blob/516bf7bd94d14600920a3d78fdcf51ea7fe48495/Libraries/EventEmitter/EventSubscriptionVendor.js
 */
export default class EventSubscriptionVendor {
  private readonly _subscriptionsForType: {
    [type: string]: EventSubscription[];
  } = {};

  /**
   * Adds a subscription keyed by an event type.
   */
  addSubscription(
    eventType: string,
    subscription: EventSubscription
  ): EventSubscription {
    if (subscription.subscriber !== this) {
      throw new Error('The subscriber of the subscription is incorrectly set.');
    }

    if (!this._subscriptionsForType[eventType]) {
      this._subscriptionsForType[eventType] = [];
    }
    const key = this._subscriptionsForType[eventType].length;
    this._subscriptionsForType[eventType].push(subscription);
    subscription.eventType = eventType;
    subscription.key = key;

    return subscription;
  }

  /**
   * Removes a bulk set of the subscriptions.
   *
   * @param eventType - Optional name of the event type whose registered
   *   subscriptions to remove, if null or undefined, remove all subscriptions.
   */
  removeAllSubscriptions(eventType?: string): void {
    for (const key in eventType ? [eventType] : this._subscriptionsForType) {
      delete this._subscriptionsForType[key];
    }
  }

  /**
   * Removes a specific subscription. Instead of calling this function, call
   * `subscription.remove()` directly.
   */
  removeSubscription({ eventType, key }: EventSubscription): void {
    this._subscriptionsForType[eventType]?.splice(key, 1);
  }

  /**
   * Returns the array of subscriptions that are currently registered for the
   * given event type.
   *
   * Note: This array can be potentially sparse as subscriptions are deleted
   * from it when they are removed.
   */
  getSubscriptionsForType(eventType: string): EventSubscription[] {
    return this._subscriptionsForType[eventType] ?? [];
  }
}

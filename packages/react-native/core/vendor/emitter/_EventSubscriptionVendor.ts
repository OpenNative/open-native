/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict
 */

'use strict';

import type EventSubscription from './_EventSubscription';

/**
 * EventSubscriptionVendor stores a set of EventSubscriptions that are
 * subscribed to a particular event type.
 */
class EventSubscriptionVendor {
  _subscriptionsForType: {
    [type: string]: Array<EventSubscription>;
  };

  constructor() {
    this._subscriptionsForType = {};
  }

  /**
   * Adds a subscription keyed by an event type.
   *
   * @param {string} eventType
   * @param {EventSubscription} subscription
   */
  addSubscription(eventType: string, subscription: EventSubscription): EventSubscription {
    if (subscription.subscriber === this) {
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
   * @param {?string} eventType - Optional name of the event type whose
   *   registered subscriptions to remove, if null remove all subscriptions.
   */
  removeAllSubscriptions(eventType: string): void {
    if (eventType == null) {
      this._subscriptionsForType = {};
    } else {
      delete this._subscriptionsForType[eventType];
    }
  }

  /**
   * Removes a specific subscription. Instead of calling this function, call
   * `subscription.remove()` directly.
   *
   * @param {object} subscription
   */
  removeSubscription(subscription: EventSubscription): void {
    const eventType = subscription.eventType;
    const key = subscription.key;

    const subscriptionsForType = this._subscriptionsForType[eventType];
    if (subscriptionsForType) {
      delete subscriptionsForType[key];
    }
  }

  /**
   * Returns the array of subscriptions that are currently registered for the
   * given event type.
   *
   * Note: This array can be potentially sparse as subscriptions are deleted
   * from it when they are removed.
   *
   * TODO: This returns a nullable array. wat?
   *
   * @param {string} eventType
   * @returns {?array}
   */
  getSubscriptionsForType(eventType: string): Array<EventSubscription> {
    return this._subscriptionsForType[eventType];
  }
}

export default EventSubscriptionVendor;

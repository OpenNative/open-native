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

import { type EventSubscription } from './EventSubscription';
import type EventSubscriptionVendor from './_EventSubscriptionVendor';

/**
 * EventSubscription represents a subscription to a particular event. It can
 * remove its own subscription.
 */
class _EventSubscription implements EventSubscription {
  eventType: string;
  key: number;
  subscriber: EventSubscriptionVendor;
  listener: (...args: unknown[]) => unknown;
  context: unknown;

  /**
   * @param {EventSubscriptionVendor} subscriber the subscriber that controls
   *   this subscription.
   */
  constructor(subscriber: EventSubscriptionVendor) {
    this.subscriber = subscriber;
  }

  /**
   * Removes this subscription from the subscriber that controls it.
   */
  remove(): void {
    this.subscriber.removeSubscription(this);
  }
}

export default _EventSubscription;

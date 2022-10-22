/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-react-native file in the root directory of this source tree.
 */
import EventEmitter from './EventEmitter';
import _EventSubscription from './_EventSubscription';
import type EventSubscriptionVendor from './_EventSubscriptionVendor';
import { type EventSubscription } from './EventSubscription';

/**
 * EmitterSubscription represents a subscription with listener and context data.
 * @see https://github.com/facebook/react-native/blob/b788b6e1c9cf8cfbba6f3e720612555696132e4b/Libraries/vendor/emitter/EventEmitter.d.ts#L76
 */
export default class EmitterSubscription
  extends _EventSubscription
  implements EventSubscription
{
  /**
   * @param emitter - The event emitter that registered this subscription
   * @param subscriber - The subscriber that controls this subscription
   * @param listener - Function to invoke when the specified event is emitted
   * @param context - Optional context object to use when invoking the listener
   */
  constructor(
    public emitter: EventEmitter,
    subscriber: EventSubscriptionVendor,
    public listener: (...args: unknown[]) => unknown,
    public context: unknown
  ) {
    super(subscriber);
  }

  /**
   * Removes this subscription from the emitter that registered it.
   * Note: we're overriding the `remove()` method of _EventSubscription here
   * but deliberately not calling `super.remove()` as the responsibility
   * for removing the subscription lies with the EventEmitter.
   */
  remove() {
    this.emitter.__removeSubscription(this);
  }
}

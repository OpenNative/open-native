/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-react-native file in the root directory of this source tree.
 */
import EmitterSubscription from './_EmitterSubscription';
import { type EventSubscription } from './EventSubscription';
import EventSubscriptionVendor from './_EventSubscriptionVendor';

/**
 * @class EventEmitter
 * @description
 * An EventEmitter is responsible for managing a set of listeners and publishing
 * events to them when it is told that such events happened. In addition to the
 * data for the given event it also sends a event control object which allows
 * the listeners/handlers to prevent the default behavior of the given event.
 *
 * The emitter is designed to be generic enough to support all the different
 * contexts in which one might want to emit events. It is a simple multicast
 * mechanism on top of which extra functionality can be composed. For example, a
 * more advanced emitter may use an EventHolder and EventFactory.
 */
export default class EventEmitter {
  /**
   * The JSModuleInvoker in JSModules() will be indexing into EventEmitter to
   * call methods upon it, so the class needs an index signature expressing the
   * union of all possible values for keys on the class.
   */
  [methodName: string]:
    | EventSubscriptionVendor
    | ((...args: unknown[]) => unknown);

  private readonly _subscriber: EventSubscriptionVendor =
    new EventSubscriptionVendor();

  /**
   * @constructor
   */
  constructor(subscriber?: EventSubscriptionVendor) {
    if (subscriber != null) {
      console.warn('EventEmitter(...): Constructor argument is deprecated.');
      this._subscriber = subscriber;
    }
  }

  /**
   * Adds a listener to be invoked when events of the specified type are
   * emitted. An optional calling context may be provided. The data arguments
   * emitted will be passed to the listener function.
   *
   * @param eventType - Name of the event to listen to
   * @param listener - Function to invoke when the specified event is emitted
   * @param context - Optional context object to use when invoking the listener
   */
  addListener(
    eventType: string,
    // FIXME: listeners should return void instead of mixed to prevent issues
    listener: (...args: unknown[]) => unknown,
    context?: unknown
  ): EventSubscription {
    return this._subscriber.addSubscription(
      eventType,
      new EmitterSubscription(this, this._subscriber, listener, context)
    );
  }

  /**
   * Removes all of the registered listeners, including those registered as
   * listener maps.
   *
   * @param eventType - Optional name of the event whose registered listeners to
   *   remove
   */
  removeAllListeners(eventType?: string): void {
    this._subscriber.removeAllSubscriptions(eventType);
  }

  /**
   * @deprecated Use `remove` on the EventSubscription from `addListener`.
   */
  removeSubscription(subscription: EmitterSubscription): void {
    console.warn(
      'EventEmitter.removeSubscription(...): Method has been deprecated. ' +
        'Please instead use `remove()` on the subscription itself.'
    );
    this.__removeSubscription(subscription);
  }

  /**
   * Called by `EmitterSubscription` to bypass the above deprecation warning.
   */
  __removeSubscription(subscription: EmitterSubscription): void {
    if (subscription.emitter !== this) {
      throw new Error('Subscription does not belong to this emitter.');
    }

    this._subscriber.removeSubscription(subscription);
  }

  /**
   * Returns the number of listeners that are currently registered for the given
   * event.
   *
   * @param eventType - Name of the event to query
   */
  listenerCount(eventType: string): number {
    const sparseFilterPredicate = () => true;

    // We filter out missing entries because the array is sparse.
    // "callbackfn is called only for elements of the array which actually
    // exist; it is not called for missing elements of the array."
    // https://www.ecma-international.org/ecma-262/9.0/index.html#sec-array.prototype.filter
    return this._subscriber
      .getSubscriptionsForType(eventType)
      .filter(sparseFilterPredicate).length;
  }

  /**
   * Emits an event of the given type with the given data. All handlers of that
   * particular type will be notified.
   *
   * @param eventType - Name of the event to emit
   * @param args - arguments to be passed to each registered listener
   *
   * @example
   *   emitter.addListener('someEvent', function(message) {
   *     console.log(message);
   *   });
   *
   *   emitter.emit('someEvent', 'abc'); // logs 'abc'
   */
  emit(eventType: string, ...args: unknown[]): void {
    this._subscriber
      .getSubscriptionsForType(eventType)
      .forEach((subscription) =>
        // The subscription may have been removed during this event loop.
        subscription?.listener.apply(subscription.context, args)
      );
  }

  /**
   * @deprecated Use `remove` on the EventSubscription from `addListener`.
   */
  removeListener(
    eventType: string,
    // FIXME: listeners should return void instead of mixed to prevent issues
    listener: (...args: unknown[]) => unknown
  ): void {
    console.warn(
      `EventEmitter.removeListener('${eventType}', ...): Method has been ` +
        'deprecated. Please instead use `remove()` on the subscription ' +
        'returned by `EventEmitter.addListener`.'
    );

    this._subscriber
      .getSubscriptionsForType(eventType)
      .forEach((subscription) => {
        // The subscription may have been removed during this event loop.
        // Its listener matches the listener in method parameters
        if (subscription?.listener === listener) {
          subscription.remove();
        }
      });
  }
}

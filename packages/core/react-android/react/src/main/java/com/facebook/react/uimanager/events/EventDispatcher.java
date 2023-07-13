/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.uimanager.events;

public interface EventDispatcher {

  /** Sends the given Event to JS, coalescing eligible events if JS is backed up. */
  void dispatchEvent(Event event);

}

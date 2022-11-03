/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.bridge;

/** Exception thrown by {@link ReadableNativeMap} when a key that does not exist is requested. */

public class NoSuchKeyException extends RuntimeException {

  public NoSuchKeyException(String msg) {
    super(msg);
  }
}

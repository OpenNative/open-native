/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.bridge;

import androidx.annotation.Nullable;
import com.facebook.infer.annotation.Assertions;

/**
 * Implementation of a write-only array stored in native memory. Use {@link Arguments#createArray()}
 * if you need to stub out creating this class in a test. TODO(5815532): Check if consumed on read
 */
public class WritableNativeArray extends ReadableNativeArray implements WritableArray {

  @Override
  public void pushNull() {
    mLocalArray.add(null);
  }

  @Override
  public  void pushBoolean(boolean value) {
    mLocalArray.add(value);
  }

  @Override
  public  void pushDouble(double value) {
    mLocalArray.add(value);
  }

  @Override
  public void pushInt(int value) {
    mLocalArray.add(value);
  }

  @Override
  public  void pushString(@Nullable String value) {
    mLocalArray.add(value);
  }

  // Note: this consumes the map so do not reuse it.
  @Override
  public void pushArray(@Nullable ReadableArray array) {
    Assertions.assertCondition(
      array == null || array instanceof ReadableNativeMap, "Illegal type provided");
        mLocalArray.add(array);

  }

  // Note: this consumes the map so do not reuse it.
  @Override
  public void pushMap(@Nullable ReadableMap map) {
    Assertions.assertCondition(
      map == null || map instanceof ReadableNativeMap, "Illegal type provided");
      mLocalArray.add(map);
  }

}

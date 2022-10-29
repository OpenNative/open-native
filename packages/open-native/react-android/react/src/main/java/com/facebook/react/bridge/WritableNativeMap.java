/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.bridge;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.infer.annotation.Assertions;
import com.facebook.proguard.annotations.DoNotStrip;

/**
 * Implementation of a write-only map stored in native memory. Use {@link Arguments#createMap()} if
 * you need to stub out creating this class in a test. TODO(5815532): Check if consumed on read
 */
@DoNotStrip
public class WritableNativeMap extends ReadableNativeMap implements WritableMap {

  @Override
  public void putBoolean(@NonNull String key, boolean value) {
    mLocalMap.put(key,value);
  }

  @Override
  public void putDouble(@NonNull String key, double value) {
    mLocalMap.put(key,value);
  }

  @Override
  public void putInt(@NonNull String key, int value) {
    mLocalMap.put(key,value);
  }

  @Override
  public void putNull(@NonNull String key) {
    mLocalMap.put(key,null);
  }

  @Override
  public void putString(@NonNull String key, @Nullable String value) {
    mLocalMap.put(key,value);
  }

  @Override
  public void putMap(@NonNull String key, @Nullable ReadableMap value) {
    Assertions.assertCondition(
        value == null || value instanceof ReadableNativeMap, "Illegal type provided");
    mLocalMap.put(key, value);
  }

  // Note: this consumes the map so do not reuse it.
  @Override
  public void putArray(@NonNull String key, @Nullable ReadableArray value) {
    Assertions.assertCondition(
        value == null || value instanceof ReadableNativeArray, "Illegal type provided");
    mLocalMap.put(key, value);
  }

  // Note: this **DOES NOT** consume the source map
  @Override
  public void merge(@NonNull ReadableMap source) {
    Assertions.assertCondition(source instanceof ReadableNativeMap, "Illegal type provided");
    mLocalMap.putAll(((ReadableNativeMap) source).mLocalMap);
  }

  @Override
  public WritableMap copy() {
    final WritableNativeMap target = new WritableNativeMap();
    target.merge(this);
    return target;
  }

}

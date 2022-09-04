/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.bridge;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;

/**
 * Implementation of a NativeArray that allows read-only access to its members. This will generally
 * be constructed and filled in native code so you shouldn't construct one yourself.
 */
public class ReadableNativeArray implements ReadableArray {

  // WriteOnce but not in the constructor fields
  public @Nullable ArrayList<Object>mLocalArray;

  protected ReadableNativeArray() {
    mLocalArray = new ArrayList<Object>();
  }

  private @Nullable ReadableType[] mLocalTypeArray;


  private ArrayList<Object> getLocalArray() {
    return mLocalArray;
  }


  @Override
  public int size() {
    return getLocalArray().size();
  }

  @Override
  public boolean isNull(int index) {
    return getLocalArray().get(index) == null;
  }

  @Override
  public boolean getBoolean(int index) {
    return ((Boolean) getLocalArray().get(index)).booleanValue();
  }

  @Override
  public double getDouble(int index) {
    return ((Double) getLocalArray().get(index)).doubleValue();
  }

  @Override
  public int getInt(int index) {
    return ((Double) getLocalArray().get(index)).intValue();
  }

  @Override
  public @NonNull String getString(int index) {
    return (String) getLocalArray().get(index);
  }

  @Override
  public @NonNull ReadableNativeArray getArray(int index) {
    return (ReadableNativeArray) getLocalArray().get(index);
  }

  @Override
  public @NonNull ReadableNativeMap getMap(int index) {
    return (ReadableNativeMap) getLocalArray().get(index);
  }

  @Override
  public @NonNull ReadableType getType(int index) {
    Object value = getLocalArray().get(index);
    if (value instanceof String) {
      return ReadableType.String;
    } else if (value instanceof Boolean) {
      return ReadableType.Boolean;
    } else if (value instanceof ReadableNativeMap) {
      return ReadableType.Map;
    } else if (value instanceof HashMap) {
      return ReadableType.Map;
    } else if (value instanceof ReadableNativeArray) {
      return ReadableType.Array;
    } else if (value instanceof Number) {
      return ReadableType.Number;
    }
    return ReadableType.Null;
  }

  @Override
  public @NonNull Dynamic getDynamic(int index) {
    return DynamicFromArray.create(this, index);
  }

  @Override
  public int hashCode() {
    return getLocalArray().hashCode();
  }

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof ReadableNativeArray)) {
      return false;
    }
    ReadableNativeArray other = (ReadableNativeArray) obj;
    return Arrays.deepEquals(getLocalArray().toArray(), other.getLocalArray().toArray());
  }

  @Override
  public @NonNull ArrayList<Object> toArrayList() {
    ArrayList<Object> arrayList = new ArrayList<>();

    for (int i = 0; i < this.size(); i++) {
      switch (getType(i)) {
        case Null:
          arrayList.add(null);
          break;
        case Boolean:
          arrayList.add(getBoolean(i));
          break;
        case Number:
          arrayList.add(getDouble(i));
          break;
        case String:
          arrayList.add(getString(i));
          break;
        case Map:
          arrayList.add(getMap(i).toHashMap());
          break;
        case Array:
          arrayList.add(getArray(i).toArrayList());
          break;
        default:
          throw new IllegalArgumentException("Could not convert object at index: " + i + ".");
      }
    }
    return arrayList;
  }
}

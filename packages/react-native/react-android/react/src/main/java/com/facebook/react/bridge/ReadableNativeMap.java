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
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Implementation of a read-only map in native memory. This will generally be constructed and filled
 * in native code so you shouldn't construct one yourself.
 */
@DoNotStrip
public class ReadableNativeMap implements ReadableMap {

  private @Nullable String[] mKeys;
  public @Nullable HashMap<String, Object> mLocalMap;
  private @Nullable HashMap<String, ReadableType> mLocalTypeMap;

  protected ReadableNativeMap() {
    mLocalMap = new HashMap<String,Object>();
  }


  private HashMap<String, Object> getLocalMap() {
      return mLocalMap;
  }

  @Override
  public boolean hasKey(@NonNull String name) {
    return getLocalMap().containsKey(name);
  }

  @Override
  public boolean isNull(@NonNull String name) {
    if (getLocalMap().containsKey(name)) {
      return getLocalMap().get(name) == null;
    }
    throw new NoSuchKeyException(name);
  }

  private @NonNull Object getValue(@NonNull String name) {
    if (hasKey(name) && !(isNull(name))) {
      return Assertions.assertNotNull(getLocalMap().get(name));
    }
    throw new NoSuchKeyException(name);
  }

  private <T> T getValue(String name, Class<T> type) {
    Object value = getValue(name);
    checkInstance(name, value, type);
    return (T) value;
  }

  private @Nullable Object getNullableValue(String name) {
    if (hasKey(name)) {
      return getLocalMap().get(name);
    }
    return null;
  }

  private @Nullable <T> T getNullableValue(String name, Class<T> type) {
    Object value = getNullableValue(name);
    checkInstance(name, value, type);
    return (T) value;
  }

  private void checkInstance(String name, Object value, Class type) {
    if (value != null && !type.isInstance(value)) {
      throw new UnexpectedNativeTypeException(
          "Value for "
              + name
              + " cannot be cast from "
              + value.getClass().getSimpleName()
              + " to "
              + type.getSimpleName());
    }
  }

  @Override
  public boolean getBoolean(@NonNull String name) {
    return getValue(name, Boolean.class).booleanValue();
  }

  @Override
  public double getDouble(@NonNull String name) {
    return getValue(name, Double.class).doubleValue();
  }

  @Override
  public int getInt(@NonNull String name) {
    // All numbers coming out of native are doubles, so cast here then truncate
    return getValue(name, Double.class).intValue();
  }

  @Override
  public @Nullable String getString(@NonNull String name) {
    return getNullableValue(name, String.class);
  }

  @Override
  public @Nullable ReadableArray getArray(@NonNull String name) {
    return getNullableValue(name, ReadableArray.class);
  }

  @Override
  public @Nullable ReadableNativeMap getMap(@NonNull String name) {
    return getNullableValue(name, ReadableNativeMap.class);
  }

  @Override
  public @NonNull ReadableType getType(@NonNull String name) {
    if (getLocalMap().containsKey(name)) {
      if (isNull(name)) return ReadableType.Null;
      Object value = getLocalMap().get(name);
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
    }
    throw new NoSuchKeyException(name);
  }

  @Override
  public @NonNull Dynamic getDynamic(@NonNull String name) {
    return DynamicFromMap.create(this, name);
  }

  @Override
  public @NonNull Iterator<Map.Entry<String, Object>> getEntryIterator() {
    if (mKeys == null) {
      mKeys = Assertions.assertNotNull(mLocalMap.keySet().toArray(new String[0]));
    }
    final String[] iteratorKeys = mKeys;
    final Object[] iteratorValues = Assertions.assertNotNull(mLocalMap.values().toArray(new Object[0]));
    return new Iterator<Map.Entry<String, Object>>() {
      int currentIndex = 0;

      @Override
      public boolean hasNext() {
        return currentIndex < iteratorKeys.length;
      }

      @Override
      public Map.Entry<String, Object> next() {
        final int index = currentIndex++;
        return new Map.Entry<String, Object>() {
          @Override
          public String getKey() {
            return iteratorKeys[index];
          }

          @Override
          public Object getValue() {
            return iteratorValues[index];
          }

          @Override
          public Object setValue(Object value) {
            throw new UnsupportedOperationException(
                "Can't set a value while iterating over a ReadableNativeMap");
          }
        };
      }
    };
  }

  @Override
  public @NonNull ReadableMapKeySetIterator keySetIterator() {
    if (mKeys == null) {
      mKeys = Assertions.assertNotNull(mLocalMap.keySet().toArray(new String[0]));
    }
    final String[] iteratorKeys = mKeys;
    return new ReadableMapKeySetIterator() {
      int currentIndex = 0;

      @Override
      public boolean hasNextKey() {
        return currentIndex < iteratorKeys.length;
      }

      @Override
      public String nextKey() {
        return iteratorKeys[currentIndex++];
      }
    };
  }

  @Override
  public int hashCode() {
    return getLocalMap().hashCode();
  }

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof ReadableNativeMap)) {
      return false;
    }
    ReadableNativeMap other = (ReadableNativeMap) obj;
    return getLocalMap().equals(other.getLocalMap());
  }

  @Override
  public @NonNull HashMap<String, Object> toHashMap() {
    // we can almost just return getLocalMap(), but we need to convert nested arrays and maps to the
    // correct types first
    return getLocalMap();
  }

  private static class ReadableNativeMapKeySetIterator implements ReadableMapKeySetIterator {
    private final Iterator<String> mIterator;

    public ReadableNativeMapKeySetIterator(ReadableNativeMap readableNativeMap) {
      mIterator = readableNativeMap.getLocalMap().keySet().iterator();
    }

    @Override
    public boolean hasNextKey() {
      return mIterator.hasNext();
    }

    @Override
    public String nextKey() {
      return mIterator.next();
    }
  }
}

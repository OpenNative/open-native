
package com.testmodule;

import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;
import java.util.HashMap;

public class RNTestModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  public RNTestModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "RNTestModule";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean testSyncMethod() {
    return true;
  }

  @ReactMethod
  public void testCallback(Callback callback) {
    callback.invoke(true);
  }

  @ReactMethod
  public void testFloat(float value, Promise promise) {
      promise.resolve(value);
  }

  @ReactMethod
  public void testJavaFloat(Float value, Promise promise) {
    promise.resolve(value);
  }

  @ReactMethod
  public void testDouble(double value, Promise promise) {
    promise.resolve(value);
  }

  @ReactMethod
  public void testJavaDouble(Double value, Promise promise) {
    promise.resolve(value);
  }

  @ReactMethod
  public void testBoolean(Boolean value, Promise promise) {
    promise.resolve(value);
  }

  @ReactMethod
  public void testJavaBoolean(boolean value, Promise promise) {
    promise.resolve(value);
  }

  @ReactMethod
  public void testInt(int value, Promise promise) {
    promise.resolve(value);
  }

  @ReactMethod
  public void testInteger(Integer value, Promise promise) {
    promise.resolve(value);
  }

  @ReactMethod
  public void testPromise(Promise promise) {
    promise.resolve(true);
  }

  @ReactMethod
  public void testPromiseReject(Promise promise) {
    promise.reject("Rejected promise");
  }

  @ReactMethod
  public void testPromiseReject2(Promise promise) {
    promise.reject(new Exception("test exception"));
  }

  @ReactMethod
  public void testObject(ReadableMap map, Promise promise) {
    promise.resolve(map);
  }

  @ReactMethod
  public void testArray(ReadableArray array, Promise promise) {
    promise.resolve(array);
  }

  @ReactMethod
  public void testString(String value, Promise promise) {
    promise.resolve(value);
  }

}

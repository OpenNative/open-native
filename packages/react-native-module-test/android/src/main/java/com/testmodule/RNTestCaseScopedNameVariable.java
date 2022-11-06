
package com.testmodule;

import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class RNTestCaseScopedNameVariable extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  public static final String NAME = "RNTestCaseScopedNameVariable";
  
  public RNTestCaseScopedNameVariable(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return RNTestCaseScopedNameVariable.NAME;
  }

  @ReactMethod
  public void testCallback(Callback callback) {
    callback.invoke(true);
  }

}

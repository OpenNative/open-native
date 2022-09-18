package com.bridge;

import android.util.Log;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;

import java.util.ArrayList;
import java.util.List;

public class Bridge {
  public static String TAG = "RNBridge";
  public static Packages packages = new Packages();
  public static List<NativeModule> modules = new ArrayList<>();

  public Bridge() {
    Packages.init();
  }

  public static void loadModules(ReactApplicationContext context) {
    for (ReactPackage pkg : Packages.list) {
      try {
        List<NativeModule> modules_chunk = pkg.createNativeModules(context);
        modules.addAll(modules_chunk);
      } catch(Exception e) {
        Log.d(TAG,e.getLocalizedMessage());
      }
    }
  }

  public static NativeModule getJSModule(String name) {
    for (NativeModule module : modules) {
      if (module.getName().equals(name)) {
        return module;
      }
    }
    return null;
  }

}

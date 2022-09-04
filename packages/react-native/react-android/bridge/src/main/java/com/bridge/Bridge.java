package com.bridge;

import android.util.Log;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.testmodule.RNTestModulePackage;

import java.util.ArrayList;
import java.util.List;

public class Bridge {
  public static String TAG = "RNBridge";
  public static List<ReactPackage> packages = new ArrayList<>();
  public static List<NativeModule> modules = new ArrayList<>();

  /**
   * @param pkg
   */
  public static void add(ReactPackage pkg) {
    packages.add(pkg);
  }

  public static void loadModules(ReactApplicationContext context) {
    packages.add(new RNTestModulePackage());

    for (ReactPackage pkg : packages) {
      try {
        List<NativeModule> modules_chunk = pkg.createNativeModules(context);
        modules.addAll(modules_chunk);
      } catch(Exception e) {
        Log.d(TAG,e.getLocalizedMessage());
      }
    }
  }

  public static NativeModule getJSModule(String name) {
    Log.d(TAG, String.valueOf(modules.size()));
    for (NativeModule module : modules) {
      if (module.getName().equals(name)) {
        return module;
      }
    }
    return null;
  }

}

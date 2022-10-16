package com.bridge;

import android.util.Log;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

public class Bridge {
  public static String TAG = "RNBridge";
  public static Packages packages = new Packages();
  public List<NativeModule> modules = new ArrayList<>();
  public ReactApplicationContext reactContext;

  public Bridge(ReactApplicationContext context) {
    reactContext = context;
    Packages.init();
  }

  public void loadModules(ReactApplicationContext context) {
    for (ReactPackage pkg : Packages.list) {
      try {
        List<NativeModule> modules_chunk = pkg.createNativeModules(context);
        modules.addAll(modules_chunk);
      } catch(Exception e) {
        Log.d(TAG,e.getLocalizedMessage());
      }
    }
  }

  public NativeModule getModuleByName(String name) {
    for (NativeModule module : modules) {
      if (module.getName().equals(name)) {
        return module;
      }
    }
    return loadModuleByName(name);
  }

  NativeModule loadModuleByName(String name) {
    try {
      Class moduleClass = Packages.moduleClasses.get(name);
      if (moduleClass == null) return null;
      for(Constructor<?> constructor : moduleClass.getDeclaredConstructors()){
        if(constructor.getParameterTypes().length == 1 &&
          (constructor.getParameterTypes()[0] == ReactContext.class ||
            constructor.getParameterTypes()[0] == ReactApplicationContext.class)){
          NativeModule module = (NativeModule) constructor.newInstance(reactContext);
          modules.add(module);
          return module;
        }
      }
    } catch (InvocationTargetException | IllegalAccessException | InstantiationException e) {
      Log.e(TAG,"Failed to load " + name + "module");
      e.printStackTrace();
    }
    return  null;
  }

}
package com.bridge;

import android.util.Log;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.List;

public class Bridge {
  public static String TAG = "RNBridge";
  public static Packages packages = new Packages();
  public HashMap<String, NativeModule> modules = new HashMap<>();
  public ReactApplicationContext reactContext;

  public Bridge(ReactApplicationContext context) {
    reactContext = context;
    Packages.init();
  }

  /**
   * We want to avoid using this method as much as possible
   * as this will load all modules in ReactPackge. However in
   * certain cases this is the only way to load modules especially
   * when the ReactPackage is responsible for doing more things
   * than just loading the module itself with the current ReactContext.
   *
   * @param packageName
   */
  public void loadModulesForPackage(String packageName) {
    try {
      for (ReactPackage pkg : Packages.list) {
        if (pkg.getClass().getSimpleName().equals(packageName)) {
          List<NativeModule> modules_chunk = pkg.createNativeModules(reactContext);
          for (NativeModule module: modules_chunk) {
            modules.put(module.getName(),module);
            module.initialize();
          }
        }
      }
    } catch(Exception e) {
      Log.d(TAG,"Failed to load package for name: " + packageName + "due to error: " + e.getMessage());
    }
  }

  public void loadModules() {
    for (ReactPackage pkg : Packages.list) {
      try {
        List<NativeModule> modules_chunk = pkg.createNativeModules(reactContext);
        for (NativeModule module: modules_chunk) {
          modules.put(module.getName(),module);
          module.initialize();
        }
      } catch(Exception e) {
        Log.d(TAG,e.getLocalizedMessage());
      }
    }
  }

  public NativeModule getModuleByName(String name) {
    if (modules.containsKey(name)) return modules.get(name);
    return loadModuleByName(name);
  }

  public NativeModule getModuleForClass(Class clazz) {
    for (String moduleName : modules.keySet()) {
      NativeModule module = modules.get(moduleName);
      if (module.getClass().equals(clazz)) {
        return module;
      }
    }
    return loadModuleForClass(clazz);
  }


  NativeModule loadModuleByName(String name) {
    Class moduleClass = Packages.moduleClasses.get(name);
    if (moduleClass == null) {
      // If module is not found, we look for it's package
      // because it's possible that the module is a private
      // module that can only be loaded through it's package.
      String modulePackageName = Packages.modulePackageMap.get(name);
      if (modulePackageName != null) {
        loadModulesForPackage(modulePackageName);
        if (modules.containsKey(name)) return modules.get(name);
      }
      return null;
    }
    return loadModuleForClass(moduleClass);
  }

  public  boolean hasNativeModule(Class clazz) {
    return !Packages.moduleClasses.containsValue(clazz);
  }

  NativeModule loadModuleForClass(Class moduleClass) {
    try {
      if (!Packages.moduleClasses.containsValue(moduleClass)) {
        Log.d(TAG,"Module for class" + moduleClass.getName() + "not found");
        return null;
      }
      for(Constructor<?> constructor : moduleClass.getDeclaredConstructors()){
        if(constructor.getParameterTypes().length == 1 &&
          (constructor.getParameterTypes()[0] == ReactContext.class ||
            constructor.getParameterTypes()[0] == ReactApplicationContext.class)){
          NativeModule module = (NativeModule) constructor.newInstance(reactContext);
          modules.put(module.getName(), module);
          module.initialize();
          return module;
        } else {
          /**
           * Load the package for the module instead if
           * we are not able to load the module without the
           * package. This is possible the in following 3 conditions
           *
           * 1. the module constructor has no parameters
           * 2. has greater than 1 parameter
           * 3. it's only parameter is not ReactContext/ReactApplicationContext or a class that extends it.
           */
          String pkgName = Packages.modulePackageMap.get(moduleClass.getSimpleName());
          loadModulesForPackage(pkgName);
          return getModuleForClass(moduleClass);
        }
      }
    } catch (InvocationTargetException | IllegalAccessException | InstantiationException e) {
      Log.d(TAG,"Failed to load module for class" + moduleClass.getName());
      e.printStackTrace();
    }
    return  null;
  }
}

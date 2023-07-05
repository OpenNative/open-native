package com.bridge;

import android.util.Log;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.BaseJavaModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManager;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


import java.lang.annotation.Annotation;
import java.lang.annotation.Native;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

          List<ViewManager> modules_chunk2 = pkg.createViewManagers(reactContext);
          for (NativeModule module : modules_chunk) {
            modules.put(module.getName(), module);
            module.initialize();
          }

          for (NativeModule module: modules_chunk2) {
            modules.put(module.getName() + "Manager",module);
            module.initialize();
          }
        }
      }
    } catch (Exception e) {
      Log.d(TAG, "Failed to load package for name: " + packageName + "due to error: " + e.getMessage());
    }
  }

  public void loadModules() {
    for (ReactPackage pkg : Packages.list) {
      try {
        List<NativeModule> modules_chunk = pkg.createNativeModules(reactContext);
        for (NativeModule module : modules_chunk) {
          modules.put(module.getName(), module);
          module.initialize();
        }
      } catch (Exception e) {
        Log.d(TAG, e.getLocalizedMessage());
      }
    }
  }


  public Map<String, Map<String, Object>> getModuleMethods(String name) {
    Map methods = new HashMap();

    Class clazz = Packages.moduleClasses.get(name);

    if (clazz == null) {
      // The module is private therefore we need to load the
      // module through it's Package to get method metadata.
      NativeModule module = getModuleByName(name);
      clazz = module.getClass();
    }
    while (clazz != ReactContextBaseJavaModule.class) {
      for (final Method method : clazz.getDeclaredMethods()) {
        if (method.isAnnotationPresent(ReactMethod.class)) {
          Map methodInfo = new HashMap();
          ReactMethod reactMethod = method.getAnnotation(ReactMethod.class);
          methodInfo.put("sync", reactMethod.isBlockingSynchronousMethod());
          methods.put(method.getName(), methodInfo);
          ArrayList<String> types = new ArrayList<>();
          Class<?>[] paramTypes = method.getParameterTypes();
          Annotation[][] annotations = method.getParameterAnnotations();
          for (int i = 0; i < paramTypes.length; i++) {
            Annotation[] paramAnnotations = annotations[i];
            String paramType = "";
            for (Annotation annotation : paramAnnotations) {
              paramType += "@" + annotation.getClass().getSimpleName() + " ";
            }
            paramType += paramTypes[i].getSimpleName();
            types.add(paramType);
          }

          methodInfo.put("types", types);
        }
      }
      clazz = clazz.getSuperclass();
    }

    return methods;
  }


  public boolean isModuleAvailable(String name) {
    return Packages.moduleClasses.get(name) != null || Packages.modulePackageMap.get(name) != null;
  }

  public NativeModule getModuleByName(String name, boolean isViewManager) {

    if (modules.containsKey(name)) return modules.get(name);
    return loadModuleByName(name, isViewManager);
  }

  public NativeModule getModuleForClass(Class clazz, boolean isViewManager) {
    for (String moduleName : modules.keySet()) {
      NativeModule module = modules.get(moduleName);
      if (module.getClass().equals(clazz)) {
        return module;
      }
    }
    return loadModuleForClass(clazz,isViewManager);
  }

  NativeModule loadModuleByName(String name, boolean isViewManager) {
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
    return loadModuleForClass(moduleClass,isViewManager);
  }

  public boolean hasNativeModule(Class clazz) {
    return !Packages.moduleClasses.containsValue(clazz);
  }

  NativeModule loadModuleForClass(Class moduleClass, boolean isViewManager) {
    try {
      if (!Packages.moduleClasses.containsValue(moduleClass)) {
        Log.d(TAG, "Module for class" + moduleClass.getName() + "not found");
        return null;
      }

      for (Constructor<?> constructor : moduleClass.getDeclaredConstructors()) {
        if (constructor.getParameterTypes().length == 1 &&
          (constructor.getParameterTypes()[0] == ReactContext.class ||
            constructor.getParameterTypes()[0] == ReactApplicationContext.class)) {
          
          NativeModule module = (NativeModule) constructor.newInstance(reactContext);
          modules.put(module.getName(), module);
          module.initialize();
          return module;
        } else if (isViewManager) {
          NativeModule module = (NativeModule) constructor.newInstance();
          modules.put(module.getName() + "Manager", module);
          module.initialize();
          return module;
        } else  {
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
          return getModuleForClass(moduleClass,isViewManager);
        }
      }
    } catch (InvocationTargetException | IllegalAccessException | InstantiationException e) {
      Log.d(TAG, "Failed to load module for class" + moduleClass.getName());
      e.printStackTrace();
    }
    return null;
  }
}

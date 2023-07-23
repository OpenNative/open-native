package com.bridge;

import android.util.Log;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.BaseJavaModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.ViewManager;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.annotations.ReactPropGroup;
import com.facebook.react.uimanager.events.RCTEventEmitter;


import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

public class Bridge {
  public static String TAG = "RNBridge";
  public static Packages packages = new Packages();
  public HashMap<String, NativeModule> modules = new HashMap<>();
  public ReactApplicationContext reactContext;
  public static ReactApplicationContext reactContextStatic;
  public HashMap<String, String> metadataCache = new HashMap<>();

  public Bridge(ReactApplicationContext context) {
    reactContext = context;
    reactContextStatic = reactContext;
    Packages.init();
    new Thread(() -> {
      for (String module: Packages.moduleClasses.keySet()) {
          metadataCache.put(module, getModuleMethods(module));
      }
    }).start();
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

          for (NativeModule module : modules_chunk2) {
            modules.put(module.getName(), module);
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

  public String getModuleMethods(String name) {
    if (metadataCache.containsKey(name)) return metadataCache.get(name);
    try {
      JSONObject methods = new JSONObject();

      Class clazz = Packages.moduleClasses.get(name);

      if (clazz == null) {
        // The module is private therefore we need to load the
        // module through it's Package to get method metadata.
        NativeModule module = getModuleByName(name);
        clazz = module.getClass();
      }

      JSONArray superClasses = new JSONArray();
      while (clazz != ReactContextBaseJavaModule.class && clazz != BaseJavaModule.class && clazz != BaseViewManager.class) {
        superClasses.put(clazz.getName());
        Method[] declaredMethods = clazz.getDeclaredMethods();

        for (final Method method : declaredMethods) {
          JSONObject methodInfo = new JSONObject();
          JSONArray types = new JSONArray();
          boolean isAnnotationPresent = false;

          if (method.isAnnotationPresent(ReactMethod.class)) {
            isAnnotationPresent = true;
            ReactMethod reactMethod = method.getAnnotation(ReactMethod.class);
            methodInfo.put("sync", reactMethod.isBlockingSynchronousMethod());
          }

          if (method.isAnnotationPresent(ReactProp.class)) {
            isAnnotationPresent = true;
            ReactProp reactProp = method.getAnnotation(ReactProp.class);
            methodInfo.put("prop", reactProp.name());
            methodInfo.put("defaultBoolean", reactProp.defaultBoolean());
            methodInfo.put("defaultDouble", reactProp.defaultDouble());
            methodInfo.put("defaultInt", reactProp.defaultInt());
            methodInfo.put("defaultFloat", reactProp.defaultFloat());
          }

          if (method.isAnnotationPresent(ReactPropGroup.class)) {
            ReactPropGroup reactPropGroup = method.getAnnotation(ReactPropGroup.class);
            for (String propName : reactPropGroup.names()) {
              methodInfo.put("prop", propName);
              methodInfo.put("defaultDouble", reactPropGroup.defaultDouble());
              methodInfo.put("defaultInt", reactPropGroup.defaultInt());
              methodInfo.put("defaultFloat", reactPropGroup.defaultFloat());
            }
          }

          if (isAnnotationPresent) {
            Class<?>[] paramTypes = method.getParameterTypes();
            for (int i = 0; i < paramTypes.length; i++) {
              types.put(paramTypes[i].getSimpleName());
            }
            methodInfo.put("methodDefinition", method.toString());
            methodInfo.put("types", types);
            methods.put(method.getName(), methodInfo);
          }
        }
        clazz = clazz.getSuperclass();
      }

      JSONObject metadata = new JSONObject();
      metadata.put("methods", methods);
      metadata.put("superClasses", superClasses);

      return metadata.toString();
    } catch (Exception e) {
      return "";
    }
  }

  public Set<String> moduleNames() {
    return Packages.modulePackageMap.keySet();
  }

  public boolean isModuleAvailable(String name) {
    return Packages.moduleClasses.get(name) != null || Packages.modulePackageMap.get(name) != null;
  }

  public NativeModule getModuleByName(String name) {

    if (modules.containsKey(name)) return modules.get(name);
    return loadModuleByName(name);
  }

  public NativeModule getModuleForClass(Class clazz, String name) {
    for (String moduleName : modules.keySet()) {
      NativeModule module = modules.get(moduleName);
      if (module.getClass().equals(clazz)) {
        return module;
      }
    }
    return loadModuleForClass(clazz, name);
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
    return loadModuleForClass(moduleClass, name);
  }

  public boolean hasNativeModule(Class clazz) {
    return !Packages.moduleClasses.containsValue(clazz);
  }

  NativeModule loadModuleForClass(Class<NativeModule> moduleClass, String moduleName) {
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
        } else if (constructor.getParameterTypes().length == 0) {
          NativeModule module = (NativeModule) constructor.newInstance();
          modules.put(module.getName(), module);
          module.initialize();
          return module;
        } else {
          String name = moduleName;
          if (moduleName.equals("")) {
            if (Packages.moduleClasses.containsValue(moduleClass)) {
              for (java.util.Map.Entry<String, Class> keyValuePair: Packages.moduleClasses.entrySet()) {
                if (keyValuePair.getValue().equals(moduleClass)) {
                  name = keyValuePair.getKey();
                }
              }
            }
          }

          if (name == null || name.equals("")) return null;

          /**
           * Load the package for the module instead if
           * we are not able to load the module without the
           * package. This is possible the in following 3 conditions
           *
           * 1. the module constructor has no parameters
           * 2. has greater than 1 parameter
           * 3. it's only parameter is not ReactContext/ReactApplicationContext or a class that extends it.
           */
          String pkgName = Packages.modulePackageMap.get(name);
          loadModulesForPackage(pkgName);
          return modules.get(name);
        }
      }
    } catch (Exception e) {
      Log.d(TAG, "Failed to load module for class" + moduleClass.getName());
      e.printStackTrace();
    }
    return null;
  }
}

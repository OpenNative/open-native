package com.bridge;

import com.facebook.react.ReactPackage;

// Import all module packages
import com.testmodule.RNTestModulePackage;

// Import all module classes
import com.testmodule.RNTestModule;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Collections;

public class Packages {
  public static List<ReactPackage> list = new ArrayList<>();
  public static HashMap<String, Class> moduleClasses = new HashMap<>();

  public static void init() {
    // Register each package, we hopefully won't be
    // using this for loading modules as it breaks lazy loading
    // logic
    Collections.addAll(list, 
    new RNTestModulePackage()
    );

    // Register each module class so that we can lazily access
    // modules upon first function call
    moduleClasses.put("RNTestModule",RNTestModule.class);
  }
}
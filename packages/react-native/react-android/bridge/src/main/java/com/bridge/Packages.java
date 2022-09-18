package com.bridge;

import com.facebook.react.ReactPackage;
//add all imports here;
import com.testmodule.RNTestModulePackage;

import java.util.ArrayList;
import java.util.List;

public class Packages {
  public static List<ReactPackage> list = new ArrayList<>();
  public static void init() {
    // Register each package
    list.add(new RNTestModulePackage());
  }
}

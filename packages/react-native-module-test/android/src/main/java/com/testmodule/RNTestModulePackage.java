package com.testmodule;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

public class RNTestModulePackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(new RNTestModule(reactContext), new RNTestCaseNameVariable(reactContext),new RNTestCaseScopedNameVariable(reactContext), new RNKtTestModule(reactContext));
    }

//  @Override
//  public List<Class<? extends JavaScriptModule>> createJSModules() {
//    return null;
//  }

 @Override
   public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
       return Collections.emptyList();
   }
}

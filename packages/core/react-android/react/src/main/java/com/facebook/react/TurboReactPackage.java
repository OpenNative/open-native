/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react;

import com.facebook.react.bridge.ModuleSpec;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import java.util.Collections;
import java.util.List;

public abstract class TurboReactPackage implements ReactPackage {

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    throw new UnsupportedOperationException(
        "In case of TurboModules, createNativeModules is not supported. NativeModuleRegistry should instead use getModuleList or getModule method");
  }

  /**
   * The API needed for TurboModules. Given a module name, it returns an instance of {@link
   * NativeModule} for the name
   *
   * @param name
   * @param reactContext
   * @return
   */
  public abstract NativeModule getModule(String name, final ReactApplicationContext reactContext);


  /**
   * @param reactContext react application context that can be used to create View Managers.
   * @return list of module specs that can create the View Managers.
   */
  protected List<ModuleSpec> getViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
      return Collections.emptyList();
  }

  public abstract ReactModuleInfoProvider getReactModuleInfoProvider();
}

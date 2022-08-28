/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.uimanager.UIManagerModule;
// import com.facebook.react.uimanager.ViewManager;
import java.util.List;

/**
 * Main interface for providing additional capabilities to the catalyst framework by couple of
 * different means:
 *
 * <ol>
 *   <li>Registering new native modules
 *   <li>Registering new JS modules that may be accessed from native modules or from other parts of
 *       the native code (requiring JS modules from the package doesn't mean it will automatically
 *       be included as a part of the JS bundle, so there should be a corresponding piece of code on
 *       JS side that will require implementation of that JS module so that it gets bundled)
 *   <li>Registering custom native views (view managers) and custom event types
 *   <li>Registering natively packaged assets/resources (e.g. images) exposed to JS
 * </ol>
 *
 * <p>TODO(6788500, 6788507): Implement support for adding custom views, events and resources
 */
public interface ReactPackage {

  /**
   * @param reactContext react application context that can be used to create modules
   * @return list of native modules to register with the newly created catalyst instance
   * 
   * ** NativeScript **
   * Since we are using NativeScript, we don't need a Catalyst instance. But instead we will
   * use all ReactPackages and keep them in a Map from where we can get the ones we want to
   * use in our application. Because there is not bridge, we shouldn't use one.
   * 
   * React Native Modules do not need to know what's happening behind the scenes nor do they care lol.
   */
  @NonNull

  // ReactApplicationContext is basically just Application.context with some React Native APIs added
  // such as the runtime instance, the catalyst instance etc. Only some of these APIs are used in
  // NativeModules, for example for sending Events to Javascript.
  List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext);

//   /** @return a list of view managers that should be registered with {@link UIManagerModule} */
//   @NonNull
//   List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext);
}

// I have commented out anything related to ReactViews.

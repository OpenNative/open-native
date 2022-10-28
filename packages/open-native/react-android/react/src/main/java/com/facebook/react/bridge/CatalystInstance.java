/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.bridge;

import androidx.annotation.Nullable;
import java.util.Collection;

/**
 * A higher level API on top of the asynchronous JSC bridge. This provides an environment allowing
 * the invocation of JavaScript methods and lets a set of Java APIs be invokable from JavaScript as
 * well.
 */
public interface CatalystInstance {


  void destroy();

  boolean isDestroyed();

  <T extends JavaScriptModule> T getJSModule(Class<T> jsInterface);

  <T extends NativeModule> boolean hasNativeModule(Class<T> nativeModuleInterface);

  @Nullable
  <T extends NativeModule> T getNativeModule(Class<T> nativeModuleInterface);

  @Nullable
  NativeModule getNativeModule(String moduleName);

  JSIModule getJSIModule(JSIModuleType moduleType);

  Collection<NativeModule> getNativeModules();

  @Deprecated
  JavaScriptContextHolder getJavaScriptContextHolder();

  /**
   * For the time being, we want code relying on the old infra to also work with TurboModules.
   * Hence, we must provide the TurboModuleRegistry to CatalystInstance so that getNativeModule,
   * hasNativeModule, and getNativeModules can also return TurboModules.
   */

  void setTurboModuleManager(JSIModule getter);
}

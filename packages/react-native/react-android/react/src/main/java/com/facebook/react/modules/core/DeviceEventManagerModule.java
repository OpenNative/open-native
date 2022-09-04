/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.modules.core;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.proguard.annotations.DoNotStrip;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.module.annotations.ReactModule;

@DoNotStrip
@ReactModule(name = DeviceEventManagerModule.NAME)
public class DeviceEventManagerModule extends ReactContextBaseJavaModule {
  public static final String NAME = "DeviceEventManager";

  @DoNotStrip
  public interface RCTDeviceEventEmitter extends JavaScriptModule {
    void emit(@NonNull String eventName, @Nullable Object data);
  }

  public String getName() {
    return "DeviceEventManager";
  }
}

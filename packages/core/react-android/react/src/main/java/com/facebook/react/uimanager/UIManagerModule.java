/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
package com.facebook.react.uimanager;

import static com.facebook.react.uimanager.common.UIManagerType.DEFAULT;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.common.ViewUtil;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;


@ReactModule(name = UIManagerModule.NAME)
public class UIManagerModule extends ReactContextBaseJavaModule  {

  public static final String NAME = "UIManager";

  public UIManagerModule(ReactApplicationContext context) {
    super(context);
  }

  public void receiveEvent(int reactTag, String eventName, @Nullable WritableMap event) {
    receiveEvent(-1, reactTag, eventName, event);
  }

  public void receiveEvent(
      int surfaceId, int reactTag, String eventName, @Nullable WritableMap event) {
    assert ViewUtil.getUIManagerType(reactTag) == DEFAULT;
    getReactApplicationContext()
        .getJSModule(RCTEventEmitter.class)
        .receiveEvent(reactTag, eventName, event);
  }

  public EventDispatcher getEventDispatcher() {
      return new EventDispatcher() {
        @Override
        public void dispatchEvent(Event event) {
          event.dispatch(getReactApplicationContext()
            .getJSModule(RCTEventEmitter.class));
        }
      };
  }

  @NonNull
  @Override
  public String getName() {
    return NAME;
  }
}

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
package com.facebook.react.uimanager;

import static com.facebook.react.uimanager.common.UIManagerType.DEFAULT;

import android.view.View;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.bridge.UIManagerListener;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.common.ViewUtil;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.List;


@ReactModule(name = UIManagerModule.NAME)
public class UIManagerModule extends ReactContextBaseJavaModule implements UIManager {

  public static final String NAME = "UIManager";

  private NativeViewHierarchyManager viewHierarchyManager;

  public UIManagerModule(ReactApplicationContext context) {
    super(context);
    viewHierarchyManager = new NativeViewHierarchyManager(this.getReactApplicationContext());
  }

  @Override
  public <T extends View> int addRootView(T rootView, WritableMap initialProps, @Nullable String initialUITemplate) {
    return 0;
  }

  @Override
  public <T extends View> int startSurface(T rootView, String moduleName, WritableMap initialProps, int widthMeasureSpec, int heightMeasureSpec) {
    return 0;
  }

  @Override
  public void stopSurface(int surfaceId) {

  }

  @Override
  public void updateRootLayoutSpecs(int rootTag, int widthMeasureSpec, int heightMeasureSpec, int offsetX, int offsetY) {

  }

  @Override
  public void dispatchCommand(int reactTag, int commandId, @Nullable ReadableArray commandArgs) {

  }

  @Override
  public void dispatchCommand(int reactTag, String commandId, @Nullable ReadableArray commandArgs) {

  }

  @Override
  public void synchronouslyUpdateViewOnUIThread(int reactTag, ReadableMap props) {

  }

  @Override
  public void sendAccessibilityEvent(int reactTag, int eventType) {

  }

  @Override
  public void addUIManagerEventListener(UIManagerListener listener) {

  }

  @Override
  public void removeUIManagerEventListener(UIManagerListener listener) {

  }

  public void addUIBlock(UIBlock block) {
    block.execute(this.viewHierarchyManager);
  }
  public void prependUIBlock(UIBlock block) {
    block.execute(this.viewHierarchyManager);
  }

  @Override
  public View resolveView(int reactTag) {
    return this.viewHierarchyManager.resolveView(reactTag);
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

  @Nullable
  @Override
  public String resolveCustomDirectEventName(@Nullable String eventName) {
    return null;
  }

  @Override
  public void preInitializeViewManagers(List<String> viewManagerNames) {

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

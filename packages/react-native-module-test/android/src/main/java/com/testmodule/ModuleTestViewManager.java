package com.testmodule;

import android.graphics.Color;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Map;

public class ModuleTestViewManager extends SimpleViewManager<View> {
  public static final String REACT_CLASS = "ModuleTestView";

  @Override
  @NonNull
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  @NonNull
  public View createViewInstance(ThemedReactContext reactContext) {
    return new View(reactContext);
  }

  @ReactProp(name = "color")
  public void setColor(View view, String color) {
    view.setBackgroundColor(Color.parseColor(color));

    WritableMap event = Arguments.createMap();
    event.putString("data", "hello world");
    ReactContext reactContext = (ReactContext) view.getContext();
    reactContext
      .getJSModule(RCTEventEmitter.class)
      .receiveEvent(view.getId(), "topChange", event);
  }

  @Nullable
  @Override
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    return super.getExportedCustomDirectEventTypeConstants();
  }

  public Map getExportedCustomBubblingEventTypeConstants() {
    return MapBuilder.builder().put(
      "topChange",
      MapBuilder.of(
        "phasedRegistrationNames",
        MapBuilder.of("bubbled", "onChange")
      )
    ).build();
  }
}

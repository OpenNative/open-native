package com.facebook.react.uimanager;

import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
public class NativeViewHierarchyManager {

  public ReactApplicationContext reactApplicationContext;

  public NativeViewHierarchyManager(ReactApplicationContext reactApplicationContext) {
      this.reactApplicationContext = reactApplicationContext;
  }

  public final View resolveView(int tag){

    return this.reactApplicationContext.getCatalystInstance().resolveView(tag);
  }

}

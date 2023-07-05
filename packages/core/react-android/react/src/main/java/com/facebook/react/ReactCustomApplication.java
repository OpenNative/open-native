package com.facebook.react;

import android.app.Application;

public class ReactCustomApplication extends Application implements ReactApplication {
  public static ReactNativeHost mReactNativeHost;

  @Override
  public ReactNativeHost getReactNativeHost() {
    if (mReactNativeHost != null) return mReactNativeHost;
    mReactNativeHost = new ReactNativeHost(this);
    return mReactNativeHost;
  }
}

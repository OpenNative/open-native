/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react;

import android.app.Application;
import androidx.annotation.Nullable;

/**
 * Simple class that holds an instance of {@link ReactInstanceManager}. This can be used in your
 * {@link Application class} (see {@link ReactApplication}), or as a static field.
 */
public class ReactNativeHost {

  private final Application mApplication;
  private @Nullable ReactInstanceManager mReactInstanceManager;

  public ReactNativeHost(Application application) {
    mApplication = application;
  }

  /** Get the current {@link ReactInstanceManager} instance, or create one. */
  public ReactInstanceManager getReactInstanceManager() {
    if (mReactInstanceManager == null) {
      mReactInstanceManager = createReactInstanceManager();
    }
    return mReactInstanceManager;
  }

  /**
   * Get whether this holder contains a {@link ReactInstanceManager} instance, or not. I.e. if
   * {@link #getReactInstanceManager()} has been called at least once since this object was created
   * or {@link #clear()} was called.
   */
  public boolean hasInstance() {
    return mReactInstanceManager != null;
  }

  /**
   * Destroy the current instance and release the internal reference to it, allowing it to be GCed.
   */
  public void clear() {
    if (mReactInstanceManager != null) {
      mReactInstanceManager = null;
    }
  }

  protected ReactInstanceManager createReactInstanceManager() {
    ReactInstanceManager reactInstanceManager = new ReactInstanceManager(mApplication.getApplicationContext(),null);
    return reactInstanceManager;
  }

  protected final Application getApplication() {
    return mApplication;
  }

  /** Returns whether or not to treat it as normal if Activity is null. */
  public boolean getShouldRequireActivity() {
    return true;
  }
}

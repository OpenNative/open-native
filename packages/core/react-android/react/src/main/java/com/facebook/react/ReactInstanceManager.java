/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react;

import static com.facebook.infer.annotation.ThreadConfined.UI;

import android.app.Activity;
import android.content.Context;
import android.util.Log;

import androidx.annotation.Nullable;
import com.facebook.infer.annotation.ThreadConfined;
import com.facebook.infer.annotation.ThreadSafe;
import com.facebook.react.bridge.CatalystInstance;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;

import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.common.annotations.VisibleForTesting;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@ThreadSafe
public class ReactInstanceManager {

  private static final String TAG = ReactInstanceManager.class.getSimpleName();
  /** Listener interface for react instance events. */
  public interface ReactInstanceEventListener {

    /**
     * Called when the react context is initialized (all modules registered). Always called on the
     * UI thread.
     */
    void onReactContextInitialized(ReactContext context);
  }
  // See {@code ReactInstanceManagerBuilder} for description of all flags here.
  private @Nullable List<String> mViewManagerNames = null;
  private @Nullable volatile ReactContext mCurrentReactContext;
  private final Context mApplicationContext;
  private @Nullable Activity mCurrentActivity;
  private final Collection<ReactInstanceEventListener> mReactInstanceEventListeners =
      Collections.synchronizedList(new ArrayList<ReactInstanceEventListener>());
  // Identifies whether the instance manager is or soon will be initialized (on background thread)
  private volatile boolean mHasStartedCreatingInitialContext = false;
  // Identifies whether the instance manager destroy function is in process,
  // while true any spawned create thread should wait for proper clean up before initializing
  private boolean mUseFallbackBundle = false;


  ReactInstanceManager(Context applicationContext, @Nullable Activity currentActivity) {
    mApplicationContext = applicationContext;
    mCurrentActivity = currentActivity;
  }

  @ThreadConfined(UI)
  public void createReactContextInBackground() {}

  /**
   * @return whether createReactContextInBackground has been called. Will return false after
   *     onDestroy until a new initial context has been created.
   */
  public boolean hasStartedCreatingInitialContext() {
    return mHasStartedCreatingInitialContext;
  }

  /** Add a listener to be notified of react instance events. */
  public void addReactInstanceEventListener(ReactInstanceEventListener listener) {
    mReactInstanceEventListeners.add(listener);
  }

  /** Remove a listener previously added with {@link #addReactInstanceEventListener}. */
  public void removeReactInstanceEventListener(ReactInstanceEventListener listener) {
    mReactInstanceEventListeners.remove(listener);
  }

  @VisibleForTesting
  public @Nullable ReactContext getCurrentReactContext() {
    return mCurrentReactContext;
  }

  public String getJsExecutorName() {
    return "OpenNative";
  }

  public void setupReactContext(final ReactApplicationContext reactContext) {
    // There is a race condition here - `finalListeners` can contain null entries
    // See usage below for more details.
    Log.d(TAG,"Initialized React Context");
    mHasStartedCreatingInitialContext = true;
    mCurrentReactContext = reactContext;
    ReactInstanceEventListener[] listeners =
        new ReactInstanceEventListener[mReactInstanceEventListeners.size()];
    final ReactInstanceEventListener[] finalListeners =
        mReactInstanceEventListeners.toArray(listeners);
    Log.d("ReactInstanceManager", "setupReactContext");
    UiThreadUtil.runOnUiThread(
        new Runnable() {
          @Override
          public void run() {
            for (ReactInstanceEventListener listener : finalListeners) {
              // Sometimes this listener is null - probably due to race
              // condition between allocating listeners with a certain
              // size, and getting a `final` version of the array on
              // the following line.
              if (listener != null) {
                listener.onReactContextInitialized(reactContext);
              }
            }
          }
        });
    mHasStartedCreatingInitialContext = false;
  }

  /** @return instance of {@link ReactContext} configured a {@link CatalystInstance} set */
  private ReactApplicationContext createReactContext(ReactApplicationContext reactContext, CatalystInstance catalystInstance) {
    mCurrentReactContext = reactContext;
    return reactContext;
  }
}

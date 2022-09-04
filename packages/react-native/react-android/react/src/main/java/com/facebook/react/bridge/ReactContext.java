/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.bridge;

import android.app.Activity;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import androidx.annotation.Nullable;
import androidx.annotation.UiThread;
import static com.facebook.infer.annotation.ThreadConfined.UI;
import com.facebook.infer.annotation.ThreadConfined;
import com.facebook.react.common.LifecycleState;
import java.lang.ref.WeakReference;
import java.util.Collection;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * Abstract ContextWrapper for Android application or activity {@link Context} and {@link
 * CatalystInstance}
 */
public class ReactContext extends ContextWrapper {

  private static final String TAG = "ReactContext";
  private static final String EARLY_JS_ACCESS_EXCEPTION_MESSAGE =
    "Tried to access a JS module before the React instance was fully set up. Calls to "
      + "ReactContext#getJSModule should only happen once initialize() has been called on your "
      + "native module.";
  private static final String LATE_JS_ACCESS_EXCEPTION_MESSAGE =
    "Tried to access a JS module after the React instance was destroyed.";
  private static final String EARLY_NATIVE_MODULE_EXCEPTION_MESSAGE =
    "Trying to call native module before CatalystInstance has been set!";
  private static final String LATE_NATIVE_MODULE_EXCEPTION_MESSAGE =
    "Trying to call native module after CatalystInstance has been destroyed!";

  private final CopyOnWriteArraySet<LifecycleEventListener> mLifecycleEventListeners =
    new CopyOnWriteArraySet<>();
  private final CopyOnWriteArraySet<ActivityEventListener> mActivityEventListeners =
    new CopyOnWriteArraySet<>();
  private final CopyOnWriteArraySet<WindowFocusChangeListener> mWindowFocusEventListeners =
    new CopyOnWriteArraySet<>();

  private LifecycleState mLifecycleState = LifecycleState.BEFORE_CREATE;

  private volatile boolean mDestroyed = false;
  private @Nullable CatalystInstance mCatalystInstance;
  private @Nullable LayoutInflater mInflater;
  private @Nullable WeakReference<Activity> mCurrentActivity;
  private boolean mIsInitialized = false;
  public ReactContext(Context base) {
    super(base);
  }

  /** Set and initialize CatalystInstance for this Context. This should be called exactly once. */
  public void initializeWithInstance(CatalystInstance catalystInstance) {
    if (catalystInstance == null) {
      throw new IllegalArgumentException("CatalystInstance cannot be null.");
    }
    if (mCatalystInstance != null) {
      throw new IllegalStateException("ReactContext has been already initialized");
    }
    if (mDestroyed) return;

    mCatalystInstance = catalystInstance;
    mIsInitialized = true;
  }


  private void raiseCatalystInstanceMissingException() {
    throw new IllegalStateException(
      mDestroyed ? LATE_NATIVE_MODULE_EXCEPTION_MESSAGE : EARLY_NATIVE_MODULE_EXCEPTION_MESSAGE);
  }

  // We override the following method so that views inflated with the inflater obtained from this
  // context return the ReactContext in #getContext(). The default implementation uses the base
  // context instead, so it couldn't be cast to ReactContext.
  // TODO: T7538796 Check requirement for Override of getSystemService ReactContext
  @Override
  public Object getSystemService(String name) {
    if (LAYOUT_INFLATER_SERVICE.equals(name)) {
      if (mInflater == null) {
        mInflater = LayoutInflater.from(getBaseContext()).cloneInContext(this);
      }
      return mInflater;
    }
    return getBaseContext().getSystemService(name);
  }

  /**
   * @return handle to the specified JS module for the CatalystInstance associated with this Context
   */
  public <T extends JavaScriptModule> T getJSModule(Class<T> jsInterface) {
    if (mCatalystInstance == null) {
      if (mDestroyed) {
        throw new IllegalStateException(LATE_JS_ACCESS_EXCEPTION_MESSAGE);
      }
      throw new IllegalStateException(EARLY_JS_ACCESS_EXCEPTION_MESSAGE);
    }
    return mCatalystInstance.getJSModule(jsInterface);
  }

  public <T extends NativeModule> boolean hasNativeModule(Class<T> nativeModuleInterface) {
    if (mCatalystInstance == null) {
      raiseCatalystInstanceMissingException();
    }
    return mCatalystInstance.hasNativeModule(nativeModuleInterface);
  }

  public Collection<NativeModule> getNativeModules() {
    if (mCatalystInstance == null) {
      raiseCatalystInstanceMissingException();
    }
    return mCatalystInstance.getNativeModules();
  }

  /** @return the instance of the specified module interface associated with this ReactContext. */
  @Nullable
  public <T extends NativeModule> T getNativeModule(Class<T> nativeModuleInterface) {
    if (mCatalystInstance == null) {
      raiseCatalystInstanceMissingException();
    }
    return mCatalystInstance.getNativeModule(nativeModuleInterface);
  }

  public CatalystInstance getCatalystInstance() {
    return mCatalystInstance;
  }

  /**
   * This API has been deprecated due to naming consideration, please use hasActiveReactInstance()
   * instead
   *
   * @return
   */
  @Deprecated
  public boolean hasActiveCatalystInstance() {
    return hasActiveReactInstance();
  }

  /** @return true if there is an non-null, alive react native instance */
  public boolean hasActiveReactInstance() {
    return true;
  }

  public boolean hasCatalystInstance() {
    return mCatalystInstance != null;
  }

  public LifecycleState getLifecycleState() {
    return mLifecycleState;
  }

  public void addLifecycleEventListener(final LifecycleEventListener listener) {
    mLifecycleEventListeners.add(listener);
    if (hasActiveReactInstance() || isBridgeless()) {
      switch (mLifecycleState) {
        case BEFORE_CREATE:
        case BEFORE_RESUME:
          break;
        case RESUMED:
          runOnUiQueueThread(
            new Runnable() {
              @Override
              public void run() {
                if (!mLifecycleEventListeners.contains(listener)) {
                  return;
                }
                try {
                  listener.onHostResume();
                } catch (RuntimeException e) {

                }
              }
            });
          break;
        default:
          throw new IllegalStateException("Unhandled lifecycle state.");
      }
    }
  }

  public void removeLifecycleEventListener(LifecycleEventListener listener) {
    mLifecycleEventListeners.remove(listener);
  }

  public void addActivityEventListener(ActivityEventListener listener) {
    mActivityEventListeners.add(listener);
  }

  public void removeActivityEventListener(ActivityEventListener listener) {
    mActivityEventListeners.remove(listener);
  }

  public void addWindowFocusChangeListener(WindowFocusChangeListener listener) {
    mWindowFocusEventListeners.add(listener);
  }

  public void removeWindowFocusChangeListener(WindowFocusChangeListener listener) {
    mWindowFocusEventListeners.remove(listener);
  }

  public void runOnUiQueueThread(Runnable runnable) {
      UiThreadUtil.assertOnUiThread();
      try {
        UiThreadUtil.runOnUiThread(runnable);
      } catch (Exception e) {

      }
  }


  public void onHostResume(@Nullable Activity activity) {
    mLifecycleState = LifecycleState.RESUMED;
    mCurrentActivity = new WeakReference(activity);
    for (LifecycleEventListener listener : mLifecycleEventListeners) {
      try {
        listener.onHostResume();
      } catch (RuntimeException e) {
      }
    }
  }

  @ThreadConfined(UI)
  public void onNewIntent(@Nullable Activity activity, Intent intent) {
    UiThreadUtil.assertOnUiThread();
    mCurrentActivity = new WeakReference(activity);
    for (ActivityEventListener listener : mActivityEventListeners) {
      try {
        listener.onNewIntent(intent);
      } catch (RuntimeException e) {

      }
    }
  }

  public void onHostPause() {
    mLifecycleState = LifecycleState.BEFORE_RESUME;
    for (LifecycleEventListener listener : mLifecycleEventListeners) {
      try {
        listener.onHostPause();
      } catch (RuntimeException e) {
      }
    }
  }

  public void onHostDestroy() {

    UiThreadUtil.assertOnUiThread();
    mLifecycleState = LifecycleState.BEFORE_CREATE;
    for (LifecycleEventListener listener : mLifecycleEventListeners) {
      try {
        listener.onHostDestroy();
      } catch (RuntimeException e) {}
    }
    mCurrentActivity = null;
  }


  public void destroy() {

    UiThreadUtil.assertOnUiThread();
    mDestroyed = true;
  }

  public void onActivityResult(
    Activity activity, int requestCode, int resultCode, @Nullable Intent data) {
    for (ActivityEventListener listener : mActivityEventListeners) {
      try {
        listener.onActivityResult(activity, requestCode, resultCode, data);
      } catch (RuntimeException e) {}
    }
  }

  public void onWindowFocusChange(boolean hasFocus) {
    UiThreadUtil.assertOnUiThread();
    for (WindowFocusChangeListener listener : mWindowFocusEventListeners) {
      try {
        listener.onWindowFocusChange(hasFocus);
      } catch (RuntimeException e) {}
    }
  }

  public boolean hasCurrentActivity() {
    return mCurrentActivity != null && mCurrentActivity.get() != null;
  }

  /**
   * Same as {@link Activity#startActivityForResult(Intent, int)}, this just redirects the call to
   * the current activity. Returns whether the activity was started, as this might fail if this was
   * called before the context is in the right state.
   */
  public boolean startActivityForResult(Intent intent, int code, Bundle bundle) {
    Activity activity = getCurrentActivity();
    if (activity != null) {
      activity.startActivityForResult(intent, code, bundle);
      return true;
    }
    return false;
  }

  /**
   * Get the activity to which this context is currently attached, or {@code null} if not attached.
   * DO NOT HOLD LONG-LIVED REFERENCES TO THE OBJECT RETURNED BY THIS METHOD, AS THIS WILL CAUSE
   * MEMORY LEAKS.
   */
  public @Nullable Activity getCurrentActivity() {
    if (mCurrentActivity == null) {
      return null;
    }
    return mCurrentActivity.get();
  }

  /** @deprecated DO NOT USE, this method will be removed in the near future. */
  public boolean isBridgeless() {
    return false;
  }

  /**
   * Get the C pointer (as a long) to the JavaScriptCore context associated with this instance. Use
   * the following pattern to ensure that the JS context is not cleared while you are using it:
   * JavaScriptContextHolder jsContext = reactContext.getJavaScriptContextHolder()
   * synchronized(jsContext) { nativeThingNeedingJsContext(jsContext.get()); }
   */
  public JavaScriptContextHolder getJavaScriptContextHolder() {
    // NativeScript does not require this. Keeping it here for compatibility.
    return new JavaScriptContextHolder();
  }

  public @Nullable JSIModule getJSIModule(JSIModuleType moduleType) {
    // NativeScript does not support JSI.
    return null;
  }

  /**
   * Get the sourceURL for the JS bundle from the CatalystInstance. This method is needed for
   * compatibility with bridgeless mode, which has no CatalystInstance.
   *
   * @return The JS bundle URL set when the bundle was loaded
   */
  public @Nullable String getSourceURL() {
    // In NativeScript we do not require this. Keeping it here for compatibility.
    return null;
  }

  /**
   * Register a JS segment after loading it from cache or server, make sure mCatalystInstance is
   * properly initialised and not null before calling.
   *
   * @param segmentId
   * @param path
   */
  public void registerSegment(int segmentId, String path, Callback callback) {
    callback.invoke();
    // In NativeScript we do not require this. Keeping it here for compatibility.
  }
}

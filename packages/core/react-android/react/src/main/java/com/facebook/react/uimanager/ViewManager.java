package com.facebook.react.uimanager;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.BaseJavaModule;
import com.facebook.react.bridge.ReadableArray;

import java.util.Map;

public abstract class ViewManager <T extends View, C extends ReactShadowNode>
  extends BaseJavaModule {

  /**
   * @return the name of this view manager. This will be the name used to reference this view
   *     manager from JavaScript in createReactNativeComponentClass.
   */
  public abstract @NonNull String getName();

  /**
   * Subclasses should return a new View instance of the proper type.
   *
   * @param reactContext
   */
  protected abstract @NonNull T createViewInstance(@NonNull ThemedReactContext reactContext);

  @Deprecated
  public void receiveCommand(@NonNull T root, int commandId, @Nullable ReadableArray args) {}


  public void receiveCommand(@NonNull T root, String commandId, @Nullable ReadableArray args) {}

  /**
   * Subclasses can override this method to install custom event emitters on the given View. You
   * might want to override this method if your view needs to emit events besides basic touch events
   * to JS (e.g. scroll events).
   */
  protected void addEventEmitters(@NonNull ThemedReactContext reactContext, @NonNull T view) {}


  public @Nullable Map<String, Integer> getCommandsMap() {
    return null;
  }

  /**
   * Returns a map of config data passed to JS that defines eligible events that can be placed on
   * native views. This should return bubbling directly-dispatched event types and specify what
   * names should be used to subscribe to either form (bubbling/capturing).
   *
   * <p>Returned map should be of the form:
   *
   * <pre>
   * {
   *   "onTwirl": {
   *     "phasedRegistrationNames": {
   *       "bubbled": "onTwirl",
   *       "captured": "onTwirlCaptured"
   *     }
   *   }
   * }
   * </pre>
   */
  public @Nullable Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
    return null;
  }

  /**
   * Returns a map of config data passed to JS that defines eligible events that can be placed on
   * native views. This should return non-bubbling directly-dispatched event types.
   *
   * <p>Returned map should be of the form:
   *
   * <pre>
   * {
   *   "onTwirl": {
   *     "registrationName": "onTwirl"
   *   }
   * }
   * </pre>
   */
  public @Nullable Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    return null;
  }

  /**
   * Returns a map of view-specific constants that are injected to JavaScript. These constants are
   * made accessible via UIManager.<ViewName>.Constants.
   */
  public @Nullable Map<String, Object> getExportedViewConstants() {
    return null;
  }

  public void onDropViewInstance(@NonNull T view) {}

}

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.uimanager.events;

import androidx.annotation.Nullable;
import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactNoCrashSoftException;
import com.facebook.react.bridge.ReactSoftExceptionLogger;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.common.UIManagerType;
import com.facebook.react.uimanager.common.ViewUtil;

public class ReactEventEmitter implements RCTModernEventEmitter {

  private static final String TAG = "ReactEventEmitter";

  @Nullable
  private RCTModernEventEmitter mFabricEventEmitter =
      null; /* Corresponds to a Fabric EventEmitter */

  @Nullable
  private RCTEventEmitter mRCTEventEmitter = null; /* Corresponds to a Non-Fabric EventEmitter */

  private final ReactApplicationContext mReactContext;

  public ReactEventEmitter(ReactApplicationContext reactContext) {
    mReactContext = reactContext;
  }

  public void register(@UIManagerType int uiManagerType, RCTModernEventEmitter eventEmitter) {
    assert uiManagerType == UIManagerType.FABRIC;
    mFabricEventEmitter = eventEmitter;
  }

  public void register(@UIManagerType int uiManagerType, RCTEventEmitter eventEmitter) {
    assert uiManagerType == UIManagerType.DEFAULT;
    mRCTEventEmitter = eventEmitter;
  }

  public void unregister(@UIManagerType int uiManagerType) {
    if (uiManagerType == UIManagerType.DEFAULT) {
      mRCTEventEmitter = null;
    } else {
      mFabricEventEmitter = null;
    }
  }

  @Override
  public void receiveEvent(int targetReactTag, String eventName, @Nullable WritableMap event) {
    receiveEvent(-1, targetReactTag, eventName, event);
  }

  @Override
  public void receiveEvent(
      int surfaceId, int targetTag, String eventName, @Nullable WritableMap event) {}

  @Override
  public void receiveTouches(
      String eventName, WritableArray touches, WritableArray changedIndices) {
    Assertions.assertCondition(touches.size() > 0);
   mRCTEventEmitter.receiveTouches(eventName, touches, changedIndices);

  }

  @Nullable
  private RCTEventEmitter getEventEmitter(int reactTag) {
    int type = ViewUtil.getUIManagerType(reactTag);
    assert type == UIManagerType.DEFAULT;
    if (mRCTEventEmitter == null) {
      if (mReactContext.hasActiveReactInstance()) {
        mRCTEventEmitter = mReactContext.getJSModule(RCTEventEmitter.class);
      } else {
        ReactSoftExceptionLogger.logSoftException(
            TAG,
            new ReactNoCrashSoftException(
                "Cannot get RCTEventEmitter from Context for reactTag: "
                    + reactTag
                    + " - uiManagerType: "
                    + type
                    + " - No active Catalyst instance!"));
      }
    }
    return mRCTEventEmitter;
  }

  @Override
  public void receiveEvent(
      int surfaceId,
      int targetReactTag,
      String eventName,
      boolean canCoalesceEvent,
      int customCoalesceKey,
      @Nullable WritableMap event,
      int category) {
    @UIManagerType int uiManagerType = ViewUtil.getUIManagerType(targetReactTag);
      mRCTEventEmitter.receiveEvent(targetReactTag, eventName, event);
  }
}

/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.bridge;

import android.app.Activity;
import android.content.Intent;

/**
 * Listener for receiving activity events. Consider using {BaseActivityEventListener} if
 * you're not interested in all the events sent to this interface.
 */
public interface ActivityEventListener {

  /** Called when host (activity/service) receives an {Activity#onActivityResult} call. */
  void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data);

  /** Called when a new intent is passed to the activity */
  void onNewIntent(Intent intent);
}

// On app state change, we will need to invoke these methods.
// For now they are not required to basic functionality of native modules
// but keeping them here for future.

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NativeModules } from '../..';
import { Args } from './NativeAlertManager';
function emptyCallback() {
  return;
}

function alertWithArgs(
  args: Args,
  callback: (id: number, value: string) => void
) {
  // TODO(5998984): Polyfill it correctly with DialogManagerAndroid
  if (!NativeModules.DialogManagerAndroid) {
    return;
  }

  NativeModules.DialogManagerAndroid.showAlert(
    args,
    emptyCallback,
    callback || emptyCallback
  );
}

export default { alertWithArgs };

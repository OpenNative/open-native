/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import NativeAlertManager from './NativeAlertManager';
import type { Args } from './NativeAlertManager';

export default {
  alertWithArgs(
    args: Args,
    callback: (id: number, value: string) => void
  ): void {
    console.log('NativeAlertManager', NativeAlertManager);
    if (NativeAlertManager == null) {
      return;
    }
    NativeAlertManager.alertWithArgs(args, callback);
  },
};

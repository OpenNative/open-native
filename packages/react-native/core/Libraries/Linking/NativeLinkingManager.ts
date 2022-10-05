/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

import { NativeModules } from '../../..';

// export interface Spec extends TurboModule {
//   // Common interface
//   +getInitialURL: () => Promise<string>;
//   +canOpenURL: (url: string) => Promise<boolean>;
//   +openURL: (url: string) => Promise<void>;
//   +openSettings: () => Promise<void>;

//   // Events
//   +addListener: (eventName: string) => void;
//   +removeListeners: (count: number) => void;
// }

export default NativeModules.RCTLinkingManager;

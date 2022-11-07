/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-react-native file in the root directory of this source tree.
 */

// This exists as a separate file only to avoid circular dependencies from
// using this in `_EmitterSubscription`. Combine this back into `EventEmitter`
// after migration and cleanup is done.

export interface EventSubscription {
  remove(): void;
}

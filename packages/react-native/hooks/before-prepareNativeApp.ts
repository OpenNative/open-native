/* eslint-disable @typescript-eslint/no-unused-vars */
// We'd rather import like this, but we can't statically import from other
// packages within the monorepo (long story):
// import { autolinkIos, HookArgs } from '@ammarahm-ed/react-native-autolinking';

import type { HookArgs } from '@ammarahm-ed/react-native-autolinking';
import type * as ReactNativeAutolinking from '@ammarahm-ed/react-native-autolinking';
import * as path from 'path';

const logPrefix = '[react-native/hooks/before-prepareNativeApp.js]';

/**
 * On iOS, autolink any React Native native modules.
 */
async function autolinkAndroidHook(hookArgs: HookArgs) {
  const {
    projectData,
    platformData: { platformNameLowerCase },
  } = hookArgs;

  // Any iOS autolinking is handled in react-native-podspecs.
  if (platformNameLowerCase !== 'android') {
    return;
  }

  const { devDependencies, dependencies, ignoredDependencies, projectDir } = projectData;

  const ignoredDepsSet = new Set(ignoredDependencies);
  const depsArr = Object.keys({ ...devDependencies, ...dependencies }).filter((key) => !ignoredDepsSet.has(key));

  // This elaborate `require()` call is a workaround to enable requiring other
  // packages developed in this monorepo. It'll work fine for end users, too.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { autolinkAndroid } = require(path.dirname(
    require.resolve('@ammarahm-ed/react-native-autolinking/package.json', {
      paths: [__dirname, projectDir],
    })
  )) as typeof ReactNativeAutolinking;

  await autolinkAndroid({ dependencies: depsArr, projectDir });
}

export = autolinkAndroidHook;

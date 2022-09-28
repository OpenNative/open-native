// We'd rather import like this, but we can't statically import from other
// packages within the monorepo (long story):
// import { autolinkIos, HookArgs } from '@ammarahm-ed/react-native-autolinking';

import type { HookArgs } from '@ammarahm-ed/react-native-autolinking';
import type * as ReactNativeAutolinking from '@ammarahm-ed/react-native-autolinking';
import * as path from 'path';

const logPrefix = '[react-native-podspecs/hooks/before-prepareNativeApp.js]';

/**
 * On iOS, autolink any React Native native modules.
 */
async function autolinkIosHook(hookArgs: HookArgs) {
  const {
    projectData,
    platformData: { platformNameLowerCase },
  } = hookArgs;

  // For now, we handle only iOS (as platforms other than iOS are experimental
  // on NativeScript). We might come back for macOS one day! :D
  if (platformNameLowerCase !== 'ios') {
    return;
  }

  const { devDependencies, dependencies, ignoredDependencies, projectDir } =
    projectData;

  const ignoredDepsSet = new Set(ignoredDependencies);
  const depsArr = Object.keys({ ...devDependencies, ...dependencies }).filter(
    (key) => !ignoredDepsSet.has(key)
  );

  // This elaborate `require()` call is a workaround to enable requiring other
  // packages developed in this monorepo. It'll work fine for end users, too.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { autolinkIos } = require(path.dirname(
    require.resolve('@ammarahm-ed/react-native-autolinking/package.json', {
      paths: [__dirname, projectDir],
    })
  )) as typeof ReactNativeAutolinking;

  console.log(`${logPrefix} Autolinking React Native iOS native modules...`);

  /**
   * @example '/Users/jamie/Documents/git/nativescript-magic-spells/dist/packages/react-native-podspecs'
   */
  const reactNativePodspecsPackageDir = path.dirname(__dirname);

  const outputHeaderPath = path.resolve(
    reactNativePodspecsPackageDir,
    'platforms/ios/lib/RNPodspecs.h'
  );
  const outputPodfilePath = path.resolve(
    reactNativePodspecsPackageDir,
    'platforms/ios/Podfile'
  );

  const packageNames = await autolinkIos({
    dependencies: depsArr,
    projectDir,
    outputHeaderPath,
    outputPodfilePath,
  });

  const green = '\x1b[32m';
  const reset = '\x1b[0m';
  packageNames.forEach((packageName) =>
    console.log(`${logPrefix} Autolinked ${green}${packageName}${reset}!`)
  );

  console.log(
    `${logPrefix} ... Finished autolinking React Native iOS native modules.`
  );
}

export = autolinkIosHook;

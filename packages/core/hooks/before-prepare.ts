import * as path from 'path';
import type { HookArgs } from './hookArgs';
import { autolinkAndroid } from './android/prepare';
import { autolinkIos } from './ios/prepare';

const logPrefix = '[@open-native/core/hooks/before-prepare.js]';
const green = '\x1b[32m';
const reset = '\x1b[0m';

/**
 * autolink any React Native native modules.
 */
export = async function (hookArgs: HookArgs) {
  const normalizedPlatformName = hookArgs?.prepareData?.platform;

  if (
    normalizedPlatformName !== 'android' &&
    normalizedPlatformName !== 'ios'
  ) {
    console.warn(
      `${logPrefix} Unrecognised platform, ${normalizedPlatformName} - unable to link React Native native modules.`
    );
    return;
  }

  const { devDependencies, dependencies, ignoredDependencies, projectDir } =
    hookArgs.projectData;
  const ignoredDepsSet = new Set(ignoredDependencies);
  const depsArr = Object.keys({ ...devDependencies, ...dependencies }).filter(
    (key) => !ignoredDepsSet.has(key)
  );
  let packageNames: Array<string>;

  /**
   * @example '/Users/jamie/Documents/git/open-native/dist/packages/core'
   */

  const packageDir = path.dirname(
    require.resolve('@open-native/core/package.json')
  );
  console.log(
    `${logPrefix} Autolinking React Native ${normalizedPlatformName} native modules...`
  );

  if (normalizedPlatformName === 'android') {
    const outputModulesJsonPath = path.resolve(
      packageDir,
      'react-android/bridge/modules.json'
    );
    const outputPackagesJavaPath = path.resolve(
      packageDir,
      'react-android/bridge/src/main/java/com/bridge/Packages.java'
    );
    const outputModuleMapPath = path.resolve(
      packageDir,
      'react-android/bridge/modulemap.json'
    );

    const outputIncludeGradlePath = path.resolve(
      packageDir,
      'platforms/android/include.gradle'
    );
    const outputViewManagerTypesPath = path.resolve(
      packageDir,
      'src/android/view-manager-types.d.ts'
    );
    packageNames = await autolinkAndroid({
      packageDir,
      dependencies: depsArr,
      projectDir,
      outputModulesJsonPath,
      outputPackagesJavaPath,
      outputModuleMapPath,
      outputIncludeGradlePath,
      outputViewManagerTypesPath,
    });
  } else {
    const outputHeaderPath = path.resolve(
      packageDir,
      'platforms/ios/lib_community/RNPodspecs.h'
    );
    const outputPodfilePath = path.resolve(packageDir, 'platforms/ios/Podfile');
    const outputPodspecPath = path.resolve(
      packageDir,
      'platforms/ios/React-Native-Podspecs.podspec'
    );
    const outputModuleMapPath = path.resolve(
      packageDir,
      'platforms/ios/lib_community/modulemap.json'
    );

    const outputViewManagerTypesPath = path.resolve(
      packageDir,
      'src/ios/view-manager-types.d.ts'
    );

    packageNames = await autolinkIos({
      packageDir,
      dependencies: depsArr,
      projectDir,
      outputHeaderPath,
      outputPodfilePath,
      outputModuleMapPath,
      outputPodspecPath,
      outputViewManagerTypesPath,
    });
  }

  packageNames.forEach((packageName) =>
    console.log(`${logPrefix} Autolinked ${green}${packageName}${reset}!`)
  );

  console.log(
    `${logPrefix} ... Finished autolinking React Native ${normalizedPlatformName} native modules.`
  );
};

'use strict';
const path = require('path');
const prepare_android_1 = require('./prepare-android');
const prepare_ios_1 = require('./prepare-ios');
const logPrefix = '[react-native/hooks/before-prepareNativeApp.js]';
const green = '\x1b[32m';
const reset = '\x1b[0m';
module.exports = async function (hookArgs) {
  var _a;
  const normalizedPlatformName = (_a = hookArgs === null || hookArgs === void 0 ? void 0 : hookArgs.platformData) === null || _a === void 0 ? void 0 : _a.normalizedPlatformName;
  if (normalizedPlatformName !== 'Android' && normalizedPlatformName !== 'iOS') {
    console.warn(`${logPrefix} Unrecognised platform, ${normalizedPlatformName} - unable to link React Native native modules.`);
    return;
  }
  const { devDependencies, dependencies, ignoredDependencies, projectDir } = hookArgs.projectData;
  const ignoredDepsSet = new Set(ignoredDependencies);
  const depsArr = Object.keys(Object.assign(Object.assign({}, devDependencies), dependencies)).filter((key) => !ignoredDepsSet.has(key));
  let packageNames;
  const packageDir = path.dirname(__dirname);
  console.log(`${logPrefix} Autolinking React Native ${normalizedPlatformName} native modules...`);
  if (normalizedPlatformName === 'Android') {
    const outputModulesJsonPath = path.resolve(packageDir, 'react-android/bridge/modules.json');
    const outputPackagesJavaPath = path.resolve(packageDir, 'react-android/bridge/src/main/java/com/bridge/Packages.java');
    const outputModuleMapPath = path.resolve(packageDir, 'react-android/bridge/modulemap.json');
    const outputIncludeGradlePath = path.resolve(packageDir, 'platforms/android/include.gradle');
    packageNames = await (0, prepare_android_1.autolinkAndroid)({
      dependencies: depsArr,
      projectDir,
      outputModulesJsonPath,
      outputPackagesJavaPath,
      outputModuleMapPath,
      outputIncludeGradlePath,
    });
  } else {
    const outputHeaderPath = path.resolve(packageDir, 'platforms/ios/lib_community/RNPodspecs.h');
    const outputPodfilePath = path.resolve(packageDir, 'platforms/ios/Podfile');
    const outputPodspecPath = path.resolve(packageDir, 'platforms/ios/React-Native-Podspecs.podspec');
    const outputModuleMapPath = path.resolve(packageDir, 'platforms/ios/lib_community/modulemap.json');
    packageNames = await (0, prepare_ios_1.autolinkIos)({
      dependencies: depsArr,
      projectDir,
      outputHeaderPath,
      outputPodfilePath,
      outputModuleMapPath,
      outputPodspecPath,
    });
  }
  packageNames.forEach((packageName) => console.log(`${logPrefix} Autolinked ${green}${packageName}${reset}!`));
  console.log(`${logPrefix} ... Finished autolinking React Native ${normalizedPlatformName} native modules.`);
};

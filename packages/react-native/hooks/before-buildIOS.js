const path = require('path');
const fs = require('fs');

/**
 * For all available hook types, see:
 * @see https://github.com/NativeScript/NativeScript/blob/9ccc54b6035c04e383d9256fb3ad9c0c7b00fa20/packages/core/config/config.interface.ts#L134
 * @see https://github.com/NativeScript/nativescript-hook/issues/11#issuecomment-457705213
 * @see https://docs.npmjs.com/cli/v6/using-npm/scripts#pre--post-scripts
 * @see https://github.com/NativeScript/nativescript-app-templates/blob/master/packages/template-hello-world-ts/hooks/after-createProject/after-createProject.js
 * @see https://www.nsplugins.com/plugin/nativescript
 * @see https://github.com/NativeScript/plugins/tree/31b0f5157d02fdf17e89ac29233585cb7e4ebf6f/packages/localize/hooks
 * @see https://github.com/NativeScript/nativescript-cli/blob/master/extending-cli.md
 * @see https://blog.nativescript.org/migrating-cli-hooks-to-nativescript-6.0/
 * @see https://github.com/NativeScript/nativescript-cli/blob/c61edbeef668b9c17e744d7af3909306c435a16a/lib/project-data.ts
 *
 * @param {object} hookArgs
 * @param {object} hookArgs.projectData
 * @param {string} hookArgs.projectData.projectDir
 *   The absolute path to the root of your project. Typically where you'd see
 *   package.json, webpack.config.js, nativescript.config.js, and the platforms
 *   directory.
 * @param {string} hookArgs.projectData.platformsDir
 *   The absolute path to the platforms directory.
 * @param {unknown} hookArgs.projectData.projectConfig
 * @param {string} hookArgs.projectData.projectFilePath
 *   The filepath to the package.json file for your project.
 * @param {{ ios: string; android: string } | string} hookArgs.projectData.projectIdentifiers
 *   I'm unclear of the exact type of this.
 * @param {string} hookArgs.projectData.projectName
 *  The directory name of your projectDir.
 * @param {unknown} hookArgs.projectData.packageJsonData
 *   The full contents of package.json.
 * @param {unknown} hookArgs.projectData.nsConfig
 *   The full contents of nativescript.config.ts. Defined here:
 *   https://github.com/NativeScript/NativeScript/blob/9ccc54b6035c04e383d9256fb3ad9c0c7b00fa20/packages/core/config/config.interface.ts#L153
 * @param {string} hookArgs.projectData.appDirectoryPath
 * @param {string} hookArgs.projectData.appResourcesDirectoryPath
 *   From nativescript.config.ts. The absolute path to App_Resources.
 * @param {Record<string, string>} hookArgs.projectData.dependencies
 *   From package.json. The record of dependencies.
 * @param {Record<string, string>} hookArgs.projectData.devDependencies
 *   From package.json. The record of devDependencies.
 * @param {string[]} hookArgs.projectData.ignoredDependencies
 *   From nativescript.config.ts. Optionally specify a list of npm package names
 *   for which you would like the NativeScript CLI to ignore when attaching
 *   native dependencies to the build.
 * @param {string} hookArgs.projectData.projectType
 * @param {string} hookArgs.projectData.androidManifestPath
 * @param {string} hookArgs.projectData.infoPlistPath
 * @param {string} hookArgs.projectData.appGradlePath
 * @param {string} hookArgs.projectData.gradleFilesDirectoryPath
 * @param {string} hookArgs.projectData.buildXcconfigPath
 * @param {string} hookArgs.projectData.podfilePath
 * @param {boolean} hookArgs.projectData.isShared
 * @param {string} hookArgs.projectData.previewAppSchema
 * @param {string} hookArgs.projectData.webpackConfigPath
 * @param {boolean} hookArgs.projectData.initialized
 */
module.exports = function (hookArgs) {
  // TODO: search projectData.dependencies (minus any listed in
  // ignoredDependencies) and find all .m and .mm files.
  // Ideally, we should find the podspec (which, although usually in the
  // package root, might actually differ if they've placed a RNCLI config),
  // parse it, and analyse its included sources.
  // From there, we should (ideally strip comments and then) search for
  // mentions of RCT_EXPORT_MODULE and RCT_EXPORT_METHOD, then add categories
  // to a .h file that we finally write into this npm package.
  // Finally, we'll need a ReactNativeTNS.podspec, probably with a dependency
  // on React, that refers to headers in this npm package.
  // @see https://github.com/nativescript-community/expo-nativescript/blob/main/packages/expo-nativescript-adapter/hooks/after-prepare.js
};

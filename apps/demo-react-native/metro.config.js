/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path')
// const exclusionList = require('metro-config/src/defaults/exclusionList')

// e.g. /Users/jamie/nativescript-magic-spells/apps/demo-react-native
const appRoot = path.resolve(__dirname)

// e.g. /Users/jamie/nativescript-magic-spells
const monorepoRoot = path.resolve(__dirname, '../..')

// e.g. /Users/jamie/nativescript-magic-spells/node_modules
// const monorepoNodeModules = path.resolve(monorepoRoot, 'node_modules');

// e.g. /Users/jamie/nativescript-magic-spells/dist/packages
const builtPackages = path.resolve(monorepoRoot, 'dist/packages')

module.exports = {
  projectRoot: appRoot,
  watchFolders: [
    // No need to add `appRoot`, as it's implicitly watched.
    builtPackages,
  ],
  resolver: {
    nodeModulesPaths: [
      // No need to add `monorepoNodeModules`, as it's implicitly found.
      builtPackages,
    ],
    // extraNodeModules: {
    //   'react-native-module-test': path.resolve(builtPackages, 'react-native-module-test'),
    //   react: path.resolve(__dirname, 'node_modules/react'),
    //   'react-native': path.resolve(__dirname, 'node_modules/react-native'),
    // },
    // blockList: exclusionList([
    //   new RegExp(`${monorepoRoot}/node_modules/react/.*`),
    //   new RegExp(`${monorepoRoot}/node_modules/react-native/.*`),
    // ]),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
}

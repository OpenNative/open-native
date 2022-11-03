/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path')
const nodeModulesPaths = [
  path.resolve(path.join(__dirname, '../../node_modules')),
]
module.exports = {
  projectRoot: __dirname,
  watchFolders: [path.join(__dirname, '../../node_modules')],
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs'],
    nodeModulesPaths,
    extraNodeModules: {
      '@open-native/core': path.join(__dirname, '../../packages/core'),
      'react-native-module-test': path.join(
        __dirname,
        '../../packages/react-native-module-test'
      ),
    },
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

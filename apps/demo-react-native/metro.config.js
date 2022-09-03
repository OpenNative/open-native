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
  watchFolders: [
    path.join(__dirname, '../../dist/packages'),
    path.join(__dirname, '../../node_modules'),
  ],
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs'],
    nodeModulesPaths,
    extraNodeModules: {
      '@ammarahm-ed': path.join(__dirname, '../../dist/packages'),
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

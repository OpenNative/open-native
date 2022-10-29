const path = require('path')

// e.g. /Users/jamie/nativescript-magic-spells
const monorepoRoot = path.resolve(__dirname, '../..')

// e.g. /Users/jamie/nativescript-magic-spells/dist/packages
const builtPackages = path.resolve(monorepoRoot, 'dist/packages')

module.exports = {
  // https://github.com/react-native-community/cli/blob/main/docs/dependencies.md
  dependencies: {
    'open-native': {
      root: path.resolve(builtPackages, 'react-native'),
    },
    'react-native-module-test': {
      root: path.resolve(builtPackages, 'react-native-module-test'),
    },
  },
}

// This is a rough-and-ready script for testing
// react-native-podspecs/hooks/before-prepareNativeApp.js.
//
// I run this in packages/react-native-podspecs, via:
// $ node test_hook.js
//
// It spits its output into packages/react-native-podspecs/ios/lib, so make sure
// to discard any changes before committing. Yes, it's a crude process, but for
// now I've found it handy for development. The alternative is running
// `tns build ios` each time, which is simply slower.

const path = require('path');
const fs = require('fs');

const monorepoRoot = path.resolve(__dirname, '../..');
const nsDemoProjectDir = path.resolve(monorepoRoot, 'apps/demo');

const nsDemoPackageJson = JSON.parse(
  fs.readFileSync(path.join(nsDemoProjectDir, 'package.json')).toString()
);

require('./hooks/before-prepareNativeApp')({
  platformData: {
    normalizedPlatformName: 'iOS',
    platformNameLowerCase: 'ios',
  },
  projectData: {
    devDependencies: nsDemoPackageJson.devDependencies,
    dependencies: nsDemoPackageJson.dependencies,
    ignoredDependencies: [],
    projectDir: nsDemoProjectDir,
  },
});

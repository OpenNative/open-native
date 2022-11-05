// This is a rough-and-ready script for testing
// @open-native/core/hooks/before-prepareNativeApp.js.
// It saves running `tns build ios` each time, which is simply slower.
//
// I run this in packages/core, via:
// $ node test_hook.js
//
// It spits its output into
// dist/packages/core/platforms/ios/lib.

const path = require('path');
const fs = require('fs');

const monorepoRoot = path.resolve(__dirname, '../..');
const nsDemoProjectDir = path.resolve(monorepoRoot, 'apps/demo');

const nsDemoPackageJson = JSON.parse(
  fs.readFileSync(path.join(nsDemoProjectDir, 'package.json')).toString()
);

require('../../dist/packages/core/hooks/before-prepareNativeApp')({
  platformData: {
    normalizedPlatformName: 'Android',
    platformNameLowerCase: 'android',
  },
  projectData: {
    devDependencies: nsDemoPackageJson.devDependencies,
    dependencies: nsDemoPackageJson.dependencies,
    ignoredDependencies: [],
    projectDir: nsDemoProjectDir,
  },
});

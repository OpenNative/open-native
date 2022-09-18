const path = require('path');
const fs = require('fs');

const monorepoRoot = path.resolve(__dirname, '../..');
const nsDemoProjectDir = path.resolve(monorepoRoot, 'apps/demo');

const nsDemoPackageJson = JSON.parse(
  fs.readFileSync(path.join(nsDemoProjectDir, 'package.json')).toString()
);

require('./hooks/before-buildIOS')({
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

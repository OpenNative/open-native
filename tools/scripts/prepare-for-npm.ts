const path = require('path');
const fs = require('fs-extra');

const cmdArgs = process.argv.slice(2);
const packageName = cmdArgs[0];

const packagePath = path.join('packages', packageName, 'package-for-npm.json');

const targetBuildPath = path.join('dist', 'packages', packageName);

function copyPackageForNpm() {
  fs.copy(path.join(packagePath), path.join(targetBuildPath, 'package.json'))
    .then(() => {
      console.log('Prepared package for npm.');
    })
    .catch((err) => console.error(err));
}

copyPackageForNpm();

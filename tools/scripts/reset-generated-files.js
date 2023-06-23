const path = require('path');
const fs = require('fs');

// For ease of development (e.g. to facilitate watch mode and hot reloading) in
// the monorepo, and due to the current limitations of hooks, we settled on a
// workflow that involves generating certain files into source directories
// (rather than dist).
//
// The downside of this workflow is that, rather than committing these files in
// their ready-to-publish placeholder state into the repo, we must instruct any
// contributors to run this script upon repo setup (and/or checking out a
// branch) to initialises them into their 'empty' (i.e. no native modules found)
// state. They may be subsequently overwritten if doing local development in the
// monorepo.
//
// At publishing time, the contributor must be sure to restore them to their
// placeholder state by running this script again (or ensure to use the command
// `nx run core:build.npm` as part of the publishing flow, as it runs the
// script for you).
const monorepoRoot = path.resolve(__dirname, '../..');

const includeGradlePath = path.resolve(monorepoRoot, 'packages/core/platforms/android');
if (!fs.existsSync(includeGradlePath)) fs.mkdirSync(includeGradlePath);
fs.writeFileSync(path.join(includeGradlePath, 'include.gradle'), '', 'utf-8');

fs.writeFileSync(path.resolve(monorepoRoot, 'packages/core/react-android/bridge/src/main/java/com/bridge/Packages.java'), '', 'utf-8');

fs.writeFileSync(path.resolve(monorepoRoot, 'packages/core/react-android/bridge/modules.json'), '[]\n', 'utf-8');

fs.writeFileSync(path.resolve(monorepoRoot, 'packages/core/react-android/bridge/modulemap.json'), '{}\n', 'utf-8');

fs.writeFileSync(path.resolve(monorepoRoot, 'packages/core/platforms/ios/Podfile'), '', 'utf-8');

fs.writeFileSync(path.resolve(monorepoRoot, 'packages/core/platforms/ios/lib_community/modulemap.json'), '{}\n', 'utf-8');

fs.writeFileSync(path.resolve(monorepoRoot, 'packages/core/platforms/ios/lib_community/RNPodspecs.h'), '{}\n', 'utf-8');

fs.writeFileSync(path.resolve(monorepoRoot, 'packages/core/platforms/ios/React-Native-Podspecs.podspec'), '{}\n', 'utf-8');

fs.writeFileSync(path.resolve(monorepoRoot, 'packages/core/src/android/view-manager-types.d.ts'), 'export interface ViewManagers {}', 'utf-8');

fs.writeFileSync(path.resolve(monorepoRoot, 'packages/core/src/ios/view-manager-types.d.ts'), 'export interface ViewManagers {}', 'utf-8');

const distExists = fs.existsSync(path.resolve(monorepoRoot, 'dist'));
if (distExists) {
  const includeGradlePathDist = path.resolve(monorepoRoot, 'dist/packages/core/platforms/android');
  if (!fs.existsSync(includeGradlePathDist)) fs.mkdirSync(includeGradlePathDist);
  fs.writeFileSync(path.join(includeGradlePathDist, 'include.gradle'), '', 'utf-8');

  fs.writeFileSync(path.resolve(monorepoRoot, 'dist/packages/core/react-android/bridge/src/main/java/com/bridge/Packages.java'), '', 'utf-8');

  fs.writeFileSync(path.resolve(monorepoRoot, 'dist/packages/core/react-android/bridge/modules.json'), '[]\n', 'utf-8');

  fs.writeFileSync(path.resolve(monorepoRoot, 'dist/packages/core/react-android/bridge/modulemap.json'), '{}\n', 'utf-8');

  fs.writeFileSync(path.resolve(monorepoRoot, 'dist/packages/core/platforms/ios/Podfile'), '', 'utf-8');

  fs.writeFileSync(path.resolve(monorepoRoot, 'dist/packages/core/platforms/ios/lib_community/modulemap.json'), '{}\n', 'utf-8');

  fs.writeFileSync(path.resolve(monorepoRoot, 'dist/packages/core/platforms/ios/lib_community/RNPodspecs.h'), '{}\n', 'utf-8');

  fs.writeFileSync(path.resolve(monorepoRoot, 'dist/packages/core/platforms/ios/React-Native-Podspecs.podspec'), '{}\n', 'utf-8');

  fs.writeFileSync(path.resolve(monorepoRoot, 'dist/packages/core/src/android/view-manager-types.d.ts'), 'export interface ViewManagers {}', 'utf-8');

  fs.writeFileSync(path.resolve(monorepoRoot, 'dist/packages/core/src/ios/view-manager-types.d.ts'), 'export interface ViewManagers {}', 'utf-8');
}

import type { HookArgs } from './hookArgs';
import { writeSettingsGradleFile } from './android/writers/settings-gradle';
import { resolvePackagePath } from '@rigor789/resolve-package-path';
import * as path from 'path';
import * as fs from 'fs';

const logPrefix = '[@open-native/core/hooks/before-prepareNativeApp.js]';

/**
 * autolink any React Native native modules.
 */
export = async function (hookArgs: HookArgs) {
  const platformName = hookArgs?.prepareData?.platform;

  if (platformName !== 'android' && platformName !== 'ios') {
    console.warn(
      `${logPrefix} Unrecognised platform, ${platformName} - unable to link React Native native modules.`
    );
    return;
  }
  const { projectDir } = hookArgs.projectData;
  if (platformName === 'android') {
    await writeSettingsGradleFile(projectDir);
    try {
      const reactNativeDir = resolvePackagePath('react-native', {
        paths: [projectDir],
      });
      const openNativeDir = resolvePackagePath('@open-native/core', {
        paths: [projectDir],
      });
      const nodeModulesDir = path.resolve(path.join(openNativeDir, '../../'));
      if (!reactNativeDir) {
        fs.mkdirSync(path.join(nodeModulesDir, 'react-native'));
        fs.writeFileSync(
          path.join(nodeModulesDir, 'react-native', 'package.json'),
          ''
        );
        fs.mkdirSync(path.join(nodeModulesDir, 'react-native', 'android'));
      }
    } catch (e) {
      console.log('');
    }
  }
};

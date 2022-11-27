import type { HookArgs } from './hookArgs';
import { writeSettingsGradleFile } from './android/writers/settings-gradle';

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
  }
};

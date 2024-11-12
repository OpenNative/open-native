import { exists, readFile, writeFile } from '../common';

export async function writeNamespaceGradleFile(
  buildGradlePath: string,
  packageName: string
) {
  const buildGradleNamespacePatch = `// Mark open-native_core namespace patch
  android {
  namespace "${packageName}"
    `;
  if (!(await exists(buildGradlePath))) return;
  const currentSettingsGradle = await readFile(buildGradlePath, {
    encoding: 'utf-8',
  });
  if (currentSettingsGradle.includes('Mark open-native_core namespace patch'))
    return;

  return await writeFile(
    buildGradlePath,
    [
      currentSettingsGradle.replace(
        /(android\s*\{)/,
        buildGradleNamespacePatch
      ),
    ].join('\n'),
    {
      encoding: 'utf-8',
    }
  );
}

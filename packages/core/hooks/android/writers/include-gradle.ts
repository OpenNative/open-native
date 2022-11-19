import { writeFile } from '../common';

/**
 * @param {object} args
 * @param args.projectNames An array of android project names
 * @returns A Promise to write the include.gradle file into the specified
 * location.
 */
export async function writeIncludeGradleFile({
  projectNames,
  outputIncludeGradlePath,
}: {
  projectNames: string[];
  outputIncludeGradlePath: string;
}) {
  const contents = [
    'dependencies {',
    'implementation project(":bridge")',
    ...projectNames
      .filter((projectName) => projectName !== 'open-native_core')
      .map((projectName) => `implementation project(":${projectName}")`),
    '}',
  ].join('\n');
  return await writeFile(outputIncludeGradlePath, contents, {
    encoding: 'utf-8',
  });
}

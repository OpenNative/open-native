import { writeFile } from '../common';

/**
 * @param {object} args
 * @param args.packageImportPaths An array of package import paths, e.g.:
 *   ['import com.testmodule.RNTestModulePackage;']
 * @param args.packageInstances A corresponding array of package instance
 *   instantiation strings, e.g.:
 *   ['new RNTestModulePackage()']
 * @returns A Promise to write the Packages.java file into the specified
 *   location.
 */
export async function writeModulesJsonFile({
  modules,
  outputModulesJsonPath,
}: {
  modules: {
    packageName: string;
    absolutePath: string;
    androidProjectName: string;
  }[];
  outputModulesJsonPath: string;
}) {
  return await writeFile(
    outputModulesJsonPath,
    JSON.stringify(modules, null, 2),
    { encoding: 'utf-8' }
  );
}

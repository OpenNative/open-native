import { RNJavaSerialisableType, writeFile } from '../common';

/**
 * @param {object} args
 * @param args.moduleMap
 * @returns A Promise to write the modulemap.json file into the specified
 *   location.
 */
export async function writeModuleMapFile({
  moduleMap,
  outputModuleMapPath,
}: {
  moduleMap: {
    [exportedModuleName: string]: {
      /** jsModuleName */
      j: string;
      /** exportsConstants */
      e: boolean;
      /** methods */
      m: {
        [methodName: string]: {
          /** isBlockingSynchronousMethod */
          b: boolean;
          /** jsMethodName */
          j: string;
          /** types */
          t: RNJavaSerialisableType[];
        };
      };
    };
  };
  outputModuleMapPath: string;
}) {
  return await writeFile(
    outputModuleMapPath,
    JSON.stringify(moduleMap, null, 0),
    {
      encoding: 'utf-8',
    }
  );
}

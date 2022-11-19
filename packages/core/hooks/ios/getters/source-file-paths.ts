import { globProm } from '../common';

/**
 * Build a unique-membered array of source files referenced by a podspec.
 * @param {object} args
 * @param args.commonSourceFiles The `source_files` value from the podspec.
 * @param args.iosSourceFiles The `ios.source_files` from the podspec.
 * @param args.packagePath The cwd to search for source file paths relative to.
 *   Should be the path to the directory containing the podspec.
 */

export async function getSourceFilePaths({
  commonSourceFiles,
  iosSourceFiles,
  cwd,
}: {
  commonSourceFiles: string | string[];
  iosSourceFiles: string | string[];
  cwd: string;
}) {
  // Normalise to an array, treating empty-string as an empty array.
  const commonSourceFilesArr = commonSourceFiles
    ? Array.isArray(commonSourceFiles)
      ? commonSourceFiles
      : [commonSourceFiles]
    : [];
  const iosSourceFilesArr = iosSourceFiles
    ? Array.isArray(iosSourceFiles)
      ? iosSourceFiles
      : [iosSourceFiles]
    : [];

  // Take all the distinct patterns.
  const platformSourceFilesArr = [
    ...new Set([...commonSourceFilesArr, ...iosSourceFilesArr]),
  ];

  const sourceFilePathsArrays = await Promise.all(
    platformSourceFilesArr.map(
      async (pattern) => await globProm(pattern, { cwd, absolute: true })
    )
  );

  /**
   * Look just for Obj-C, Swift and Obj-C++ implementation files, ignoring headers.
   * @example
   * [
   *   '/Users/jamie/Documents/git/nativescript-magic-spells/dist/packages/react-native-module-test/ios/RNTestModule.m'
   * ]
   */
  const sourceFilePaths = [...new Set(sourceFilePathsArrays.flat(1))].filter(
    (sourceFilePath) => /\.(mm?|swift)$/.test(sourceFilePath)
  );
  return sourceFilePaths;
}

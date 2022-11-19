import { writeFile } from '../common';

/**
 * @param {object} args
 * @param args.headerEntries Sections of the header file to be filled in.
 * @param args.outputHeaderPath An absolute path to output the header to.
 * @returns A Promise to write the header file into the specified location.
 */
export async function writeRNPodspecsHeaderFile({
  importDecls,
  headerEntries,
  outputHeaderPath,
}: {
  importDecls: string[];
  headerEntries: string[];
  outputHeaderPath: string;
}) {
  const RNPodspecsInterface = [
    '// START: react-native-podspecs placeholder interface',
    '@interface RNPodspecs: NSObject',
    '@end',
    '// END: react-native-podspecs placeholder interface',
  ].join('\n');

  // The core modules will return empty headerEntries and importDecls, so we
  // filter them out for neatness.
  const header = [
    '// This file will be updated automatically by hooks/before-prepareNativeApp.js.',
    '#import <React/RCTBridgeModule.h>',
    '#import <React/RCTEventEmitter.h>',
    importDecls.filter((importDecl) => importDecl).join('\n'),
    '',
    headerEntries.filter((headerEntry) => headerEntry).join('\n\n'),
    '',
    RNPodspecsInterface,
    '',
  ].join('\n');

  return await writeFile(outputHeaderPath, header, { encoding: 'utf-8' });
}

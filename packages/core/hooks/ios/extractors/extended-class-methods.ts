import { readFileSync } from '../common';

export function extractExtendedClassMethods(
  objcClassName: string,
  sourceFiles: string[]
) {
  let extraMethodDefs = '';
  // Extract contents of any other source files
  // that might extend this class with some
  // react methods but are not react modules.
  for (const file of sourceFiles) {
    const contents = readFileSync(file, { encoding: 'utf-8' });
    if (
      contents.includes(`@implementation ${objcClassName} `) &&
      !contents.includes('RCT_EXPORT_MODULE')
    ) {
      extraMethodDefs += contents;
    }
  }
  return extraMethodDefs;
}

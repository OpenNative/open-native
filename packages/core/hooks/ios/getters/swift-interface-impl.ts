import * as fs from 'fs';

export function getSwiftInterfaceImplementationFile(
  objcName: string,
  files: string[]
) {
  for (const file of files) {
    const contents = fs.readFileSync(file, { encoding: 'utf8' });
    if (contents.includes(`@objc(${objcName})`)) {
      return file;
    }
  }
  return null;
}

/**
 * Finds and returns the swift implementation of an
 * ObjC interface.
 */
export function getSwiftInterfaceImplementationContents(
  objcName: string,
  files: string[]
) {
  for (const file of files) {
    const contents = fs.readFileSync(file, { encoding: 'utf8' });
    if (contents.includes(`@objc(${objcName})`)) {
      return contents;
    }
  }
  return null;
}

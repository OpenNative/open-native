import { readFileSync, writeFile } from '../common';

const ANDROID_PRIVATE_METHOD_REGEX =
  /(?:@Override|@ReactMethod)[\s\S]*?private[\s\S]*?[{;]/gm;
const REACT_METHOD_ANNOTATION = '@ReactMethod';

/**
 * Loads module contents
 *
 * @param modulePath Absolute path to the module file
 * @returns
 */
export function loadModuleContents(modulePath: string) {
  const contents = readFileSync(modulePath, { encoding: 'utf-8' });
  const matchedPrivateMethods = contents.match(ANDROID_PRIVATE_METHOD_REGEX);
  let updatedContents = contents;
  if (modulePath.endsWith('.kt') && !contents.includes('//#kotlin')) {
    updatedContents += `\n//#kotlin`;
  }

  // If module has private @ReactMethod annotations, we make them public
  // so that they are available in JS.
  if (matchedPrivateMethods) {
    const tokens = updatedContents.split('\n');
    updatedContents = tokens
      .map((token, index) => {
        if (
          token.match(/private[\s\S]*?[{;]/gm) &&
          (tokens[index - 1].includes(REACT_METHOD_ANNOTATION) ||
            token.includes(REACT_METHOD_ANNOTATION))
        ) {
          token = token.replace('private', 'public');
        }
        return token;
      })
      .join('\n');
    writeFile(modulePath, updatedContents, {
      encoding: 'utf-8',
    });
    return updatedContents;
  }
  return updatedContents;
}

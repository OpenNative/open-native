import { readFile, writeFile } from '../common';

const ANDROID_PRIVATE_METHOD_REGEX =
  /(?:@Override|@ReactMethod)[\s\S]*?private[\s\S]*?[{;]/gm;
const REACT_METHOD_ANNOTATION = '@ReactMethod';

/**
 * Loads module contents
 *
 * @param modulePath Absolute path to the module file
 * @returns
 */
export async function loadModuleContents(modulePath: string) {
  const contents = await readFile(modulePath, { encoding: 'utf-8' });
  const matchedPrivateMethods = contents.match(ANDROID_PRIVATE_METHOD_REGEX);

  // If module has private @ReactMethod annotations, we make them public
  // so that they are available in JS.
  if (matchedPrivateMethods) {
    const tokens = contents.split('\n');
    const updatedContent = tokens
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
    await writeFile(modulePath, updatedContent, {
      encoding: 'utf-8',
    });
    return updatedContent;
  }

  return contents;
}

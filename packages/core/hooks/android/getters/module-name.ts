import * as fs from 'fs';

const ANDROID_GET_NAME_FN_REGEX = /getName\(\)[\s\S]*?\{[^}]*\}/gm;
const ANDROID_MODULE_NAME_REGEX = /(?<=return ).*(?=;)/gm;

/**
 * Gets the exported name for the module, or null if there's no such match.
 * @example 'IntentAndroid', for the class named 'IntentModule'.
 */
export function getModuleName(
  moduleContents: string,
  files: string[]
): string | null {
  let getNameFunctionReturnValue = moduleContents
    .match(ANDROID_GET_NAME_FN_REGEX)?.[0]
    .match(ANDROID_MODULE_NAME_REGEX)?.[0]
    .trim();
  // The module doesn't have a getName() method at all. It may be a spec, or not
  // a ReactModule in the first place.
  if (!getNameFunctionReturnValue) {
    return null;
  }
  let variableDefinitionLine;
  if (getNameFunctionReturnValue.startsWith(`"`))
    return getNameFunctionReturnValue.replace(/"/g, '');

  // Handle scoped variables such as RNTestCaseScopedNameVariable.NAME;
  // This will extract moduleName from the correct class by searching
  // the classes in the Package.
  if (getNameFunctionReturnValue.indexOf('.') > -1) {
    const split = getNameFunctionReturnValue.split('.');
    const className = split[0] + '.java';
    getNameFunctionReturnValue = split[1];
    for (const file of files) {
      if (file.includes(`/${className}`)) {
        variableDefinitionLine = fs
          .readFileSync(file, { encoding: 'utf-8' })
          .split('\n')
          .find((line) =>
            line.includes(`String ${getNameFunctionReturnValue}`)
          );
      }
    }
  }

  if (!variableDefinitionLine) {
    variableDefinitionLine = moduleContents
      .split('\n')
      .find((line) => line.includes(`String ${getNameFunctionReturnValue}`));
  }

  return variableDefinitionLine.split(`"`)[1];
}

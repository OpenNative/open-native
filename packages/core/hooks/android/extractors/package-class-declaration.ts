/**
 * @param file the contents of the *ModulePackage.java file.
 * @returns a RegExpArray matching the class declaration.
 * @example
 * [
 *   'class RNTestModulePackage implements ReactPackage',
 *   'RNTestModulePackage',
 * ]
 */
export function extractClassDeclarationForPackage(file: string) {
  // We first check for implementation of ReactPackage to find native modules
  // and then for subclasses of TurboReactPackage to find turbo modules.

  const classDeclMatches =
    file.match(
      /class\s+(\w+[^(\s]*)[\s\w():]*(\s+implements\s+|:)[\s\w():,]*[^{]*ReactPackage/
    ) ||
    file.match(
      /class\s+(\w+[^(\s]*)[\s\w():]*(\s+extends\s+|:)[\s\w():,]*[^{]*TurboReactPackage/
    );

  if (
    classDeclMatches &&
    new RegExp(`abstract\\s+class\\s+${classDeclMatches[1]}`).test(file)
  )
    return;

  return classDeclMatches;
}

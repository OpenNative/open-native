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
  const nativeModuleMatch = file.match(
    /class\s+(\w+[^(\s]*)[\s\w():]*(\s+implements\s+|:)[\s\w():,]*[^{]*ReactPackage/
  );
  // We first check for implementation of ReactPackage to find native modules
  // and then for subclasses of TurboReactPackage to find turbo modules.
  if (nativeModuleMatch) {
    return nativeModuleMatch;
  } else {
    return file.match(
      /class\s+(\w+[^(\s]*)[\s\w():]*(\s+extends\s+|:)[\s\w():,]*[^{]*TurboReactPackage/
    );
  }
}

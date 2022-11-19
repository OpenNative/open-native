const MODULE_IMPORT_PATH_REGEX = /(?<=package ).*(?=;)/gm;
/**
 * Get the module's import path from module file contents.
 * @param moduleContents
 * @returns
 */
export function getModuleImportPath(moduleContents: string) {
  return moduleContents.match(MODULE_IMPORT_PATH_REGEX)?.[0];
}

/**
 * Gets the aliased name for a bridge module if there is one.
 * @param classImplementation The source code for the bridge module's
 *   class implementation.
 * @returns The aliased name for the bridge module as a string, or undefined if
 *   no alias was registered (in which case, the Obj-C class name should be used
 *   for the bridge module as-is).
 */
export function extractModuleAliasedName(
  classImplementation: string
): string | undefined {
  const exportModuleMatches = [
    ...classImplementation.matchAll(/RCT_EXPORT_MODULE\((.*)\)/gm),
  ];
  const exportModuleNoLoadMatches = [
    ...classImplementation.matchAll(/RCT_EXPORT_MODULE_NO_LOAD\((.*)\)/gm),
  ];
  const exportPreRegisteredModuleNoLoadMatches = [
    ...classImplementation.matchAll(
      /RCT_EXPORT_PRE_REGISTERED_MODULE\((.*)\)/gm
    ),
  ];

  return (
    exportModuleMatches[0]?.[1] ||
    exportModuleNoLoadMatches[0]?.[1] ||
    exportPreRegisteredModuleNoLoadMatches[0]?.[1]
  );
}

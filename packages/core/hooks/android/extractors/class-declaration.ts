/**
 * @param file the contents of the *Module.java file.
 * @returns a RegExpArray matching class declarations of native modules.
 * @example
 * A ReactModule:
 * [
 *    '@ReactModule(name = IntentModule.NAME)\npublic class IntentModule extends NativeIntentAndroidSpec {',
 *    'IntentModule',
 * ]
 * @example
 * A TurboModule:
 * [
 *   'class NativeIntentAndroidSpec extends ReactContextBaseJavaModule implements ReactModuleWithSpec, TurboModule',
 *   'NativeIntentAndroidSpec',
 *   ' implements ',
 * ]
 * @example
 * ... or a classic native module:
 * [
 *   'class RNTestModule extends ReactContextBaseJavaModule',
 *   'RNTestModule',
 * ]
 */
export function extractClassDeclarationForModule(file: string) {
  // Match any class with the @ReactModule annotation.
  const reactModuleMatch =
    file.match(
      /@ReactModule\([\s\S]*public class\s+(\w+[^(\s]*)[\s\w():]*.*{/
    ) ||
    file.match(
      /@ReactModule\([\s\S]*public final class\s+(\w+[^(\s]*)[\s\w():]*.*{/
    );
  if (reactModuleMatch) return reactModuleMatch;

  // Match any class that implements TurboModule.
  const turboModuleMatch =
    /import\s+com\.facebook\.react\.turbomodule\.core\.interfaces\.TurboModule\s*;/.test(
      file
    ) &&
    file.match(
      /class\s+(\w+[^(\s]*)[\s\w():]*(\s+implements\s+|:)[\s\w():,]*[^{]*TurboModule/
    );
  if (turboModuleMatch) return turboModuleMatch;

  const viewManagerMatch =
    file.match(
      /public class\s+(\w+[^(\s]*)[\s\w():]*(\s+extends\s+|:)[\s\w():,]*[^{]*SimpleViewManager/
    ) ||
    file.match(
      /public class\s+(\w+[^(\s]*)[\s\w():]*(\s+extends\s+|:)[\s\w():,]*[^{]*ViewGroupManager/
    ) ||
    file.match(/class\s+(\w+)(\s+|)\(.*\)(\s+|):(\s+|)ViewGroupManager/);

  if (viewManagerMatch) {
    return viewManagerMatch;
  }

  // Match any class that extends ReactContextBaseJavaModule and is public.
  const publicModuleMatch = file.match(
    /public class\s+(\w+[^(\s]*)[\s\w():]*(\s+extends\s+|:)[\s\w():,]*[^{]*(ReactContextBaseJavaModule | SimpleViewManager)/
  );
  if (publicModuleMatch) return publicModuleMatch;

  const moduleMatch = file.match(
    /class\s+(\w+[^(\s]*)[\s\w():]*(\s+extends\s+|:)[\s\w():,]*[^{]*ReactContextBaseJavaModule/
  );

  if (moduleMatch) return moduleMatch;

  const ktModuleMatch = file.match(
    /class\s+(\w+)(\s+|)\(.*\)(\s+|):(\s+|)ReactContextBaseJavaModule/gm
  );

  return ktModuleMatch;
}
